import 'bootstrap/dist/css/bootstrap.min.css'; // TODO use Sass
import 'bootstrap';
import React from 'react'
import ReactDOM from 'react-dom'
import Bid from './Bid'
import Footer from './components/Footer'
import PriceScroll from './components/PriceScroll'
import CenterModel from './components/CenterModel'
// import App from './App'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/main.css'


ReactDOM.render(
  <div>
    <Bid />
    <CenterModel />
    <PriceScroll />
    <Footer />
  </div>,
  document.getElementById('root')
);
