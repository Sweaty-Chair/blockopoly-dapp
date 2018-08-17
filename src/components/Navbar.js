import React from 'react'

function Navbar(props) {
    return (
        <div>
            <nav className="topnav">
                <div>
                    <button className="btn btn-warning" onClick={props.Onclick}>Withdraw</button>
                </div>
                <div>
                    <img src='eth.png' alt="Bid Pool:"/><span className="balance-text">{props.pool} ETH</span>
                </div>
                <div>
                    <img src={props.accountIcon} alt='User' />
                </div>
            </nav>
        </div>
    );
}

export default Navbar;