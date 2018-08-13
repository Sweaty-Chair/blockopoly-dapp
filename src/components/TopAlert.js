import React from 'react'

class TopAlert extends React.Component {

    render() {
        const type = this.props.type;
        const content = this.props.content;

        let className = "top-alert";
        if (this.props.type === 'danger') {
            className += " bgcolor-danger";
        } else {
            className += " bgcolor-success";
        }

        if (!content) {
            className += " hidden"
        }
        return (
            <div className={className}>
                <p>{content}</p>
                <a className="close" onClick={this.props.onCloseClick}/>
            </div>
        );
    }
}

export default TopAlert;