const { inLogs } = require('openzeppelin-solidity/test/helpers/expectEvent');
const { assertRevert } = require('openzeppelin-solidity/test/helpers/assertRevert')
const { ether } = require('openzeppelin-solidity/test/helpers/ether')

const World = artifacts.require('World')
const BidLand = artifacts.require('BidLand')
const LandPlotAuction = artifacts.require('LandPlotAuction')

const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('LandPlotAuction', (accounts) => {
  const creator = accounts[0]
  
  beforeEach(async () => {
    this.world = await World.new()
    this.bidLand = await BidLand.new(this.world.address)
    this.landPlotAuction = await LandPlotAuction.new(this.bidLand.address)
  })

  describe('plotPositionToIndex', () => {
    it('(1,1)', async () => {
      const index = await this.landPlotAuction.plotPositionToIndex.call(1, 1)
      index.toNumber().should.be.equal(0)
    })
    it('(2,3)', async () => {
      const index = await this.landPlotAuction.plotPositionToIndex.call(2, 3)
      index.toNumber().should.be.equal(9)
    })
    it('(0,0) reverted', async () => {
      await assertRevert(this.landPlotAuction.plotPositionToIndex.call(0, 0))
    })
    it('(8,7) reverted', async () => {
      await assertRevert(this.landPlotAuction.plotPositionToIndex.call(8, 7))
    })
  })

  describe('plotIndexToPosition', () => {
    it('0', async () => {
      const data = await this.landPlotAuction.plotIndexToPosition.call(0)
      data[0].toNumber().should.be.equal(1)
      data[1].toNumber().should.be.equal(1)
    })
    it('9', async () => {
      const data = await this.landPlotAuction.plotIndexToPosition.call(9)
      data[0].toNumber().should.be.equal(2)
      data[1].toNumber().should.be.equal(3)
    })
    it('-10 reverted', async () => {
      await assertRevert(this.landPlotAuction.plotIndexToPosition.call(-10))
    })
    it('43 reverted', async () => {
      await assertRevert(this.landPlotAuction.plotIndexToPosition.call(43))
    })
  })

  beforeEach(async () => {
    await this.world.create(0, { from: creator })
    await this.bidLand.authorize(this.landPlotAuction.address, { from: creator })
    await this.landPlotAuction.startAuction(1, 1, { from: creator })
  })

  describe('startAuction', () => {
    it('has created empty plots', async () => {
      const data = await this.landPlotAuction.getPlot.call(1, 1)
      data[0].toNumber().should.be.equal(1) // x
      data[1].toNumber().should.be.equal(1) // y
      data[2].toString().should.be.equal("0x0000000000000000000000000000000000000000") // bidder
      data[3].toNumber().should.be.equal(0) // team
      data[4].toNumber().should.be.equal(0) // current bid
    })
    it('has future ending time', async () => {
      const endingTime = await this.landPlotAuction.getEndingTime.call()
      const endingDate = new Date(0)
      endingDate.setUTCSeconds(endingTime.toNumber())
      endingDate.should.be.greaterThan(new Date())
    })
  })

  describe('bid', () => {
    const bidder1 = accounts[1]
    const bidder2 = accounts[2]
    const team1 = 1
    const team2 = 2
    const bid1 = ether(0.5)
    const bid2failed = ether(0.2)
    const bid2success = ether(0.7)
    const finney = ether(0.001)

    it('failed bidding with less than 1 finney', async () => {
      await assertRevert(this.landPlotAuction.bid(1, 1, team1, ether(0.0005), { from: bidder1, value: ether(0.0005) }))
    })

    beforeEach(async () => {
      ({ logs: this.logs } = await this.landPlotAuction.bid(1, 1, team1, bid1, { from: bidder1, value: bid1 }))
    })

    describe('succeed bid on empty plot', () => {
      it('current bidder and bid changed', async () => {
        const data = await this.landPlotAuction.getPlot.call(1, 1)
        data[2].should.eq(bidder1)
        data[3].should.be.bignumber.equal(team1)
        data[4].should.be.bignumber.equal(finney) // first bit is always 1 finney
      })
      it('emitted Bid event', async () => {
        const event = await inLogs(this.logs, 'Bid')
        event.args.x.should.be.bignumber.equal(1)
        event.args.y.should.be.bignumber.equal(1)
        event.args.bidder.should.eq(bidder1)
        event.args.team.should.be.bignumber.equal(team1)
        event.args.currentBid.should.be.bignumber.equal(finney) // first bit is always 1 finney
      })
    })

    describe('failed bid with less than max bid', () => {
      beforeEach(async () => {
        ({ logs: this.logs } = await this.landPlotAuction.bid(1, 1, team2, bid2failed, { from: bidder2, value: bid2failed }))
      })
      it('current bidder didnt changed but current bid changed', async () => {
        const data = await this.landPlotAuction.getPlot.call(1, 1)
        data[2].should.eq(bidder1)
        data[3].should.be.bignumber.equal(team1)
        data[4].should.be.bignumber.equal(ether(0.2)) // current bid should be bid price
      })
      it('emitted Bid event', async () => {
        const event = await inLogs(this.logs, 'Bid')
        event.args.x.should.be.bignumber.equal(1)
        event.args.y.should.be.bignumber.equal(1)
        event.args.oldBidder.should.eq(bidder2)
        event.args.bidder.should.eq(bidder1)
        event.args.team.should.be.bignumber.equal(team1)
        event.args.currentBid.should.be.bignumber.equal(ether(0.2))
      })
      it('total balances added', async () => {
        const totalBalance = await this.landPlotAuction.totalBalance.call()
        totalBalance.should.be.bignumber.equal(bid2failed)
      })
      it('balance return to second bidder is correct', async () => {
        const balance = await this.landPlotAuction.balances.call(bidder2)
        balance.should.be.bignumber.equal(bid2failed)
      })
    })

    describe('succeed bid with higher than max bid', () => {
      beforeEach(async () => {
        ({ logs: this.logs } = await this.landPlotAuction.bid(1, 1, team2, bid2success, { from: bidder2, value: bid2success }))
      })
      it('current bidder and bid changed', async () => {
        const data = await this.landPlotAuction.getPlot.call(1, 1)
        data[2].should.eq(bidder2)
        data[3].should.be.bignumber.equal(team2)
        data[4].should.be.bignumber.equal(ether(0.5))
      })
      it('emitted Bid event', async () => {
        const event = await inLogs(this.logs, 'Bid')
        event.args.x.should.be.bignumber.equal(1)
        event.args.y.should.be.bignumber.equal(1)
        event.args.oldBidder.should.eq(bidder1)
        event.args.bidder.should.eq(bidder2)
        event.args.team.should.be.bignumber.equal(team2)
        event.args.currentBid.should.be.bignumber.equal(ether(0.5))
      })
      it('total balances added', async () => {
        const totalBalance = await this.landPlotAuction.totalBalance.call()
        totalBalance.should.be.bignumber.equal(bid1)
      })
      it('balance of first bidder added', async () => {
        const balance = await this.landPlotAuction.balances.call(bidder1)
        balance.should.be.bignumber.equal(bid1)
      })
    })
  
    describe('bid with remaining balance', () => {
      beforeEach(async () => {
        await this.landPlotAuction.bid(1, 1, team2, bid2failed, { from: bidder2, value: bid2failed });
      })
      it('reverted for insufficient fund', async () => {
        await assertRevert(this.landPlotAuction.bid(1, 1, team2, bid2success, { from: bidder2, value: 0 }))
      })
      describe('succeed for sufficient fund', () => {
        beforeEach(async () => {
          await this.landPlotAuction.bid(1, 1, team2, bid2success, { from: bidder2, value: ether(0.5) })
        })
        it('current bidder and bid changed', async () => {
          const data = await this.landPlotAuction.getPlot.call(1, 1)
          data[2].should.eq(bidder2)
          data[3].should.be.bignumber.equal(team2)
          data[4].should.be.bignumber.equal(ether(0.5))
        })
        it('total balances emptied', async () => {
          const totalBalance = await this.landPlotAuction.totalBalance.call()
          totalBalance.should.be.bignumber.equal(bid1)
        })
        it('balance of second bidder emptied', async () => {
          const balance = await this.landPlotAuction.balances.call(bidder2)
          balance.should.be.bignumber.equal(0)
        })
      })
    })
  })

  describe('finalizeAuction', () => {
    const bidder1 = accounts[1]
    const bidder2 = accounts[2]
    const bidder3 = accounts[3]
    const team1 = 1
    const team2 = 2
    
    beforeEach(async () => {
      await this.landPlotAuction.bid(1, 1, team1, ether(0.3), { from: bidder1, value: ether(0.3) })
      await this.landPlotAuction.bid(1, 1, team2, ether(0.4), { from: bidder2, value: ether(0.4) })
      await this.landPlotAuction.bid(1, 2, team2, ether(0.5), { from: bidder2, value: ether(0.5) })
      await this.landPlotAuction.bid(1, 2, team1, ether(0.7), { from: bidder1, value: ether(0.4) }) // Bidder 1 has 0.3 balance
      await this.landPlotAuction.bid(1, 3, team2, ether(0.8), { from: bidder2, value: ether(0.3) }) // Bidder 2 has 0.5 balance
      await this.landPlotAuction.bid(1, 3, team1, ether(0.9), { from: bidder3, value: ether(0.9) })
    })
    it('bidder 2 win (1,1)', async () => {
      const data = await this.landPlotAuction.getPlot(1, 1)
      data[2].should.eq(bidder2)
      data[3].should.be.bignumber.equal(team2)
      data[4].should.be.bignumber.equal(ether(0.3))
    })
    it('bidder 1 win (1,2)', async () => {
      const data = await this.landPlotAuction.getPlot(1, 2)
      data[2].should.eq(bidder1)
      data[3].should.be.bignumber.equal(team1)
      data[4].should.be.bignumber.equal(ether(0.5))
    })
    it('bidder 3 win (1,3)', async () => {
      const data = await this.landPlotAuction.getPlot(1, 3)
      data[2].should.eq(bidder3)
      data[3].should.be.bignumber.equal(team1)
      data[4].should.be.bignumber.equal(ether(0.8))
    })
    describe('finalize auction', () => {
      beforeEach(async () => {
        await this.landPlotAuction.endAuction({ from: creator });
        ({ logs: this.logs } = await this.landPlotAuction.finalizeAuction(bidder3, team1, { from: creator }))
      })
      it('bidder1 refunded and rewarded', async () => {
        const jackpot = await this.landPlotAuction.jackpot()
        const balance = await this.landPlotAuction.balances(bidder1)
        balance.should.be.bignumber.equal(ether(0.52)) // refund=0.7-0.5 reward=1.6*.2=0.32
        // const event = await inLogs(this.logs, 'Refund', { bidder: bidder1 })
        // event.args.x.should.be.bignumber.equal(1)
        // event.args.y.should.be.bignumber.equal(2)
        // event.args.weiAmount.should.be.bignumber.equal(ether(0.2))
      })
      it('bidder2 refunded', async () => {
        const balance = await this.landPlotAuction.balances(bidder2)
        balance.should.be.bignumber.equal(ether(0.9)) // 0.8+(0.4-0.3)
      })
      it('bidder3 refunded and rewarded', async () => {
        const balance = await this.landPlotAuction.balances(bidder3)
        balance.should.be.bignumber.equal(ether(0.74)) // refund=0.9-0.8 reward=1.6*.4=0.64
      })
      it('jackpot added', async () => {
        const jackpot = await this.landPlotAuction.jackpot()
        jackpot.should.be.bignumber.equal(ether(0.64)) // 1.6*.4=0.64
      })
      it('bidder3 owned the land (1,1)', async () => {
        const landOwner = await this.bidLand.ownerOfLand(0, 1, 1)
        landOwner.should.eq(bidder3)
      })
      it('land (1,1) has correct bid price', async () => {
        const bidPrice = await this.bidLand.biddingPriceOfLand(0, 1, 1)
        bidPrice.should.be.bignumber.equal(ether(1.6))
      })
    })
  })

})