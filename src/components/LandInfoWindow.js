import React from 'react'

class LandInfoWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.display) {
            let landName = "";
            let action = "";
            if (this.props.land) {
                landName = this.props.land.name;
                if (this.props.land.owner) {
                    action = <button type="button" className="btn btn-lg btn-block btn-dark">Edit</button>;
                }
            }
            return (
                <div className="right-center" id="land-info">
                    <button type="button" className="close" aria-label="Close" onClick={this.props.onCloseClick}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div>
                        <h2 className="center" id="plotname">{landName}</h2>

                    </div>
                    <div>
                        <p className="center">Owned by:
                        <span><img src="default-user.png" alt="John" className="inline-icon" /></span>
                        </p>
                        <div className="grey-box">
                            <div className="card-header">
                                <h6 className="my-0 font-weight-normal">&lt;Transaction History&gt;</h6>
                            </div>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>100,000,000</td>
                                        <td>1 month ago</td>
                                    </tr>
                                    <tr>
                                        <td>75,000</td>
                                        <td>5 months ago</td>
                                    </tr>
                                    <tr>
                                        <td>1,000</td>
                                        <td>1 year ago</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="text-center">
                        <a href="#"><p className="center">View Full History</p></a>
                        <img src="money.png" alt="$" width="35px" height="35px" />
                        <h2 className="inline-header text-primary text-center align-middle">9,999</h2>
                    </div>
                    <div className="button">
                        {action}
                    </div>
                </div>
            );
        }
        else {
            return (null)
        }
    }
}

export default LandInfoWindow;