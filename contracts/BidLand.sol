pragma solidity ^0.4.24;

import "./Land.sol";
import "./BidLandBasic.sol";

/**
* @title Block42 bid land token contract
* @author Richard Fu (richardf@block42.world)
* @dev Complant with OpenZeppelin's implementation of the ERC721 spec, add bid info on top of Land.
*/

contract BidLand is Land, BidLandBasic {

  mapping(uint256 => uint256) internal biddingPrice;
  mapping(uint256 => string) internal names;
  mapping(uint256 => string) internal descriptions;

  /**
   * @dev Constructor function, initializes constant strings.
   */
  constructor(address _worldAddress) public Land(_worldAddress) {
  }
  
  function setBidPrice(uint32 _worldId, int64 _x, int64 _y, uint256 _biddingPrice) public validPosition(_worldId, _x, _y) onlyAuthorized(_worldId) {
    uint256 tokenId = encodeTokenId(_worldId, _x, _y);
    biddingPrice[tokenId] = _biddingPrice;
  }

  function setInfo(uint32 _worldId, int64 _x, int64 _y, string _name, string _description) public validPosition(_worldId, _x, _y) {
    uint256 tokenId = encodeTokenId(_worldId, _x, _y);
    require(msg.sender == ownerOf(tokenId) || msg.sender == worldContract_.ownerOf(_worldId) || msg.sender == owner);
    names[tokenId] = _name;
    descriptions[tokenId] = _description;
  }

  /**
  * @dev Gets the name of the specified token.
  */
  function nameOf(uint256 _tokenId) public view returns (string) {
    return names[_tokenId];
  }

  /**
  * @dev Gets the descripition of the specified token.
  */
  function descriptionOf(uint256 _tokenId) public view returns (string) {
    return descriptions[_tokenId];
  }

  /**
  * @dev Gets the info of the specified token.
  */
  function infoOf(uint256 _tokenId) public view returns (string, string) {
    return (names[_tokenId], descriptions[_tokenId]);
  }

}