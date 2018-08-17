import React from 'react'

class LandInfo extends React.Component {
    render() {
        return(
            <div>
                <div className="land-info">
                    <button type="button" className="close" aria-label="Close" onClick={this.props.onCloseClick}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div>
                        <p>{this.props.landDes}</p>
                    </div>
                    <div>
                        <p id="time-countdown">{this.props.timeLeft}</p>
                    </div>
                    <div>
                        <p className="jackpot">JACKPOT</p>
                        <p className="jackpot">{this.props.jackpot}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default LandInfo;