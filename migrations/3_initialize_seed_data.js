var World = artifacts.require("./World.sol");
var BidLand = artifacts.require("./BidLand.sol");
var LandPotAuction = artifacts.require("./LandPotAuction.sol");

module.exports = async (deployer) => {
  const world = await World.deployed()
  const bidland = await BidLand.deployed()
  const landPotAuction = await LandPotAuction.deployed()
  await world.create(0)
  await bidland.authorize(landPotAuction.address)
  await landPotAuction.startAuction(1, 1)
};