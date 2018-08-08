const { inLogs } = require('openzeppelin-solidity/test/helpers/expectEvent');
const { expectThrow } = require('openzeppelin-solidity/test/helpers/expectThrow');
const { EVMRevert } = require('openzeppelin-solidity/test/helpers/EVMRevert');
const { ether } = require('openzeppelin-solidity/test/helpers/ether')

const World = artifacts.require('World')
const BidLand = artifacts.require('BidLand')
const LandPotAuction = artifacts.require('LandPotAuction')

const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract('LandPotAuction', (accounts) => {
  const creator = accounts[0]
  
  beforeEach(async () => {
    this.world = await World.new()
    this.bidLand = await BidLand.new(this.world.address)
    this.landPotAuction = await LandPotAuction.new(this.bidLand.address)
  })

  describe('plotPositionToIndex', () => {
    it('(-3,-3)', async () => {
      const index = await this.landPotAuction.plotPositionToIndex.call(-3, -3)
      index.toNumber().should.be.equal(0)
    })
    it('(0,0)', async () => {
      const index = await this.landPotAuction.plotPositionToIndex.call(0, 0)
      index.toNumber().should.be.equal(24)
    })
  })

  describe('plotIndexToPosition', () => {
    it('0', async () => {
      const data = await this.landPotAuction.plotIndexToPosition.call(0)
      data[0].toNumber().should.be.equal(-3)
      data[1].toNumber().should.be.equal(-3)
    })
    it('24', async () => {
      const data = await this.landPotAuction.plotIndexToPosition.call(24)
      data[0].toNumber().should.be.equal(0)
      data[1].toNumber().should.be.equal(0)
    })
  })

  beforeEach(async () => {
    await this.world.create(0, { from: creator })
    await this.bidLand.authorize(this.landPotAuction.address, { from: creator })
    await this.landPotAuction.startAuction(1, 1, { from: creator })
  })

  describe('startAuction', () => {
    it('has created empty plots', async () => {
      const data = await this.landPotAuction.getPlot.call(0, 0)
      data[0].toNumber().should.be.equal(0) // x
      data[1].toNumber().should.be.equal(0) // y
      data[2].toString().should.be.equal("0x0000000000000000000000000000000000000000") // bidder
      data[3].toNumber().should.be.equal(0) // team
      data[4].toNumber().should.be.equal(0) // current bid
    })
    it('has future ending time', async () => {
      const endingTime = await this.landPotAuction.getEndingTime.call()
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

    beforeEach(async () => {
      const { logs } = await this.landPotAuction.bid(0, 0, team1, { from: bidder1, value: bid1 });
      this.logs = logs
    })

    describe('succeed bid on empty plot', () => {
      it('current bidder and bid changed', async () => {
        const data = await this.landPotAuction.getPlot.call(0, 0)
        data[2].should.eq(bidder1)
        data[3].should.be.bignumber.equal(team1)
        data[4].should.be.bignumber.equal(finney) // first bit is always 1 finney
      })
      it('emitted Bid event', async () => {
        const event = await inLogs(this.logs, 'Bid')
        event.args.x.should.be.bignumber.equal(0)
        event.args.y.should.be.bignumber.equal(0)
        event.args.bidder.should.eq(bidder1)
        event.args.team.should.be.bignumber.equal(team1)
        event.args.currentBid.should.be.bignumber.equal(finney) // first bit is always 1 finney
      })
    })

    describe('failed bid with low price', () => {
      beforeEach(async () => {
        const { logs } = await this.landPotAuction.bid(0, 0, team2, { from: bidder2, value: bid2failed });
        this.logs = logs
      })
      it('current bidder didnt changed but current bid changed', async () => {
        const data = await this.landPotAuction.getPlot.call(0, 0)
        data[2].should.eq(bidder1)
        data[3].should.be.bignumber.equal(team1)
        data[4].should.be.bignumber.equal(ether(0.201)) // current bid should be bid price + 1 finney
      })
      it('emitted OutBid event', async () => {
        const event = await inLogs(this.logs, 'OutBid')
        event.args.x.should.be.bignumber.equal(0)
        event.args.y.should.be.bignumber.equal(0)
        event.args.oldBidder.should.eq(bidder2)
        event.args.bidder.should.eq(bidder1)
        event.args.team.should.be.bignumber.equal(team1)
        event.args.currentBid.should.be.bignumber.equal(ether(0.201))
      })
    })

    describe('success bid with higher price', () => {
      beforeEach(async () => {
        const { logs } = await this.landPotAuction.bid(0, 0, team2, { from: bidder2, value: bid2success });
        this.logs = logs
      })
      it('current bidder and bid changed', async () => {
        const data = await this.landPotAuction.getPlot.call(0, 0)
        data[2].should.eq(bidder2)
        data[3].should.be.bignumber.equal(team2)
        data[4].should.be.bignumber.equal(ether(0.501).toNumber())
      })
      it('emitted OutBid event', async () => {
        let event = await inLogs(this.logs, 'OutBid')
        event.args.x.should.be.bignumber.equal(0)
        event.args.y.should.be.bignumber.equal(0)
        event.args.oldBidder.should.eq(bidder1)
        event.args.bidder.should.eq(bidder2)
        event.args.team.should.be.bignumber.equal(team2)
        event.args.currentBid.should.be.bignumber.equal(ether(0.501).toNumber())
      })
      it('emitted Bid event', async () => {
        event = await inLogs(this.logs, 'Bid')
        event.args.x.should.be.bignumber.equal(0)
        event.args.y.should.be.bignumber.equal(0)
        event.args.bidder.should.eq(bidder2)
        event.args.team.should.be.bignumber.equal(team2)
        event.args.currentBid.should.be.bignumber.equal(ether(0.501).toNumber())
      })
      it('total balances added', async () => {
        const totalBalance = await this.landPotAuction.totalBalance.call()
        totalBalance.should.be.bignumber.equal(bid1)
      })
      it('correct balance of first bidder', async () => {
        const balance = await this.landPotAuction.balanceOfMe.call({ from: bidder1 })
        balance.should.be.bignumber.equal(bid1)
      })
    })
  })

})