pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "./World.sol";
import "./LandBasic.sol";


/**
* @title Block42 land token contract
* @author Richard Fu (richardf@block42.world)
* @dev Complants with OpenZeppelin's implementation of the ERC721 spec.
*/

contract Land is ERC721Token, Pausable, LandBasic {

  World internal worldContract_;
  mapping(address => bool) internal authorizedAddresses_;

  /**
  * @dev Constructor function, initializes constant strings.
  */
  constructor(address _worldAddress) public
    ERC721Token("Block42 Land", "B42LD") {
    worldContract_ = World(_worldAddress);
  }

  /**
   * @dev Don't accept payment directly to contract.
   */
  function() public payable {
    revert("Do not accept payment directly.");
  }

  /**
   * @dev Throws if a position not within valid range.
   */
  modifier validPosition(uint32 _world, int64 _x, int64 _y) {
    require(isValidPosition(_world, _x, _y), "Invalid position.");
    _;
  }

  /**
   * @dev Checks if a position is within valid range.
   */
  function isValidPosition(uint32 _world, int64 _x, int64 _y) internal pure returns (bool) {
    return _world >= 0 && _world < 4e9 && _x > -1e12 && _x < 1e12 && _y > -1e12 && _y < 1e12;
  }

  /**
   * @dev Throws if called by any account other than the world owner or contract owner.
   */
  modifier onlyAuthorized(uint32 _world) {
    require(msg.sender == worldContract_.ownerOf(_world) || msg.sender == owner || authorizedAddresses_[msg.sender], "Not authorized.");
    _;
  }

  /**
   * @dev Authorizes a contract or a person the right to create a land token, contract owner or world creator only.
   */
  function authorize(address recipient) public onlyOwner {
    require(recipient != address(0) && recipient != owner, "Invalid recipient.");
    authorizedAddresses_[recipient] = true;
  }

  uint256 private constant FACTOR_WORLD = 0x0000000100000000000000000000000000000000000000000000000000000000;
  uint256 private constant FACTOR_X =     0x0000000000000000000000000000000000010000000000000000000000000000;
  uint256 private constant BITS_WORLD =   0xffffffff00000000000000000000000000000000000000000000000000000000;
  uint256 private constant BITS_X =       0x00000000ffffffffffffffffffffffffffff0000000000000000000000000000;
  uint256 private constant BITS_Y =       0x000000000000000000000000000000000000ffffffffffffffffffffffffffff;

  /**
   * @dev Encode world-index, x and y into a token ID.
   * @param _worldId uint32 world index start with 0 and max of 4B (2^32).
   * @param _x int64 x-coordinate of the land, from -1T to +1T (2^63).
   * @param _y int64 y-coordinate of the land, from -1T to +1T (2^63).
   * @return uint256 representing the NFT identifier; 256 bits, 32 bits for world, 112 bits each for x and y.
   */
  function encodeTokenId(uint32 _worldId, int64 _x, int64 _y) public pure validPosition(_worldId, _x, _y) returns (uint256) {
    return ((_worldId * FACTOR_WORLD) & BITS_WORLD) | ((uint256(_x) * FACTOR_X) & BITS_X) | (uint256(_y) & BITS_Y);
  }

  /**
   * @dev Decode a token ID into world-index, x and y.
   * @param _tokenId The NFT identifier
   * @return World index within 4B; x and y within +- 1T.
   */
  function decodeTokenId(uint256 _tokenId) public pure returns (uint32 _worldId, int64 _x, int64 _y) {
    _worldId = uint8((_tokenId & BITS_WORLD) >> 224); // shift right for 2x112 bits
    _x = int32((_tokenId & BITS_X) >> 112); // shift right for 112 bits
    _y = int32(_tokenId & BITS_Y);
    require(isValidPosition(_worldId, _x, _y), "Invalid tokenId.");
  }

  /**
   * @dev Gets the owner of the specified position.
   */
  function ownerOfLand(uint32 _worldId, int64 _x, int64 _y) public view returns (address) {
    return ownerOf(encodeTokenId(_worldId, _x, _y));
  }

  /**
   * @dev Returns whether the specified land exists.
   */
  function existsLand(uint32 _worldId, int64 _x, int64 _y) public view returns (bool) {
    return exists(encodeTokenId(_worldId, _x, _y));
  }

  /**
   * @dev Gets all owned lands of an account.
   */
  function landsOf(address _owner) external view returns (uint32[], int64[], int64[]) {
    uint256 length = ownedTokens[_owner].length;
    uint32[] memory worlds = new uint32[](length);    
    int64[] memory xs = new int64[](length);
    int64[] memory ys = new int64[](length);
    uint32 world;
    int64 x;
    int64 y;
    for (uint i = 0; i < length; i++) {
      (world, x, y) = decodeTokenId(ownedTokens[_owner][i]);
      worlds[i] = world;
      xs[i] = x;
      ys[i] = y;
    }
    return (worlds, xs, ys);
  }

  /**
   * @dev Gets all owned lands of an account in a world.
   */
  function landsOf(uint32 _worldId, address _owner) external view returns (int64[], int64[]) {
    uint256 length = ownedTokens[_owner].length;
    int64[] memory xs = new int64[](length);
    int64[] memory ys = new int64[](length);
    uint32 worldId;
    int64 x;
    int64 y;
    for (uint i = 0; i < length; i++) {
      (worldId, x, y) = decodeTokenId(ownedTokens[_owner][i]);
      if (worldId == _worldId) {
        xs[i] = x;
        ys[i] = y;
      }
    }
    return (xs, ys);
  }

  /**
   * @dev Creates a land, only from authorized addresses.
   */
  function create(uint32 _worldId, int64 _x, int64 _y) public onlyAuthorized(_worldId) validPosition(_worldId, _x, _y) {
    createAndTransfer(msg.sender, _worldId, _x, _y);
  }

  /**
   * @dev Creates a land and assign its ownership to an address, only from authorized addresses.
   */
  function createAndTransfer(address _to, uint32 _worldId, int64 _x, int64 _y) public onlyAuthorized(_worldId) validPosition(_worldId, _x, _y) {
    uint256 tokenId = encodeTokenId(_worldId, _x, _y);
    super._mint(_to, tokenId);
    emit Create(_worldId, _x, _y);
  }

  /**
   * @dev Creates a batch of lands for sale, only from authorized addresses.
   */
  function createBatch(uint32 _worldId, int64[] _xs, int64[] _ys) public onlyAuthorized(_worldId) {
    for(uint i = 0; i < _xs.length; i++) {
      if (isValidPosition(_worldId, _xs[i], _ys[i]))
        create(_worldId, _xs[i], _ys[i]);
    }
  }

  /**
   * @dev Destroys a land, only from authorized addresses for their owned lands.
   */
  function detroy(uint32 _worldId, int64 _x, int64 _y) public onlyAuthorized(_worldId) validPosition(_worldId, _x, _y) {
    uint256 tokenId = encodeTokenId(_worldId, _x, _y);
    require(isApprovedOrOwner(msg.sender, tokenId), "Not approved.");
    _burn(msg.sender, tokenId);
  }

  /**
   * @dev Gets all lands as arrays.
   * @return The array of x, y, owner.
   */
  function allLands(uint32 _checkWorld) public view returns (int64[] xs, int64[] ys, address[] owners) {
    xs = new int64[](allTokens.length);
    ys = new int64[](allTokens.length);
    owners = new address[](allTokens.length);
    for (uint i = 0; i < allTokens.length; i++) {
      uint256 tokenId = allTokens[i];
      (uint32 world, int64 x, int64 y) = decodeTokenId(tokenId);
      if (_checkWorld == world) {
        xs[i] = x;
        ys[i] = y;
        owners[i] = ownerOf(tokenId);
      }
    }
  }

  string public baseURI_ = "http://api.block42.world/lands/";

  /**
   * @dev Sets the base URI, owner only.
   */
  function setBaseURI(string _baseURI) public onlyOwner {
    baseURI_ = _baseURI;
  }
  
  /**
   * @dev Returns an URI for a given position.
   * @dev Throws if the land at the position does not exist. May return an empty string.
   */
  function landURI(uint32 _worldId, int64 _x, int64 _y) public view returns (string) {
    return tokenURI(encodeTokenId(_worldId, _x, _y));
  }

  /**
   * @dev Returns an URI for a given token ID.
   * @dev Throws if the token ID does not exist. May return an empty string.
   * @param _tokenId uint256 ID of the token to query.
   */
  function tokenURI(uint256 _tokenId) public view returns (string) {
    bytes memory uriByte = bytes(tokenURIs[_tokenId]);
    if (uriByte.length == 0) {
      (uint32 world, int64 x, int64 y) = decodeTokenId(_tokenId);
      return string(abi.encodePacked(baseURI_, _uint32ToString(world), "/", _int2str(x), "/", _int2str(y)));
    }
  }

  /**
   * Converts an uint32 to string.
   */
  function _uint32ToString(uint32 i) internal pure returns (string) {
    return _int2str(int(i));
  }

  /**
   * Converts a int to string.
   */
  function _int2str(int i) internal pure returns (string){
    if (i == 0) return "0";
    bool negative = i < 0;
    uint j = uint(negative ? -i : i);
    uint abs = j;         // Keep an unsigned copy
    uint len;
    while (j != 0){
      len++;
      j /= 10;
    }
    if (negative) ++len;  // Make room for '-' sign
    bytes memory bstr = new bytes(len);
    uint k = len - 1;
    while (abs != 0){
      bstr[k--] = byte(48 + abs % 10);
      abs /= 10;
    }
    if (negative) {       // Prepend '-'
      bstr[0] = "-";
    }
    return string(bstr);
  }

}