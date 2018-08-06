const expectEvent = require('openzeppelin-solidity/test/helpers/expectEvent');
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

  // describe('plotPositionToIndex', () => {
  //   it('(-3,-3)', async () => {
  //     const index = await this.landPotAuction.plotPositionToIndex.call(-3, -3)
  //     index.toNumber().should.be.equal(0)
  //   })
  //   it('(0,0)', async () => {
  //     const index = await this.landPotAuction.plotPositionToIndex.call(0, 0)
  //     index.toNumber().should.be.equal(24)
  //   })
  // })

  // describe('plotIndexToPosition', () => {
  //   it('0', async () => {
  //     const data = await this.landPotAuction.plotIndexToPosition.call(0)
  //     data[0].toNumber().should.be.equal(-3)
  //     data[1].toNumber().should.be.equal(-3)
  //   })
  //   it('24', async () => {
  //     const data = await this.landPotAuction.plotIndexToPosition.call(24)
  //     data[0].toNumber().should.be.equal(0)
  //     data[1].toNumber().should.be.equal(0)
  //   })
  // })

  beforeEach(async () => {
    await this.world.create(0, { from: creator })
    await this.bidLand.authorize(this.landPotAuction.address, { from: creator })
    await this.landPotAuction.startAuction(1, 1, { from: creator })
  })

  // describe('startAuction', () => {
  //   it('has created empty plots', async () => {
  //     const data = await this.landPotAuction.getPlot.call(0, 0)
  //     data[0].toNumber().should.be.equal(0) // x
  //     data[1].toNumber().should.be.equal(0) // y
  //     data[2].toString().should.be.equal("0x0000000000000000000000000000000000000000") // bidder
  //     data[3].toNumber().should.be.equal(0) // team
  //     data[4].toNumber().should.be.equal(0) // current bid
  //   })
  //   it('has future ending time', async () => {
  //     const endingTime = await this.landPotAuction.getEndingTime.call()
  //     const endingDate = new Date(0)
  //     endingDate.setUTCSeconds(endingTime.toNumber())
  //     endingDate.should.be.greaterThan(new Date())
  //   })
  // })

  describe('bid', () => {
    const bidder1 = accounts[1]
    const bidder2 = accounts[2]
    const team1 = 0
    const team2 = 1
    const bid1 = ether(0.005)
    const bid2failed = ether(0.002)

    beforeEach(async () => {
      await this.landPotAuction.bid(0, 0, team1, { from: bidder1, value: bid1 });
    })

    it('success bid on empty plot', async () => {
      const data = await this.landPotAuction.getPlot.call(0, 0)
      data[2].should.be.equal(bidder1)
      data[3].toNumber().should.be.equal(team1)
      data[4].toNumber().should.be.equal(ether(0.001).toNumber()) // first bit is always 1 finney
    })

    it('fails bid on bid-ed plot', async () => {
      await expectThrow(this.landPotAuction.bid(0, 0, team2, { from: bidder2, value: bid2failed }), EVMRevert);
      const data = await this.landPotAuction.getPlot.call(0, 0)
      data[2].should.be.equal(bidder1)
      data[3].toNumber().should.be.equal(team1)
      data[4].toNumber().should.be.equal(ether(0.003).toNumber())
    })
  })

})