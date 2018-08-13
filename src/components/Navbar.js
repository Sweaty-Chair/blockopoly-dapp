import React from 'react'

function Navbar(props) {
    return (
        <div>
            <nav className="topnav">
                <a href="#">Block 42 Monopoly</a>
                <div>
                    <button className="withdraw" onClick={props.Onclick}>Withdraw</button>
                </div>
                <div>
                    <img src='eth.png' alt="Bid Pool:"/> {props.pool} ETH
                </div>
                <div>
                    <img src={props.accountIcon} alt='User' />
                </div>
            </nav>
        </div>
    );
}

export default Navbar;