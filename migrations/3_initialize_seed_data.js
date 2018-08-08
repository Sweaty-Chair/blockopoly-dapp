var World = artifacts.require("./World.sol");
var BidLand = artifacts.require("./BidLand.sol");
var LandPotAuction = artifacts.require("./LandPotAuction.sol");

module.exports = (deployer, network, accounts) => {
  let worldInstance
  let bidLandInstance
  let landPotAuctionInstance
  World.deployed().then((instance) => {
    worldInstance = instance
    return BidLand.deployed().then((instance) => {
      bidLandInstance = instance
      return LandPotAuction.deployed().then((instance) => {
        landPotAuctionInstance = instance
        return worldInstance.create(0).then((error, result) => {
          return bidLandInstance.authorize(LandPotAuction.address).then(() => {
            return landPotAuctionInstance.startAuction(1, 1)
            // return landPotAuctionInstance.startAuction(1, 1).then(() => {
              // return landPotAuctionInstance.getEndingTime.call()
            // })
          })
        })
      })
    })
  })
}