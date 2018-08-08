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
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const landPotAuction = contract(LandPotAuctionContract)
    landPotAuction.setProvider(this.state.web3.currentProvider)
    
    // Get network ids.
    this.state.web3.eth.net.getId().then((networkId) => {
      console.log(networkId)
      this.setState({netId: networkId})
    })
    
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({
        accounts: accounts
      })
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

        // Listen events
        // this.state.landPotAuctionInstance.events.Bid({
        //   filter: { bidder: this.state.accounts[0] }
        // })
        // .then((error, events) => {
        //   console.log(events);
        // })

        // this.state.landPotAuctionInstance.Bid({}, {fromBlock:0, toBlock:'latest'}).get(function(err, results){
        //   console.log(results);
        // })

      })
    })
  }

  handleBid = () => {
    console.log('bid clicked')
    const bidPrice = this.refs.Input.value
    console.log(bidPrice)
    // Send bid request, TODO: handle the result accordingly
    return this.state.landPotAuctionInstance.bid.sendTransaction(0, 0, 0, { from: this.state.accounts[0], value: this.state.web3.utils.toWei((bidPrice), 'ether'), gasPrice: 20e9, gas: 130000 })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })
    .then((txhash) => {
      console.log('bid sent')
      // $('#transaction-status').html('Successfully placed bid, please wait for the transaction complete. <br />Transaction Hash: ' + getTransactionUrl(hash))
      console.log('Successfully placed bid, please wait for the transaction complete. <br />Transaction Hash: ' + this.getTransactionUrl(txhash.tx))
      // TODO
    })
    .catch((error) => {
      console.error(error)
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
              <p>Bidder of (0,0) is: {this.state.bidder}</p>
              <p>The current bid of (0,0) is: {this.state.currentBid}</p>
              <input type="text" ref="Input" name="input" />
              <button onClick={this.handleBid}>Bid</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
