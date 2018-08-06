// var HDWalletProvider = require("truffle-hdwallet-provider")
// var mnemonic = "easily change airport frog pencil tube core edit kangaroo correct famous border";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Ganache
      network_id: "*", // Match any network id
    },
    // ropsten: {
    //   provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/6469dd6b6c614a20ab3efb85cc1c7b1d"),
    //   network_id: 3
    // },
    // rinkeby: {
    //   provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/6469dd6b6c614a20ab3efb85cc1c7b1d"),
    //   network_id: 4
    // },
    // kovan: {
    //   provider: new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/6469dd6b6c614a20ab3efb85cc1c7b1d"),
    //   network_id: 42
    // }
  }
}