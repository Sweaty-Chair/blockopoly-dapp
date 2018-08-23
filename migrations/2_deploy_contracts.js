var World = artifacts.require("./World.sol");
var BidLand = artifacts.require("./BidLand.sol");
var LandPlotAuction = artifacts.require("./LandPlotAuction.sol");

module.exports = (deployer) => {
  deployer.deploy(World).then(() => {
    return deployer.deploy(BidLand, World.address).then(() => {
      return deployer.deploy(LandPlotAuction, BidLand.address)
    })
  })
}