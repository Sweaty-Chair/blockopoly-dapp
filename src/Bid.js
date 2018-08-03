import React from 'react'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/main.css'

function Square(props) {
    let className = "square";
    let team;
    if (props.isSelected) {
        className += " square-select";
    }
    if (props.bidState) {
        const teamName = props.bidState.team;
        className += " " + teamName;
        team = teamName.split("-")[1];
    }
    return (
        <button className={className} onClick={props.onClick}>
            {team}
        </button>
    );
}

function Navbar() {
    return (
        <div>
            <nav className="topnav">
                <a href="#">Block 42</a>
            </nav>
        </div>
    );
}

function TeamScore(props) {
    const className = "team-icon " + props.team;
    const score = props.score;
    const teamTag = props.team.split("-")[1];
    let divClass = "team-score";
    if (props.selectTeam === props.team) {
        divClass += " square-select";
    }
    return (
        <div className={divClass}>
            <div className={className} onClick={props.onClick}>{teamTag}</div>
            <p className="team-score-text">Score: {score}</p>
        </div>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                selectId={this.props.selectId}
                isSelected={this.props.selectId === i}
                bidState={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        
        return (
            <div className="gridboard">
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                    {this.renderSquare(6)}
                </div>
                <div className="board-row">
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                    {this.renderSquare(9)}
                    {this.renderSquare(10)}
                    {this.renderSquare(11)}
                    {this.renderSquare(12)}
                    {this.renderSquare(13)}
                </div>
                <div className="board-row">
                    {this.renderSquare(14)}
                    {this.renderSquare(15)}
                    {this.renderSquare(16)}
                    {this.renderSquare(17)}
                    {this.renderSquare(18)}
                    {this.renderSquare(19)}
                    {this.renderSquare(20)}
                </div>
                <div className="board-row">
                    {this.renderSquare(21)}
                    {this.renderSquare(22)}
                    {this.renderSquare(23)}
                    {this.renderSquare(24)}
                    {this.renderSquare(25)}
                    {this.renderSquare(26)}
                    {this.renderSquare(27)}
                </div>
                <div className="board-row">
                    {this.renderSquare(28)}
                    {this.renderSquare(29)}
                    {this.renderSquare(30)}
                    {this.renderSquare(31)}
                    {this.renderSquare(32)}
                    {this.renderSquare(33)}
                    {this.renderSquare(34)}
                </div>
                <div className="board-row">
                    {this.renderSquare(35)}
                    {this.renderSquare(36)}
                    {this.renderSquare(37)}
                    {this.renderSquare(38)}
                    {this.renderSquare(39)}
                    {this.renderSquare(40)}
                    {this.renderSquare(41)}
                </div>
            </div>
        );
    }
}

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.handleBidChange = this.handleBidChange.bind(this);
    }

    handleBidChange(e) {
        this.props.updateBid(e.target.value);
    }

    render () {
        const row = parseInt(this.props.selectId / 7 + 1, 10);
        const coloum = parseInt(this.props.selectId % 7 + 1, 10);
        const bidPrice = this.props.bidPrice;
        const teams = this.props.teams;
        const selectTeam = this.props.selectTeam;
        const currentSquarePrice = this.props.currentSquarePrice;
        let teamScores = [];
        let currentSquareInfo;
        for (let i = 0; i < teams.length; ++i) {
            teamScores.push(
            <TeamScore 
                key={teams[i]} 
                team={teams[i]} 
                score="0" 
                selectTeam={selectTeam}
                onClick={() => this.props.onSelectTeam(teams[i])}
            />)
        }
        if (currentSquarePrice) {
            currentSquareInfo = "(Current Bid: " + currentSquarePrice + ")";
        }
        return (
            <div className="dark">
                <div className="bid-table">
                    <div>
                        <img className="vertical-icon" src='position.png' alt="Position"/>
                        <span className="position-text"> ({row}, </span>
                        <span className="position-text">{coloum})</span>
                    </div>
                    <div>
                        <input className="bid-input" type="number" placeholder="input price..." value={bidPrice} onChange={this.handleBidChange}>
                        </input>
                        <button className="bid-button" onClick={this.props.onClick}>Bid</button>
                        <span className="current-bid-text">{currentSquareInfo}</span>
                    </div>
                    <div>
                        {teamScores}
                    </div>
                </div>
            </div>
        );
    }
}

class Bid extends React.Component {
    constructor(props) {
        super(props);
        this.handleBidChange = this.handleBidChange.bind(this);
        this.state = {
            teams: ["team-A", "team-B", "team-C", "team-D"],
            board: { squares: Array(42).fill(null) },
            team: '',
            selectedSquare: -1,
            bidPrice: '',
        }
    }

    onSquareClick(i) {
        const newSelect = i;
        this.setState({
            selectedSquare: newSelect,
        })
    }

    selectTeam(team) {
        const selectTeam = team;
        this.setState({
            team: selectTeam,
        })
    }

    handleBidChange(bid) {
        const newBid = bid;
        this.setState({
            bidPrice: newBid,
        })
    }

    bidSquareLand(squareId, bidTeam, bidPrice) {
        const newSquares = this.state.board.squares.slice();
        newSquares[squareId] = {team: bidTeam, bid: bidPrice};
        this.setState({
            board: {squares: newSquares}
        });
    }

    popupHint(hint) {
        alert(hint);
    }

    onBidClick() {
        const squareId = this.state.selectedSquare;
        const teamID = this.state.team;
        const bidPrice = this.state.bidPrice;
        if (squareId < 0 || squareId >= this.state.board.squares.length) {
            this.popupHint("please select a land first.");
            return;
        }
        if (teamID === '') {
            this.popupHint("please select a team first.");
            return;
        }
        const bidSquare = this.state.board.squares[squareId];
        if (bidPrice <= 0) {
            this.popupHint("Please input a valid bid price.");
        } else {
            if (!bidSquare) {
                this.bidSquareLand(squareId, teamID, bidPrice);
            } else if (bidSquare.team === teamID) {
                this.bidSquareLand(squareId, teamID, parseFloat(bidSquare.bid) + parseFloat(bidPrice));
            } else {
                if (bidPrice > bidSquare.bid) {
                    this.bidSquareLand(squareId, teamID, bidPrice);
                } else {
                    this.popupHint("Please make a bid higher than current bid.");
                }
            }
        }
    }

    render() {
        const selectedSquareId = this.state.selectedSquare;
        const selectTeam = this.state.team;
        const bidPrice = this.state.bidPrice;
        const teams = this.state.teams;
        const squares = this.state.board.squares;
        const currentSquare = squares[selectedSquareId];
        let currentSquarePrice;
        if (currentSquare) {
            currentSquarePrice = currentSquare.bid;
        }
        return (
            <div className="body">
                <Navbar />
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
                />
            </div>
        );
    }
}

function CalculatePoints(squares) {
    
}

export default Bid

