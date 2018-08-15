import React from 'react'
import PriceTag from './PriceTag'

class PriceScroll extends React.Component {
    constructor(props) {
        super(props);
        this.fetchCurrency = this.fetchCurrency.bind(this);
        this.onMouseHover = this.onMouseHover.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.scrollLeft = this.scrollLeft.bind(this);
        this.state = {
            currencyList: [],
            // scrollInterval: null,
        }
    }

    componentDidMount() {
        this.fetchCurrency();
        this.scrollInterval = setInterval(this.scrollLeft, 50);
    }

    fetchCurrency() {
        fetch("https://api.coinmarketcap.com/v2/ticker/?limit=10&structure=array")
            .then(res => res.json())
            .then((result) => {
                console.log(result.data);
                this.setState({
                    currencyList: result.data,
                });
            },
            (error) => {
                console.log(error);
            }
        )
    }

    scrollLeft() {
        var area = document.getElementById("price-bar");
        var content = document.getElementById("scroll-content");
        if (area.scrollLeft >= content.offsetWidth) {
            area.scrollLeft = 0;
            this.fetchCurrency();
        } else {
            area.scrollLeft++;
        }
    }

    onMouseHover() {
        clearInterval(this.scrollInterval);
    }

    onMouseOut() {
        this.scrollInterval = setInterval(this.scrollLeft, 50);
    }

    render() {
        let rows = [];
        for (let i = 0; i < this.state.currencyList.length; ++i) {
            rows.push(
                <PriceTag
                    key={this.state.currencyList[i].symbol}
                    currencyType={this.state.currencyList[i].symbol}
                    currencyPrice={this.state.currencyList[i].quotes.USD.percent_change_24h}
                />
            )
        }
        return(
            <div id="price-bar" onMouseOver={this.onMouseHover} onMouseOut={this.onMouseOut}>
                <div id="scroll-content">
                    {rows}
                </div>
                <div id="scroll-content-copy">
                    {rows}
                    {rows}
                </div>
            </div>
        )
    }
}

export default PriceScroll;