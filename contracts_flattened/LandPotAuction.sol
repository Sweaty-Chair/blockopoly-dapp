pragma solidity ^0.4.24;

// File: contracts/LandBasic.sol

/**
 * @title BidLand interface
 */
contract LandBasic {
  function createAndTransfer(address _to, uint32 _world, int64 _x, int64 _y) public;
  event Create(uint32 indexed _world, int64 indexed _x, int64 indexed _y);
}

// File: contracts/BidLandBasic.sol

/**
 * @title BidLand interface
 */
contract BidLandBasic is LandBasic {
  function setBidPrice(uint32 _worldId, int64 _x, int64 _y, uint256 _biddingPrice) public;
  function setInfo(uint32 _worldId, int64 _x, int64 _y, string _name, string _description) public;
}

// File: openzeppelin-solidity/contracts/ownership/Ownable.sol

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}

// File: openzeppelin-solidity/contracts/lifecycle/Pausable.sol

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Ownable {
  event Pause();
  event Unpause();

  bool public paused = false;


  /**
   * @dev Modifier to make a function callable only when the contract is not paused.
   */
  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the contract is paused.
   */
  modifier whenPaused() {
    require(paused);
    _;
  }

  /**
   * @dev called by the owner to pause, triggers stopped state
   */
  function pause() onlyOwner whenNotPaused public {
    paused = true;
    emit Pause();
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() onlyOwner whenPaused public {
    paused = false;
    emit Unpause();
  }
}

// File: openzeppelin-solidity/contracts/math/SafeMath.sol

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}

// File: contracts/LandPotAuction.sol

/**
* @title Block42 Landpot auction
* @author Richard Fu (richardf@block42.world)
* @dev A auction for bidding plots and create ERC721 land on bidding completed.
*/

