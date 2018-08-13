var World = artifacts.require("./World.sol");
var BidLand = artifacts.require("./BidLand.sol");
var LandPotAuction = artifacts.require("./LandPotAuction.sol");

module.exports = (deployer, network, accounts) => {
  let bidLandInstance
  let landPotAuctionInstance
  World.deployed().then((instance) => {
    return instance.create(0).then((error, result) => {
      return BidLand.deployed().then((instance) => {
        bidLandInstance = instance
        return LandPotAuction.deployed().then((instance) => {
          landPotAuctionInstance = instance
          return bidLandInstance.authorize(LandPotAuction.address).then(() => {
            landPotAuctionInstance.startAuction(1, 1, { from: accounts[0] })
          })
        })
      })
    })
  })
}