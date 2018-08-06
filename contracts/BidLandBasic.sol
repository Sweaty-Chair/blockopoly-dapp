pragma solidity ^0.4.24;

import "./LandBasic.sol";


/**
 * @title BidLand interface
 */
contract BidLandBasic is LandBasic {
  function setBidPrice(uint32 _worldId, int64 _x, int64 _y, uint256 _biddingPrice) public;
  function setInfo(uint32 _worldId, int64 _x, int64 _y, string _name, string _description) public;
}