![Block42](http://assets.block42.world/images/icons/block42_logo_200.png)

# Landpot Web DApp

A complete web DApp for land jackpot buying.

There's 42 lands in total and ONE land is released each week. A land is split into 42 plots and all players can join 1 of 4 teams and bid on one or more plots with ethers. Each team has different reward divided rules. (More detail of each team will be finalized)

The bidding process will be just like eBay, where a bidder place a maximum bid and the current bidding price of the plot is automatically adjusted every time another bidder placing a bid. At the end of the week, the team with most bided plots wins the land. The owner of the land will be assigned to the player who having the most total bids within that team. A portion of the bid ethers go back to rewarding the winning team and the rest will be deposited into the final jackpot. How the team get rewards depends on team rule. (E.g. 50% of the bid ethers distributed back to all bidders in winning team, proportionally to their bided total) The winning team and contributed bidders are saved into the land's description permanently.

After all 42 lands are sold, the game enters free-trade period for another week. Land owners can freely trade their lands to another with agreed prices. A small percentage fee will be charged and deposited into the final jackpot. At the end of the free-trade week, the owner of most lands take the final jackpot ethers. (In case the number of lands are equal for 2 players, the player with the most total bidding price wins)

The ownership of the land is a ERC721 token and will be owned by the owner in life time. Owners of the lands can customize and create building of the land, which will be part of Block42 world and will receive income from the interaction with Block42 players.

Please note that this is still in prototype and under heavy development. The final product may be subject to a number of quality assurance tests to verify conformance with specifications.

<!-- - Working in both Main Ethereum Network and Ropsten Test Network -->
<!-- - Working with MetaMask, local and Infura nodes are commented and can be used for debugging -->
- Prototype from [Truffle Box React](https://github.com/truffle-box/react-box)
- Bootstrap theme and styled
- Web3.js 1.0 beta 35
- Using [OpenZeppelin 1.11.0](https://github.com/OpenZeppelin/openzeppelin-solidity) solidity framework for best security and stability
<!-- - A inlined version for websites can only use iframe (such as Wix) -->

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [Truffle](https://github.com/trufflesuite/truffle) `npm install -g truffle`

### Install local dependencies
```
npm install
```

### Blockchain smart contract development

Run the Truffle development console
```
truffle develop
```

Compile and migrate the smart contracts in Truffle console
```
compile
migrate
```

Test smart contracts
```
// If inside the development console.
test
// If outside the development console..
truffle test
```

### React.js frontend development

Run the webpack server for front-end hot reloading (outside the development console
```
// Serves the front-end on http://localhost:3000
npm run start
```

Jest is included for testing React components. Compile your contracts before running Jest, or you may receive some file not found errors
```
npm run test
```

To build the application for production, use the build command. A production build will be in the build_webpack folder
```
npm run build
```

<!-- ## Modification
To use this crowdsale page for your token ICO, change the token and crowdsale contract address at [main.js](main.js). Then includes the truffle built JSONs, or simple change the ABI at [Cubik.json](js/Cubik.json) and [CubikCrowdsale.json](js/CubikCrowdsale.json). -->

## Terminology For Dummies
- [Truffle](http://truffleframework.com/) - A development framework for Ethereum for writing, deploying and testing smart contract solidity scripts
- [Web3.js](https://github.com/ethereum/web3.js/) - A JavaScript library for communicating with Ethereum network
- [React.js](https://reactjs.org/) - A JavaScript library for building frontend user interfaces
- [Node.js](https://nodejs.org/en/) - A JavaScript runtime for building scalable network applications

## More Info
- [Truffle Boxes](https://truffleframework.com/boxes)
- [create-react-app](https://github.com/facebook/create-react-app/)

## Helper Links
- [Ethereum Kovan Faucet](https://faucet.kovan.radarrelay.com/)

## TODO
- Fix contract event feedback currently not working with MetaMask
- Add better graphic for MetaMask install instruction