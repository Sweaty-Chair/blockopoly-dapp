import React from 'react'

function Navbar(props) {
    let withdrawBtn = "btn btn-warning hidden";
    if (parseFloat(props.pool) > 0) {
        withdrawBtn = "btn btn-warning";
    }
    return (
        <div>
            <nav className="topnav">
                <div>
                    <button className={withdrawBtn} onClick={props.onWithdrawClick}>Withdraw</button>
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