import React from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from './Navbar'

class MainNavbar extends React.Component {
    render() {
        return (
            <div>
                <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="https://www.block42.world/">
                        <img src="logo.png" width="35" height="35" alt="Block42" />
                    </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto ">
                            <li className="nav-item active">
                                <a className="nav-link" href="#">Main
                            <span className="sr-only">(current)</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="build-tab" href="#">Build</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Buy</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Play</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">News</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Info</a>
                            </li>
                        </ul>
                    </div>
                    <Navbar
                        pool={this.props.pool}
                        accountIcon={this.props.accountIcon}
                    />
                </nav>
            </div>
        );
    }
}

export default MainNavbar;