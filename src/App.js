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
      // console.log(networkId)
      this.setState({netId: networkId})
    })
    
    // Check accounts changed every 5 seconds.
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
        if (this.state.landPotAuction === undefined)
          this.initContract() // Initial contract if not yet done.
        else
          this.updateContractDetail() // Update the UI with contract detail.
      }
    })
  }

  initContract() {
    const contract = require('truffle-contract')
    const landPotAuction = contract(LandPotAuctionContract)
    landPotAuction.setProvider(this.state.web3.currentProvider)
    // Get the contract instance.
    landPotAuction.deployed().then((instance) => {
      this.setState({
        landPotAuctionInstance: instance
      })
      this.updateContractDetail()
      this.watchEvents()
    })
  }

  updateContractDetail() {
    // Gets plot info of (0,0).
    this.state.landPotAuctionInstance.getPlot(0,0).then((result) => {
      // console.log(result)
      this.setState({currentBid: this.state.web3.utils.fromWei(result[4].toString())})
      this.setState({bidder: result[2]})
    })
    // Gets total balance.
    this.state.landPotAuctionInstance.totalBalance().then((result) => {
      // console.log(result.toNumber())
      this.setState({totalBalance: this.state.web3.utils.fromWei(result.toString())})
    })
    // Gets balance of me.
    this.state.landPotAuctionInstance.balances(this.state.accounts[0]).then((result) => {
      // console.log(result.toNumber())
      this.setState({balanceOfMe: this.state.web3.utils.fromWei(result.toString())})
    })
  }

  watchEvents() {
    // Watches OutBid event.
    this.state.landPotAuctionInstance.Bid({ block: 'latest' }).watch((error, result) => {
      console.log(result)
      if (!error) {
        // Hint if I got outbid by others
        if (result.args.oldBidder.toUpperCase() === this.state.accounts[0].toUpperCase())
          console.log("Ops... You are out-bid by " + result.args.bidder + " on (" + result.args.x + "," + result.args.y + ")! Current bid price became " + this.state.web3.utils.fromWei(result.args.currentBid.toString()) + " ETH, bid it back NOW!")
        // Hint if I outbid others
        if (result.args.bidder.toUpperCase() === this.state.accounts[0].toUpperCase()) {
          if (result.args.oldBidder === "0x0000000000000000000000000000000000000000") // No previous bidder
            console.log("You've successfully placed a bid on (" + result.args.x + "," + result.args.y + ")! Current bid price became " + this.state.web3.utils.fromWei(result.args.currentBid.toString()) + " ETH.")
          else
            console.log("Good job! You out-bid " + result.args.bidder + " on (" + result.args.x + "," + result.args.y + ")! Current bid price became " + this.state.web3.utils.fromWei(result.args.currentBid.toString()) + " ETH.")
        }
        // Change the displaying current bidder, bid price, and my balance
        if (result.args.x.toNumber() === 0 && result.args.y.toNumber() === 0) {
          this.updateContractDetail() // Update the current bidder and bid price of (0,0), for demo, update everything for now
        }
      } else {
        console.log(error)
      }
    })
  }

  handleBid = () => {
    console.log('bid clicked')
    const bidPrice = this.refs.Input.value
    console.log("bidding " + bidPrice)
    this.state.landPotAuctionInstance.bid(0, 0, 0, { from: this.state.accounts[0], value: this.state.web3.utils.toWei((bidPrice), 'ether'), gasPrice: 20e9, gas: 130000 })
    .then((txhash) => {
      console.log('bid sent')
      // $('#transaction-status').html('Successfully placed bid, please wait for the transaction complete. <br />Transaction Hash: ' + getTransactionUrl(hash))
      console.log('Successfully placed bid, please wait for the transaction complete. <br />Transaction Hash: ' + this.getTransactionUrl(txhash.tx))
      this.waitForReceipt(txhash.tx, () => {
        // Transaction went through, UI update can be handled here or in the event.
        console.log('Transaction successfully proceed, updating UI...') // UI update is handled in the event, we just put a notice here for demo.
      })
    })
    .catch((error) => {
      if (error.toString().includes("revert"))
        console.log("Failed bidding: bid lower than the current bid")
      else
        console.log("Failed with error: " + error.message.replace("Error: ", ""))
    })
  }

  // Waits for the transaction complete and execute a callback.
  waitForReceipt(txhash, callback) {
    var self = this;
    this.state.web3.eth.getTransactionReceipt(txhash, (error, receipt) => {
      if (error) {
        console.log(error)
      }
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
