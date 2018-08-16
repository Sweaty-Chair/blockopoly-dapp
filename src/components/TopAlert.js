import React from 'react'

// import { Alert } from 'react-bootstrap';

class TopAlert extends React.Component {

    render() {
        const content = this.props.content;

        let alertType = "success";
        if (this.props.type === 'danger') {
            alertType = " alert-danger";
        } else {
            alertType = " alert-success"
        }

        if (content) {
            return (
                <div>
                    <div className={"alert alert-dismissible fade show no-margin-bottom" + alertType} role="alert">
                        {this.props.content}
                        <button type="button" className="close" aria-label="Close" onClick={this.props.onCloseClick}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default TopAlert;