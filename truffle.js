var HDWalletProvider = require("truffle-hdwallet-provider")
require('dotenv').config({silent: true})

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Ganache
      network_id: "*", // Match any network id
    },
    richard: {
      host: "192.168.100.177",
      port: 7545, // Ganache
      network_id: "*", // Match any network id
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 3,
      gas: 4612388,
      gasPrice: 21
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 4,
      gas: 6500000,
      gasPrice: 1
    },
    kovan: {
      provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 42,
      gas: 6500000,
      gasPrice: 1
    }
  }
}