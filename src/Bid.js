import React from 'react'
import LandPotAuctionContract from '../build/contracts/LandPotAuction.json'
import getWeb3 from './utils/getWeb3'
import makeBlockie from 'ethereum-blockies-base64'

import MainNavbar from './components/MainNavbar.js'
import TopAlert from './components/TopAlert.js'
import Board from './components/Board.js'
import TeamScoreTable from './components/TeamScoreTable'
import Info from './components/Info'
import LandInfo from './components/LandInfo'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/main.css'

import { BOARD_COLUMNS } from './constants';
import { DOUBLE_POS } from './constants';
import { TRIPPLE_POS } from './constants';
import { POINTS_POS } from './constants';
import { END_DATE } from './constants';

var bidEndTime = END_DATE;

class Bid extends React.Component {
    constructor(props) {
        super(props);
        this.handleBidChange = this.handleBidChange.bind(this);
        this.bidCountdown = this.bidCountdown.bind(this);
        this.updateScores = this.updateScores.bind(this);
        this.checkAccounts = this.checkAccounts.bind(this);
        this.updateContractDetail = this.updateContractDetail.bind(this);
        this.showTopAlert = this.showTopAlert.bind(this);
        this.hideTopAlert = this.hideTopAlert.bind(this);
        this.toggleBidPage = this.toggleBidPage.bind(this);
        this.withdrawBalance = this.withdrawBalance.bind(this);
        this.setLand = this.setLand.bind(this);
        this.state = {
            // user auth
            web3: null,
            accounts: [],
            landPotAuctionInstance: null,
            // game content
            board: { squares: Array(42).fill(null) },
            teams: ["team-A", "team-B", "team-C", "team-D"],
            scores: [],
            selectedSquare: -1,
            bidPrice: '',
            team: '',
            timeLeft: 'Auction Closed',
            countdownInterval: null,
            balanceOfMe: "",
            topAlertContent: "",
            topAlertType: "",
            displayBid: false,
            currentLand: null,
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

            }).then(() => {
                // Instantiate contract once web3 provided.
                this.instantiateContract()
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    componentDidMount() {
        this.bidCountdown();
        var interval = setInterval(this.bidCountdown, 1000);
        this.setState({countdownInterval: interval});
        window.SetLand = this.setLand;
    }


    componentWillUnmount() {
        clearInterval(this.state.countdownInterval);
    }

    instantiateContract() {
        // Get network ids.
        this.state.web3.eth.net.getId().then((networkId) => {
            // console.log(networkId)
            this.setState({ netId: networkId })
            
            // Show test net warning.
            if (this.state.netId === 3) {
                // $('#no-mainnet-alert-text').html("Currently in <b>Ropsten Test Network</b>. Change to <b>Main Ethereum Network</b> for valid transactions.");
            } else {
                // $('#no-mainnet-alert-text').html("You're not connected! Open MetaMask and make sure you are on the Main Ethereum Network.");
            }

        })

        // Check accounts changed every 5 seconds.
        this.checkAccounts()
        setInterval(this.checkAccounts, 5000)
    }
    
    checkAccounts() {
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
        // Gets plots
        this.state.landPotAuctionInstance.getPlots().then((result) => {
            const newSquares = this.state.board.squares.slice();
            for (let i = 0; i < 42; ++i) {
                if (result[4][i].toNumber() > 0) {
                    console.log("square[" + i + "]: bid:" + result[4][i]);
                    newSquares[i] = { team: this.state.teams[result[3][i].toNumber()], bid: this.state.web3.utils.fromWei(result[4][i].toString()), bidder: result[2][i] }
                }
            }
            this.setState({
                board: { squares: newSquares },
            }, () => { this.updateScores() })
        })
        // Gets the auction ending time.
        this.state.landPotAuctionInstance.getEndingTime().then((result) => {
            const endingDate = new Date(0);
            endingDate.setUTCSeconds(result.toNumber())
            bidEndTime = endingDate
        })
        // Gets ETH balance of me.
        this.state.landPotAuctionInstance.balances(this.state.accounts[0]).then((result) => {
            this.setState({ balanceOfMe: this.state.web3.utils.fromWei(result.toString()) })
        })
    }

    watchEvents() {
        // Watches OutBid event.
        this.state.landPotAuctionInstance.Bid({ block: 'latest' }).watch((error, result) => {
            console.log(result)
            if (!error) {
                // Hint if I got outbid by others
                if (result.args.oldBidder.toUpperCase() === this.state.accounts[0].toUpperCase())
                    this.showTopAlert("Ops... You are out-bid by " + result.args.bidder + " on (" + result.args.x + "," + result.args.y + ")! Current bid price became " + this.state.web3.utils.fromWei(result.args.currentBid.toString()) + " ETH, bid it back NOW!", "danger")
                // Hint if I outbid others
                if (result.args.bidder.toUpperCase() === this.state.accounts[0].toUpperCase()) {
                    if (result.args.oldBidder === "0x0000000000000000000000000000000000000000") // No previous bidder
                        this.showTopAlert("You've successfully placed a bid on (" + result.args.x + "," + result.args.y + ")! Current bid price became " + this.state.web3.utils.fromWei(result.args.currentBid.toString()) + " ETH.")
                    else
                        this.showTopAlert("Good job! You out-bid " + result.args.bidder + " on (" + result.args.x + "," + result.args.y + ")! Current bid price became " + this.state.web3.utils.fromWei(result.args.currentBid.toString()) + " ETH.")
                }
                // Update the whole plots
                this.updateContractDetail()
            } else {
                console.log(error)
            }
        })
        // Withdraw event
        this.state.landPotAuctionInstance.Withdraw({ block: 'latest' }).watch((error, result) => {
            if (!error) {
                this.state.landPotAuctionInstance.balances(this.state.accounts[0]).then((result) => {
                    this.setState({ balanceOfMe: this.state.web3.utils.fromWei(result.toString()) })
                })
            } else {
                console.log(error)
            }
        })
    }

    withdrawBalance() {
        this.state.landPotAuctionInstance.withdraw({ from: this.state.accounts[0], gasPrice: 20e9, gas: 130000} );
    }
    
    setLand(land) {
        this.setState({
            currentLand: land,
        }, () => {
            if (land) {
                this.toggleBidPage(true);
            } else {
                this.toggleBidPage(false);
            }
        })
    }

    toggleBidPage(toggle) {
        this.setState({
            displayBid: toggle,
        })
    }

    showTopAlert(context, type) {
        if (this.topAlertTimeout) {
            clearTimeout(this.topAlertTimeout);
        }
        this.setState({
            topAlertContent: context,
            topAlertType: type,
        })
        this.topAlertTimeout = setTimeout(this.hideTopAlert, 5000);
    }

    hideTopAlert() {
        this.setState({
            topAlertContent: null,
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

    bidCountdown() {
        const t = bidEndTime.getTime() - new Date().getTime();

        this.setState({
            timeLeft: t,
        })
    }

    onSquareClick(i) {
        this.setState({
            selectedSquare: i,
        })
        let selectedSquare = this.state.board.squares[i];
        if (selectedSquare && selectedSquare.bid) {
            this.handleBidChange(parseFloat(selectedSquare.bid) + 0.01);
        } else {
            this.handleBidChange(0.01);
        }
    }

    selectTeam(team) {
        this.setState({
            team: team,
        })
    }

    handleBidChange(bid) {
        this.setState({
            bidPrice: bid,
        })
    }

    getSquareIndex(squareId) {
        if (isNaN(squareId) || squareId < 0 || squareId > 41) {
            return null;
        }
        let row = parseInt(squareId / BOARD_COLUMNS, 10) + 1;
        let column = parseInt(squareId % BOARD_COLUMNS, 10) + 1;
        return {row: row, column: column};
    }

    bidSquareLand(squareId, bidTeam, bidPrice) {
        const squareChainIndex = this.getSquareIndex(squareId);
        const teamId = this.state.teams.indexOf(bidTeam);
        if (!squareChainIndex) {
            console.log("bid faild, invalid square Id: {" + squareId + "}");
        }
        if (isNaN(teamId)) {
            console.log("Bid failed, invalid bidTeam: {" + bidTeam + "}");
        }
        // TODO: bid with remaining eth, e.g. player has 0.3 eth deposite and bid 0.7, he should only sending 0.4 eth
        this.state.landPotAuctionInstance.bid(squareChainIndex.row, squareChainIndex.column, teamId, this.state.web3.utils.toWei((bidPrice.toString()), 'ether'), { from: this.state.accounts[0], value: this.state.web3.utils.toWei((bidPrice.toString()), 'ether'), gasPrice: 20e9, gas: 130000 })
        .then((txhash) => {
          this.showTopAlert('Successfully placed bid, please wait for the transaction complete. <br />Transaction Hash: ' + this.getTransactionUrl(txhash.tx))
          this.waitForReceipt(txhash.tx, () => {
            this.showTopAlert('Bid successfully process, updating plots...')
          })
        }) 
        .catch((error) => {
          if (error.toString().includes("revert"))
            this.showTopAlert("Failed bidding: bid lower than the current bid", "danger")
          else
            this.showTopAlert("Failed with error: " + error.message.replace("Error: ", "danger"))
        })
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

    updateScores() {
        let bidBlocks;
        let teams = this.state.teams;
        let teamsScore = [];
        bidBlocks = CalculateBlocks(this.state.board.squares);
        if (bidBlocks) {
            for (let i = 0; i < teams.length; ++i) {
                let score = 0;
                for (let p = 0; p < bidBlocks.length; ++p) {
                    if (bidBlocks[p].team === teams[i]) {
                        for (let b = 0; b < bidBlocks[p].blocks.length; ++b) {
                            let blockScore = 0;
                            let scoreMultiplier = 1;
                            let bonusScore = 0;
                            const currentBlock = bidBlocks[p].blocks[b];
                            let blockCounter = currentBlock.length;
                            blockScore += 5 * blockCounter * (blockCounter + 1);
                            for (let s = 0; s < currentBlock.length; ++s) {
                                if (DOUBLE_POS.includes(currentBlock[s])) {
                                    scoreMultiplier *= 2;
                                } else if (TRIPPLE_POS.includes(currentBlock[s])) {
                                    scoreMultiplier *= 3;
                                } else if (POINTS_POS.includes(currentBlock[s])) {
                                    bonusScore += 10;
                                }
                            }
                            score += blockScore * scoreMultiplier + bonusScore;
                        }
                    }
                }
                teamsScore.push(score);
            }
        }
        this.setState({
            scores: teamsScore,
        });
    }

    getTeamBidders() {
        let bidderInfo = [];
        for (let i = 0; i < this.state.teams.length; ++i) {
            let team = {};
            team.name = this.state.teams[i];
            team.bidders = [];
            bidderInfo.push(team);
        }
        for (let i = 0; i < this.state.board.squares.length; ++i) {
            let currentSquare = this.state.board.squares[i];
            if (currentSquare && currentSquare.bidder) {
                let info = bidderInfo.find(function(element){
                    return element.name === currentSquare.team;
                })
                if (info) {
                    let bidder = info.bidders.find(function(element){
                        return element.name === currentSquare.bidder;
                    })
                    if (bidder) {
                        bidder.totalBid += parseFloat(currentSquare.bid);
                    } else {
                        let bidder = { name: currentSquare.bidder, totalBid: parseFloat(currentSquare.bid) }
                        info.bidders.push(bidder);
                    }
                }
            }
        }
        return bidderInfo;
    }

    popupHint(hint) {
        alert(hint);
    }

    onBidClick() {
        const squareId = this.state.selectedSquare;
        const teamID = this.state.team;
        const bidPrice = parseFloat(this.state.bidPrice);
        if (squareId < 0 || squareId >= this.state.board.squares.length) {
            this.showTopAlert("please select a land first.", "danger");
            return;
        }
        if (teamID === '') {
            this.showTopAlert("please select a team first.", "danger");
            return;
        }
        const bidSquare = this.state.board.squares[squareId];
        if (isNaN(bidPrice) || bidPrice <= 0) {
            this.showTopAlert("Please input a valid bid price.", "danger");
            return;
        } else {
            if (!bidSquare) {
                this.bidSquareLand(squareId, teamID, bidPrice);
            } else if (bidSquare.team === teamID) {
                this.bidSquareLand(squareId, teamID, parseFloat(bidSquare.bid) + bidPrice);
            } else {
                if (bidPrice > parseFloat(bidSquare.bid)) {
                    this.bidSquareLand(squareId, teamID, bidPrice);
                } else {
                    this.popupHint("Please make a bid higher than current bid.(current: " + bidSquare.bid + " your bid: " + bidPrice + ")");
                }
            }
        }
    }

    getJackpot() {
        let sum = parseFloat(0);
        for (let i = 0; i < this.state.board.squares.length; ++i) {
            let currentSquare = this.state.board.squares[i];

            if (currentSquare && currentSquare.bid > 0) {
                sum += parseFloat(this.state.board.squares[i].bid);
            }
        }
        sum = sum.toFixed(3) + " ETH";
        return sum;
    }
  
    render() {
        const selectedSquareId = this.state.selectedSquare;
        const selectTeam = this.state.team;
        const bidPrice = this.state.bidPrice;
        const teams = this.state.teams;
        const scores = this.state.scores;
        const squares = this.state.board.squares;
        const currentSquare = squares[selectedSquareId];
        let squareBidder = "";
        let currentSquarePrice;
        let landDes = "CITY #42 - (E:4)";
        if (this.state.currentLand) {
            landDes = this.state.currentLand._description + " (" + this.state.currentLand._x + "," + this.state.currentLand._y + ")"
        }
        const jackpot = this.getJackpot();
        if (currentSquare) {
            currentSquarePrice = currentSquare.bid;
            if (currentSquare.bidder) {
                squareBidder = makeBlockie(currentSquare.bidder);
            }
        }
        let currentBalance = this.state.balanceOfMe;
        if (!currentBalance) {
            currentBalance = 0;
        }
        
        let accountIcon = "user.png";
        if (this.state.accounts[0]) {
            accountIcon = makeBlockie(this.state.accounts[0]);
        }
        let scoreTable = [];
        for (let i = 0; i < teams.length; ++i) {
            let teamTag = teams[i].split("-")[1];
            let row = { team: teams[i], teamTag: teamTag, score: scores[i] }
            scoreTable.push(row);
        }
        let teamBidders = this.getTeamBidders();

        let timeInfo;
        let t = this.state.timeLeft;
        if (t < 0) {
            timeInfo = "Auction Closed";
        } else {
            timeInfo = "Ends in: " + Math.floor(t / (1000 * 60 * 60 * 24)) + "d " + Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + "h " + Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)) + "m " + Math.floor((t % (1000 * 60)) / 1000) + "s";
        }
        let toggleBid = t > 0;

        if (this.state.displayBid) {
            return (
                <div>
                    <MainNavbar
                        pool={currentBalance}
                        accountIcon={accountIcon}
                        onWithdrawClick={() => this.withdrawBalance()}
                    />
                    <div className="bid-panel" id="land-info">
                        <LandInfo
                            timeLeft={timeInfo}
                            jackpot={jackpot}
                            landDes={landDes}
                            onCloseClick={() => this.toggleBidPage(false)}
                        />
                        <TopAlert
                            content={this.state.topAlertContent}
                            type={this.state.topAlertType}
                            onCloseClick={() => this.showTopAlert()}
                        />
                        <Board
                            selectId={selectedSquareId}
                            squares={squares}
                            onClick={(i) => this.onSquareClick(i)}
                        />
                        <Info
                            teams={teams}
                            selectId={selectedSquareId}
                            bidPrice={bidPrice}
                            updateBid={this.handleBidChange}
                            onClick={() => this.onBidClick()}
                            selectTeam={selectTeam}
                            onSelectTeam={(teamId) => this.selectTeam(teamId)}
                            currentSquarePrice={currentSquarePrice}
                            scores={scores}
                            bidderIcon={squareBidder}
                            toggle={toggleBid}
                        />
                        <TeamScoreTable
                            teams={scoreTable}
                            selectTeam={this.state.team}
                            onSelectTeam={(team) => this.selectTeam(team)}
                            teamBidders={teamBidders}
                            toggle={toggleBid}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <MainNavbar
                    pool={currentBalance}
                    accountIcon={accountIcon}
                />
            );
        }
        
    }
}

function CalculateBlocks(squares) {
    let points = [];
    for (let i = 0; i < squares.length; ++i) {
        let currentSquare = squares[i];
        if (currentSquare) {
            // insert block
            let isNewTeam = true;
            for (let t = 0; t < points.length; ++t) {
                let currentScoreRow = points[t];
                if (currentScoreRow.team === currentSquare.team) {
                    isNewTeam = false;
                    let isNewBlock = true;
                    let connectedBlocks = [];
                    connectedBlocks.push(i);
                    let notConnectedBlocks = [];
                    for (let b = 0; b < currentScoreRow.blocks.length; ++b) {
                        let currentBlock = currentScoreRow.blocks[b];
                        if (IsBlock(i, currentBlock)) {
                            isNewBlock = false;
                            connectedBlocks = connectedBlocks.concat(currentBlock);
                        } else {
                            notConnectedBlocks.push(currentBlock);
                        }
                    }

                    if (isNewBlock) {
                        let newBlock = [i];
                        currentScoreRow.blocks.push(newBlock);
                    } else {
                        let newBlocks = [];
                        if (connectedBlocks) {
                            newBlocks.push(connectedBlocks);
                        }
                        if (notConnectedBlocks) {
                            newBlocks = newBlocks.concat(notConnectedBlocks);
                        }
                        currentScoreRow.blocks = newBlocks;
                    }
                    break;
                }
            }
            if (isNewTeam) {
                points.push({
                    team: currentSquare.team,
                    blocks: [[i]],
                });
            }
        }
    }
    return points;
}

function IsBlock(square, block) {
    for (let i = 0; i < block.length; ++i) {
        if (IsConnected(square, block[i])) {
            return true;
        }
    }
    return false;
}

function IsConnected(first, second) {
    let difference = parseInt(second, 10) - parseInt(first, 10);
    difference = Math.abs(difference);
    if (difference === BOARD_COLUMNS || difference === 1) {
        return true;
    }
    return false;
}

export default Bid