contract LandPotAuction is Pausable {
  using SafeMath for uint256;
  
  // Represents an auction of a land
  struct Auction {
    int64 x;
    int64 y;
    uint64 endingTime; // Uses uint64 for saving space
    Plot[] plots;
  }

  // Represents a plot bidding in an auction
  struct Plot {
    int8 x;
    int8 y;
    address bidder;
    uint8 team;
    uint256 currentBid;
    uint256 maxBid;
    mapping(address => uint256) bids; // Keep track of all bids for final rewards
  }

  event Bid(int8 x, int8 y, address indexed bidder, uint8 indexed team, uint256 currentBid);
  event OutBid(int8 x, int8 y, address indexed oldBidder, address indexed bidder, uint8 indexed team, uint256 currentBid);
  event Withdrawn(address indexed payee, uint256 weiAmount);

  uint8 constant PLOT_WIDTH = 7; // 7x6 plots
  uint8 constant PLOT_COUNT = 42; // Cache for better performance and less gas. 7x6 plots = 42
  int8 constant PLOT_WIDTH_HALF = 3; // Cache for better performance and less gas. 7 /2 = 3

  // The current world of all selling lands, this is only change after the final free-trade period
  uint32 public currentWorldId;

  // The final jackpot in ETH
  uint256 public jackpot;

  // The outbid balance all address, used for people withdraw
  mapping(address => uint256) public balances;
  uint256 public totalBalances;

  // Current auction
  Auction public currentAuction;

  // Past auctions
  mapping(uint32 => Auction[]) public pastAuctions; // WorldId => Auction array
  mapping(uint256 => Auction) public landAuction; // LandId (ERC721 token) => Auction

  // Contract of the ERC721 BidLand
  BidLandBasic internal bidLandContract_;

  constructor(address _bidLandAddress) public {
    bidLandContract_ = BidLandBasic(_bidLandAddress);
  }

  /**
   * @dev Starts a new auction for a new land, contract owner only.
   */
  function startAuction(int64 x, int64 y) public onlyOwner {
    require(currentAuction.endingTime < now);
    archiveCurrentAuction();
    currentAuction.x = x;
    currentAuction.y = y;
    currentAuction.endingTime = uint64((now - now % 86400) + 1 weeks);
    bool push = false;
    if (currentAuction.plots.length == 0)
      push = true;
    for (uint8 k = 0; k < PLOT_COUNT; k++) {
      (int8 i, int8 j) = plotIndexToPosition(k);
      if (push)
        currentAuction.plots.push(Plot(i, j, address(0), 0, 0, 0)); // Creates new struct and adds it in storage
      else
        currentAuction.plots[k] = Plot(i, j, address(0), 0, 0, 0); // Creates new struct and updates it in storage
    }
  }

  /**
   * @dev Starts the free-trade period.
   */
  function startFreeTrade() external onlyOwner {
    startAuction(0, 0); // (0,0) is not for sale so used it as an indicator for free-trade period
    // TODO
  }

  function endAuction() external onlyOwner {
    archiveCurrentAuction();
    currentAuction.x = 0;
    currentAuction.y = 0;
    currentAuction.endingTime = uint64(now);
  }

  function archiveCurrentAuction() internal {
    if (currentAuction.x != 0 || currentAuction.y != 0)
      pastAuctions[currentWorldId].push(currentAuction);
    // TODO: copy struct
  }

  /**
   * @dev Restarts the whole game with new world ID. World ID must be created with World contract first.
   */
  function restartGame(uint32 _worldId, int64 x, int64 y) external onlyOwner {
    require(currentAuction.endingTime < now);
    currentWorldId = _worldId;
    startAuction(x, y);
    // TODO
  }

  /**
   * @dev Maps a 2D plot position to a 1D array index. (-3,-3)->(3,3) to 0->49
   */
  function plotPositionToIndex(int8 i, int8 j) public pure returns (uint8) {
    return uint8((i + PLOT_WIDTH_HALF) * int8(PLOT_WIDTH) + j + PLOT_WIDTH_HALF);
  }

  /**
   * @dev Converts a a 1D plot array index to 2D position. 0->49 to (-3,-3)->(3,3)
   */
  function plotIndexToPosition(uint8 k) public pure returns (int8 i, int8 j) {
    i = int8(k) / int8(PLOT_WIDTH) - PLOT_WIDTH_HALF;
    j = int8(k) % int8(PLOT_WIDTH) - PLOT_WIDTH_HALF;
  }
  
  /**
   * @dev Gets info current auction, for testing only.
   */
  function getAuction() external view returns (int64, int64, uint64) {
    return (currentAuction.x, currentAuction.y, currentAuction.endingTime);
  }

  /**
   * @dev Gets ending time in current auction.
   */
  function getEndingTime() external view returns (uint64) {
    return currentAuction.endingTime;
  }
  
  /**
   * @dev Gets a specific plot in current auction.
   */
  function getPlot(int8 i, int8 j) external view returns (int8 x, int8 y, address bidder, uint8 team, uint256 currentBid) {
    return getPlotByIndex(plotPositionToIndex(i, j));
  }

  function getPlotByIndex(uint8 k) public view returns (int8 x, int8 y, address bidder, uint8 team, uint256 currentBid) {
    Plot storage plot = currentAuction.plots[k];
    return(plot.x, plot.y, plot.bidder, plot.team, plot.currentBid);
  }

  /**
   * @dev Gets all plots in current auction.
   */
  function getPlots() external view returns (int8[] xs, int8[] ys, address[] bidders, uint8[] teams, uint256[] currentBids) {
    xs = new int8[](PLOT_COUNT);
    ys = new int8[](PLOT_COUNT);
    bidders = new address[](PLOT_COUNT);
    teams = new uint8[](PLOT_COUNT);
    currentBids = new uint256[](PLOT_COUNT);
    for (uint8 k = 0; k < PLOT_COUNT; k++) {
      Plot storage plot = currentAuction.plots[k];
      xs[k] = plot.x;
      ys[k] = plot.y;
      bidders[k] = plot.bidder;
      teams[k] = plot.team;
      currentBids[k] = plot.currentBid;
    }
  }

  /**
   * @dev Throws if auctioning land is (0,0), i.e. bidding closed.
   */
  modifier canBid() {
    require(currentAuction.x != 0 || currentAuction.y != 0);
    _;
  }

  /**
   * @dev Bids on a plot by anyone.
   */
  function bid(int8 i, int8 j, uint8 team) external payable whenNotPaused canBid {
    uint8 k = plotPositionToIndex(i, j);
    Plot storage plot = currentAuction.plots[k];
    uint256 newBid = balances[msg.sender].add(msg.value);
    require(newBid >= plot.currentBid.add(1 finney)); // Must larger than current bid
    if (newBid <= plot.maxBid) { // Failed to outbid current bidding, less than its max bid
      emit OutBid(plot.x, plot.y, plot.bidder, msg.sender, team, newBid);
      newBid = newBid.add(1 finney); // Add a finney to the current bid
      plot.currentBid = newBid; // Increase the current bid
      emit OutBid(plot.x, plot.y, msg.sender, plot.bidder, plot.team, newBid);
      revert();
    }
    if (plot.bidder != address(0)) { // Add the bid of the old bidder to balance, so he can withdraw later
      totalBalances = totalBalances.add(plot.maxBid);
      balances[plot.bidder] = balances[plot.bidder].add(plot.maxBid);
    }
    emptyMyBalance(); // No more balance
    plot.bidder = msg.sender;
    plot.team = team;
    plot.currentBid = plot.maxBid.add(1 finney);
    plot.maxBid = newBid;
    emit Bid(plot.x, plot.y, plot.bidder, team, plot.currentBid);
  }

  /**
   * @dev Gets all contributed bids at all plots of the current auction.
   */
  function getMyContributedBids() external view returns (int8[] xs, int8[] ys, uint256[] bids) {
    xs = new int8[](PLOT_COUNT);
    ys = new int8[](PLOT_COUNT);
    bids = new uint256[](PLOT_COUNT);
    for (uint8 k = 0; k < PLOT_COUNT; k++) {
      Plot storage p = currentAuction.plots[k];
      if (p.bids[msg.sender] > 0) {
        xs[k] = p.x;
        ys[k] = p.y;
        bids[k] = p.bids[msg.sender];
      }
    }
  }

  /**
   * @dev Gets the max bid of sender at specfic plot.
   */
  function getMaxBid(int8 i, int8 j) external view returns (uint256) {
    Plot storage plot = currentAuction.plots[plotPositionToIndex(i, j)];
    require(plot.bidder == msg.sender); // Only bidder can get the max bid
    return plot.maxBid;
  }
  
  /**
   * @dev Gets the outbid balance of an address.
   */
  function balanceOf(address who) public view returns (uint256) {
    return balances[who];
  }

  /**
   * @dev Gets the outbid balance of sender.
   */
  function balanceOfMe() external view returns (uint256) {
    return balanceOf(msg.sender);
  }
  
  /**
   * @dev Withdraws all remaining outbid balance of sender.
   */
  function withdraw() external {
    require(balances[msg.sender] > 0);
    uint256 weiAmount = balances[msg.sender];
    emptyMyBalance();
    msg.sender.transfer(weiAmount);
    emit Withdrawn(msg.sender, weiAmount);
  }
  
  /**
   * @dev Empties the balance of sender, internal use only.
   */
  function emptyMyBalance() internal {
    totalBalances = totalBalances.sub(balances[msg.sender]);
    balances[msg.sender] = 0;
  }
  
  /**
   * @dev Withdraws the earned ETH while keeping enough for jackpot and outbid balances, owner only.
   */
  function ownerWithdraw() external onlyOwner {
    require(address(this).balance > jackpot.add(totalBalances));
    msg.sender.transfer(address(this).balance.sub(jackpot).sub(totalBalances));
  }

}
