pragma solidity ^0.4.24;

contract Test {
  
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

}