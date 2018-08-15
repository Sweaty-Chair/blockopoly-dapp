import React from 'react'

class Footer extends React.Component {
    render() {
        return (
            <footer className="page-footer font-small bg-dark fixed-bottom">
                <div className="footer-copyright text-center py-1">© 2018 Copyright:
                    <a target="_blank" href="https://www.block42.world/"><span className="text-white"> block42.world</span></a>
                </div>
            </footer>
        );
    }
}

export default Footer;