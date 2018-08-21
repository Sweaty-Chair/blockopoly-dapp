import React from 'react'

import { BOARD_COLUMNS } from '../constants'

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.handleBidChange = this.handleBidChange.bind(this);
    }

    handleBidChange(e) {
        this.props.updateBid(e.target.value);
    }

    render () {
        const row = parseInt(this.props.selectId / BOARD_COLUMNS + 1, 10);
        const column = parseInt(this.props.selectId % BOARD_COLUMNS + 1, 10);
        const bidPrice = this.props.bidPrice;
        const currentSquarePrice = this.props.currentSquarePrice;
        let currentSquareInfo;
        if (currentSquarePrice) {
            currentSquareInfo = "(Current Bid: " + currentSquarePrice + ")";
        }
        let bidderIconClassName = "bidder-icon";
        if (!this.props.bidderIcon) {
            bidderIconClassName += " hidden";
        }
        if (this.props.toggle) {
            return (
                <div className="dark">
                    <div className="bid-table">
                        <div>
                            <img className="vertical-icon" src='position.png' alt="Position"/>
                            <span className="position-text"> ({row}, </span>
                            <span className="position-text">{column})</span>
                            <span className="current-bid-text">{currentSquareInfo}</span>
                            <img className={bidderIconClassName} src={this.props.bidderIcon} alt='User' />
                        </div>
                        <div>
                            <input className="bid-input" type="number" placeholder="input price..." value={bidPrice} onChange={this.handleBidChange}>
                            </input>
                            <button className="bid-button" onClick={this.props.onClick}>Bid</button>

                        </div>
                    </div>
                </div>
            );
        } else {
            return (null);
        }
    }
}

export default Info;