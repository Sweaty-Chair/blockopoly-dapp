var World = artifacts.require("./World.sol");
var BidLand = artifacts.require("./BidLand.sol");
var LandPotAuction = artifacts.require("./LandPotAuction.sol");

// module.exports = async (deployer) => {
//   await deployer.deploy(World);
//   await deployer.deploy(BidLand, World.address);
//   await deployer.deploy(LandPotAuction, BidLand.address);
// };

module.exports = (deployer) => {
  deployer.deploy(World).then(() => {
    return deployer.deploy(BidLand, World.address).then(() => {
      return deployer.deploy(LandPotAuction, BidLand.address)
    })
  })
};