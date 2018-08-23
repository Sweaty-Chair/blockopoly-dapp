import React from 'react'

class CenterModel extends React.Component {
    constructor(props) {
        super(props);
        this.toggleModel = this.toggleModel.bind(this);
        this.state = {
            header: "",
            content: "",
            toggle: false,
        }
    }

    toggleModel(header, content) {
        this.setState({
            header: header,
            content: content,
        }, () => {
            document.getElementById("show-modal").click();
        })
    }

    componentDidMount() {
        window.toggleModel = this.toggleModel;
    }

    simulateClick(e) {
        e.click();
    }

    render() {
        return (
            <div className="modal fade" id="ModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">{this.state.header}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="false">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.state.content}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
                <button type="button"  id="show-modal" data-toggle="modal" data-target="#ModalCenter">
                </button>
            </div>
        );
    }
}

export default CenterModel;