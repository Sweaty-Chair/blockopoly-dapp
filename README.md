![Block42](http://assets.block42.world/images/icons/block42_logo_200.png)

# Landpot Web dApp

A complete web dApp for land jackpot buying.

One land releases each week, and a land has 42 plots. Players can join 1 of 4

Please note that this is still in prototype and under heavy development. The final product may be subject to a number of quality assurance tests to verify conformance with specifications.

<!-- - Working in both Main Ethereum Network and Ropsten Test Network -->
- Prototype from [Truffle Box React](https://github.com/truffle-box/react-box)
<!-- - Working with MetaMask, local and Infura nodes are commented and can be used for debugging -->
- Bootstrap theme and styled
- Web3.js 1.0 beta 35
<!-- - A inlined version for websites can only use iframe (such as Wix) -->

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [Truffle] (https://github.com/trufflesuite/truffle) `npm install -g truffle`

### Install local dependencies
```
npm install
```

### Blockchain Smart Contract Development

#### Run the Truffle development console
```
truffle develop
```

#### Compile and migrate the smart contracts in Truffle console
```
compile
migrate
```

#### Test smart contracts
```
// If inside the development console.
test
// If outside the development console..
truffle test
```

### React Frontend Development

#### Run the webpack server for front-end hot reloading (outside the development console
```
// Serves the front-end on http://localhost:3000
npm run start
```

### Jest is included for testing React components. Compile your contracts before running Jest, or you may receive some file not found errors
```
// Run Jest outside of the development console for front-end component tests.
npm run test
```

### To build the application for production, use the build command. A production build will be in the build_webpack folder
```
npm run build
```

<!-- ## Modification
To use this crowdsale page for your token ICO, change the token and crowdsale contract address at [main.js](main.js). Then includes the truffle built JSONs, or simple change the ABI at [Cubik.json](js/Cubik.json) and [CubikCrowdsale.json](js/CubikCrowdsale.json). -->

## Terminology For Dummies
- [Truffle](http://truffleframework.com/) - A development framework for Ethereum for writing, deploying and testing smart contract solidity scripts
- [Web3.js](https://github.com/ethereum/web3.js/) - A JavaScript library for communicating with Ethereum network
- [React.js](https://reactjs.org/) - A JavaScript library for building frontend user interfaces
- [Node.js](https://nodejs.org/en/) - A JavaScript for building scalable network applications

## More Info
- [Truffle Boxes](https://truffleframework.com/boxes)
- [create-react-app](https://github.com/facebook/create-react-app/)

## TODO
- Optimize using React.js
- Provide a better auto flatten method using NPM
- Fix contract event feedback currently not working with MetaMask
- Add better graphic for MetaMask install instruction