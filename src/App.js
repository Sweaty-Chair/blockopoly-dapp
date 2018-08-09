import React, { Component } from 'react'
import LandPotAuctionContract from '../build/contracts/LandPotAuction.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentBid: 0,
      totalBalance: 0,
      balanceOfMe: 0,
      accounts: [],
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {    
    // Get network ids.
    this.state.web3.eth.net.getId().then((networkId) => {
      console.log(networkId)
      this.setState({netId: networkId})
    })
    
    this.checkAccounts()
    setInterval(this.checkAccounts, 5000)
  }

  checkAccounts = () => {
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      if (accounts[0] === undefined) {
        // toggleMetaMaskPrompt(true)
      } else if (this.state.accounts.length === 0 || accounts[0] !== this.state.accounts[0]) { // Account initialized or changed
        // toggleMetaMaskPrompt(false)
        this.setState({
          accounts: accounts
        })
        this.updateAccounts()
      }
    })
  }

  updateAccounts() {
    const contract = require('truffle-contract')
    const landPotAuction = contract(LandPotAuctionContract)
    landPotAuction.setProvider(this.state.web3.currentProvider)
    // Get the contract instance.
    landPotAuction.deployed().then((instance) => {
      this.setState({
        landPotAuctionInstance: instance
      })
      // Gets auction ending time.
      this.state.landPotAuctionInstance.getEndingTime.call().then((result) => {
        const endingDate = new Date(0)
        endingDate.setUTCSeconds(result.toNumber())
        console.log(endingDate)
      })
      // Gets all plots.
      this.state.landPotAuctionInstance.getPlots.call().then((result) => {
        console.log(result)
      })
      // Gets plot info of (0,0).
      this.state.landPotAuctionInstance.getPlot.call(0,0).then((result) => {
        console.log(result)
        this.setState({currentBid: this.state.web3.utils.fromWei(result[4].toString())})
        this.setState({bidder: result[2]})
      })
      // Gets total balance.
      this.state.landPotAuctionInstance.totalBalance.call().then((result) => {
        console.log(result.toNumber())
        this.setState({totalBalance: this.state.web3.utils.fromWei(result.toString())})
      })
      // Gets balance of me.
      this.state.landPotAuctionInstance.balances.call(this.state.accounts[0]).then((result) => {
        console.log(result.toNumber())
        this.setState({balanceOfMe: this.state.web3.utils.fromWei(result.toString())})
      })

      // Listens events.
      this.state.landPotAuctionInstance.events.Bid({
        filter: { bidder: this.state.accounts[0] }
      })
      .then((error, events) => {
        console.log("Bid - error=" + error);
        console.log("Bid - events=" + events);
      })

      this.state.landPotAuctionInstance.Bid({}, {fromBlock:0, toBlock:'latest'}).get(function(error, results){
        console.log("Bid - error=" + error);
        console.log("Bid - results=" + results);
      })

    })
  }

  handleBid = () => {
    console.log('bid clicked')
    const bidPrice = this.refs.Input.value
    console.log(bidPrice)
    // return this.state.landPotAuctionInstance.bid(0, 0, 0, { from: this.state.accounts[0], value: this.state.web3.utils.toWei((bidPrice), 'ether'), gasPrice: 20e9, gas: 130000 })
    // .then((txhash) => {
    //   console.log('bid sent')
    //   // $('#transaction-status').html('Successfully placed bid, please wait for the transaction complete. <br />Transaction Hash: ' + getTransactionUrl(hash))
    //   console.log('Successfully placed bid, please wait for the transaction complete. <br />Transaction Hash: ' + this.getTransactionUrl(txhash.tx))
    //   // TODO
    // })
    // .catch((error) => {
    //   console.error(error)
    // })
    // .once('receipt', (receipt) => {
    //   console.log(receipt)
    // })
    this.state.landPotAuctionInstance.bid(0, 0, 0, { from: this.state.accounts[0], value: this.state.web3.utils.toWei((bidPrice), 'ether'), gasPrice: 20e9, gas: 130000 })
    .then((txhash) => {
      console.log('bid sent')
      // $('#transaction-status').html('Successfully placed bid, please wait for the transaction complete. <br />Transaction Hash: ' + getTransactionUrl(hash))
      console.log('Successfully placed bid, please wait for the transaction complete. <br />Transaction Hash: ' + this.getTransactionUrl(txhash.tx))
      this.waitForReceipt(txhash.tx, () => {
        console.log('Bid successfully process, updating plots...')
        //TODO
        this.updateAccounts()
      })
    })
    .catch((error) => {
      // console.log("Failed with error: " + error.toString().replace("Error: ", ""))
      if (error.toString().includes("revert"))
        console.log("Failed bidding: bid lower than the current bid")
      else
        console.log("Failed with error: " + error.message.replace("Error: ", ""))
    })
//     this.state.web3.eth.sendTransaction({
//       from: this.state.accounts[0],
//       value: this.state.web3.utils.toWei(bidPrice, 'ether'),
//       to: this.state.landPotAuctionInstance.address,
//       gasPrice: 20e9
//     })
//     .once('transactionHash', function (hash) {
//       console.log(hash);
//       // $('#transaction-status').html('Your contribution is being processed... <br />Transaction Hash: ' + getTransactionUrl(hash))
//     })
//     .once('receipt', function (receipt) {
//       console.log(receipt);
//       // $('#transaction-status').html('Congrates! Your contribution has been processed and you received new CUBIKs!')
//     })
// //    .on('confirmation', function(confNumber, receipt){ console.log("confirmation"); console.log(confNumber); console.log(receipt); })
//     .on('error', function (error) {
//       console.error(error);
//       // $('#transaction-status').html('There was an error processing your contribution.<br />' + String(error))
//     })
  }

  waitForReceipt(txhash, callback) {
    var self = this;
    console.log(txhash)
    this.state.web3.eth.getTransactionReceipt(txhash, (error, receipt) => {
      if (error) {
        console.log(error)
      }
      console.log(receipt)
      if (receipt !== null) {
        if (callback)
          callback(receipt)
      } else {
        // Try again in 1 second
        window.setTimeout(function () {
          self.waitForReceipt(txhash, callback)
        }, 1000)
      }
    })
  }

  getTransactionUrl (address) {
    return this.getEtherScanUrl('tx', address)
  }
  
  getTokenUrl (address) {
    return this.getEtherScanUrl('token', address)
  }
  
  getContractUrl (address) {
    return this.getEtherScanUrl('address', address)
  }
  
  getEtherScanUrl (type, address) {
    var url = this.state.web3.version.network === 3 ? 'ropsten.etherscan.io' : 'etherscan.io'
    return "<a href='https://" + url + '/' + type + '/' + address + "' target='_blank'>" + address + '</a>'
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully.</p>
              <p>Your address is: {this.state.accounts[0]}</p>
              <p>Bidder of (0,0) is: {this.state.bidder}</p>
              <p>Current bid of (0,0) is: {this.state.currentBid}</p>
              <p>Total balance: {this.state.totalBalance}</p>
              <p>Balance of me: {this.state.balanceOfMe}</p>
              <input type="number" ref="Input" name="input" step="0.001" placeholder="0.1" defaultValue="0.1" />
              <button onClick={this.handleBid}>Bid</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
