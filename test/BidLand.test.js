const { assertRevert } = require('openzeppelin-solidity/test/helpers/assertRevert')

const World = artifacts.require('World')
const BidLand = artifacts.require('BidLand')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('BidLand', (accounts) => {
  const creator = accounts[0]
  const worldOwner = accounts[1]
  const landOwner = accounts[2]
  const unauthorized = accounts[3]
  
  beforeEach(async () => {
    this.world = await World.new()
    this.bidLand = await BidLand.new(this.world.address)
    await this.world.createAndTransfer(worldOwner, 0, { from: creator })
  })

  describe('setInfo', () => {
    it('creator can set info', async () => {
      await this.bidLand.createAndTransfer(landOwner, 0, 1, 1, { from: worldOwner })
      await this.bidLand.setInfo(0, 1, 1, "name1", "description1", { from: creator })
      const data = await this.bidLand.infoOfLand(0, 1, 1)
      data[0].should.be.equal("name1")
      data[1].should.be.equal("description1")
    })

    it('world owner can set info', async () => {
      await this.bidLand.createAndTransfer(landOwner, 0, 1, 2, { from: worldOwner })
      await this.bidLand.setInfo(0, 1, 2, "name2", "description2", { from: worldOwner })
      const data = await this.bidLand.infoOfLand(0, 1, 2)
      data[0].should.be.equal("name2")
      data[1].should.be.equal("description2")
    })

    it('land owner can set info', async () => {
      await this.bidLand.createAndTransfer(landOwner, 0, 2, 1, { from: worldOwner })
      await this.bidLand.setInfo(0, 2, 1, "name3", "description3", { from: landOwner })
      const data = await this.bidLand.infoOfLand(0, 2, 1)
      data[0].should.be.equal("name3")
      data[1].should.be.equal("description3")
    })

    it('unauthorized address cannot set info', async () => {
      await this.bidLand.createAndTransfer(landOwner, 0, 2, 2, { from: worldOwner })
      await assertRevert(this.bidLand.setInfo(0, 2, 2, "name", "description", { from: unauthorized }))
    })
  })
})