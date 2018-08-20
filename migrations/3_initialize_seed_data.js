var World = artifacts.require("./World.sol");
var BidLand = artifacts.require("./BidLand.sol");
var LandPotAuction = artifacts.require("./LandPotAuction.sol");

module.exports = (deployer, network, accounts) => {
  let bidLandInstance
  let landPotAuctionInstance
  World.deployed().then((instance) => {
    return instance.create(0).then((error, result) => { // Create World-0
      return BidLand.deployed().then((instance) => {
        bidLandInstance = instance
        return bidLandInstance.create(0, 0, 0, { from: accounts[0] }).then((error, result) => {
          return bidLandInstance.setInfo(0, 0, 0, "Block42", "The bridge from Minecraft to Oasis; A blockchain platform for everything").then((error, result) => {
            return bidLandInstance.create(0, -1, 0, { from: accounts[0] }).then((error, result) => {
              return bidLandInstance.setInfo(0, -1, 0, "Sweaty Chair", "Sweaty Chair Studio bring creative games to the world!").then((error, result) => {
                return bidLandInstance.create(0, 1, 0, { from: accounts[0] }).then((error, result) => {
                  return bidLandInstance.setInfo(0, 1, 0, "Investors", "Investors that made Block42 possible.").then((error, result) => {
                    return bidLandInstance.create(0, 0, 1, { from: accounts[0] }).then((error, result) => {
                      return bidLandInstance.setInfo(0, 0, 1, "City Building", "Reserved space for future co-operatives.").then((error, result) => {
                        return bidLandInstance.create(0, 0, -1, { from: accounts[0] }).then((error, result) => {
                          return bidLandInstance.setInfo(0, 0, -1, "Apartment", "Reserved space for future co-operatives.").then((error, result) => {
                            return LandPotAuction.deployed().then((instance) => {
                              landPotAuctionInstance = instance
                              return bidLandInstance.authorize(LandPotAuction.address).then(() => {
                                landPotAuctionInstance.startAuction(1, 1, { from: accounts[0] }) // Create auction on (1,1)
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
}