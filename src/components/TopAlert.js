import React from 'react'

// import { Alert } from 'react-bootstrap';

class TopAlert extends React.Component {

    render() {
        const content = this.props.content;

        let alertType = "success";
        if (this.props.type === 'danger') {
            alertType = "danger";
        }

        if (content) {
            // return (
            //     <Alert bsStyle={alertType} className="no-margin-bottom">
            //         {content}
            //         <button type="button" className="close" aria-label="Close" onClick={this.props.onCloseClick}>
            //         </button>
            //     </Alert>
            // );
        }
        return null;
    }
}

export default TopAlert;