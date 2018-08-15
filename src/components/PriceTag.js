import React from 'react'

class PriceTag extends React.Component {
    render() {
        let priceClass = "price-tag";
        if (parseFloat(this.props.currencyPrice) < 0) {
            priceClass += " green";
        } else {
            priceClass += " red"
        }
        return(
            <div className="price-block">
                <span id="currency-type" className="price-label">
                    {/* <i className="fab fa-btc"></i> */}
                    { this.props.currencyType + ": " }
                </span>
                <span id="currency-price" className={priceClass}>{ this.props.currencyPrice }%</span>
            </div>
        );
    }
}

export default PriceTag;