var World = artifacts.require("./World.sol");
var BidLand = artifacts.require("./BidLand.sol");
var LandPotAuction = artifacts.require("./LandPotAuction.sol");

module.exports = (deployer) => {
  deployer.deploy(World);
  deployer.deploy(BidLand, World.address);
  deployer.deploy(LandPotAuction, BidLand.address);
};