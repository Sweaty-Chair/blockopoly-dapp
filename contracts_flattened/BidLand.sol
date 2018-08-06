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

// File: openzeppelin-solidity/contracts/introspection/ERC165.sol

/**
 * @title ERC165
 * @dev https://github.com/ethereum/EIPs/blob/master/EIPS/eip-165.md
 */
interface ERC165 {

  /**
   * @notice Query if a contract implements an interface
   * @param _interfaceId The interface identifier, as specified in ERC-165
   * @dev Interface identification is specified in ERC-165. This function
   * uses less than 30,000 gas.
   */
  function supportsInterface(bytes4 _interfaceId)
    external
    view
    returns (bool);
}

// File: openzeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol

/**
 * @title SupportsInterfaceWithLookup
 * @author Matt Condon (@shrugs)
 * @dev Implements ERC165 using a lookup table.
 */
contract SupportsInterfaceWithLookup is ERC165 {
  bytes4 public constant InterfaceId_ERC165 = 0x01ffc9a7;
  /**
   * 0x01ffc9a7 ===
   *   bytes4(keccak256('supportsInterface(bytes4)'))
   */

  /**
   * @dev a mapping of interface id to whether or not it's supported
   */
  mapping(bytes4 => bool) internal supportedInterfaces;

  /**
   * @dev A contract implementing SupportsInterfaceWithLookup
   * implement ERC165 itself
   */
  constructor()
    public
  {
    _registerInterface(InterfaceId_ERC165);
  }

  /**
   * @dev implement supportsInterface(bytes4) using a lookup table
   */
  function supportsInterface(bytes4 _interfaceId)
    external
    view
    returns (bool)
  {
    return supportedInterfaces[_interfaceId];
  }

  /**
   * @dev private method for registering an interface
   */
  function _registerInterface(bytes4 _interfaceId)
    internal
  {
    require(_interfaceId != 0xffffffff);
    supportedInterfaces[_interfaceId] = true;
  }
}

// File: openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol

/**
 * @title ERC721 Non-Fungible Token Standard basic interface
 * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract ERC721Basic is ERC165 {
  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 indexed _tokenId
  );
  event Approval(
    address indexed _owner,
    address indexed _approved,
    uint256 indexed _tokenId
  );
  event ApprovalForAll(
    address indexed _owner,
    address indexed _operator,
    bool _approved
  );

  function balanceOf(address _owner) public view returns (uint256 _balance);
  function ownerOf(uint256 _tokenId) public view returns (address _owner);
  function exists(uint256 _tokenId) public view returns (bool _exists);

  function approve(address _to, uint256 _tokenId) public;
  function getApproved(uint256 _tokenId)
    public view returns (address _operator);

  function setApprovalForAll(address _operator, bool _approved) public;
  function isApprovedForAll(address _owner, address _operator)
    public view returns (bool);

  function transferFrom(address _from, address _to, uint256 _tokenId) public;
  function safeTransferFrom(address _from, address _to, uint256 _tokenId)
    public;

  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _tokenId,
    bytes _data
  )
    public;
}

// File: openzeppelin-solidity/contracts/token/ERC721/ERC721.sol

/**
 * @title ERC-721 Non-Fungible Token Standard, optional enumeration extension
 * @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract ERC721Enumerable is ERC721Basic {
  function totalSupply() public view returns (uint256);
  function tokenOfOwnerByIndex(
    address _owner,
    uint256 _index
  )
    public
    view
    returns (uint256 _tokenId);

  function tokenByIndex(uint256 _index) public view returns (uint256);
}


/**
 * @title ERC-721 Non-Fungible Token Standard, optional metadata extension
 * @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract ERC721Metadata is ERC721Basic {
  function name() external view returns (string _name);
  function symbol() external view returns (string _symbol);
  function tokenURI(uint256 _tokenId) public view returns (string);
}


/**
 * @title ERC-721 Non-Fungible Token Standard, full implementation interface
 * @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract ERC721 is ERC721Basic, ERC721Enumerable, ERC721Metadata {
}

// File: openzeppelin-solidity/contracts/AddressUtils.sol

/**
 * Utility library of inline functions on addresses
 */
library AddressUtils {

  /**
   * Returns whether the target address is a contract
   * @dev This function will return false if invoked during the constructor of a contract,
   * as the code is not actually created until after the constructor finishes.
   * @param addr address to check
   * @return whether the target address is a contract
   */
  function isContract(address addr) internal view returns (bool) {
    uint256 size;
    // XXX Currently there is no better way to check if there is a contract in an address
    // than to check the size of the code at that address.
    // See https://ethereum.stackexchange.com/a/14016/36603
    // for more details about how this works.
    // TODO Check this again before the Serenity release, because all addresses will be
    // contracts then.
    // solium-disable-next-line security/no-inline-assembly
    assembly { size := extcodesize(addr) }
    return size > 0;
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

// File: openzeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol

/**
 * @title ERC721 token receiver interface
 * @dev Interface for any contract that wants to support safeTransfers
 * from ERC721 asset contracts.
 */
contract ERC721Receiver {
  /**
   * @dev Magic value to be returned upon successful reception of an NFT
   *  Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`,
   *  which can be also obtained as `ERC721Receiver(0).onERC721Received.selector`
   */
  bytes4 internal constant ERC721_RECEIVED = 0x150b7a02;

  /**
   * @notice Handle the receipt of an NFT
   * @dev The ERC721 smart contract calls this function on the recipient
   * after a `safetransfer`. This function MAY throw to revert and reject the
   * transfer. Return of other than the magic value MUST result in the 
   * transaction being reverted.
   * Note: the contract address is always the message sender.
   * @param _operator The address which called `safeTransferFrom` function
   * @param _from The address which previously owned the token
   * @param _tokenId The NFT identifier which is being transfered
   * @param _data Additional data with no specified format
   * @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
   */
  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes _data
  )
    public
    returns(bytes4);
}

// File: openzeppelin-solidity/contracts/token/ERC721/ERC721BasicToken.sol

/**
 * @title ERC721 Non-Fungible Token Standard basic implementation
 * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract ERC721BasicToken is SupportsInterfaceWithLookup, ERC721Basic {

  bytes4 private constant InterfaceId_ERC721 = 0x80ac58cd;
  /*
   * 0x80ac58cd ===
   *   bytes4(keccak256('balanceOf(address)')) ^
   *   bytes4(keccak256('ownerOf(uint256)')) ^
   *   bytes4(keccak256('approve(address,uint256)')) ^
   *   bytes4(keccak256('getApproved(uint256)')) ^
   *   bytes4(keccak256('setApprovalForAll(address,bool)')) ^
   *   bytes4(keccak256('isApprovedForAll(address,address)')) ^
   *   bytes4(keccak256('transferFrom(address,address,uint256)')) ^
   *   bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^
   *   bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'))
   */

  bytes4 private constant InterfaceId_ERC721Exists = 0x4f558e79;
  /*
   * 0x4f558e79 ===
   *   bytes4(keccak256('exists(uint256)'))
   */

  using SafeMath for uint256;
  using AddressUtils for address;

  // Equals to `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
  // which can be also obtained as `ERC721Receiver(0).onERC721Received.selector`
  bytes4 private constant ERC721_RECEIVED = 0x150b7a02;

  // Mapping from token ID to owner
  mapping (uint256 => address) internal tokenOwner;

  // Mapping from token ID to approved address
  mapping (uint256 => address) internal tokenApprovals;

  // Mapping from owner to number of owned token
  mapping (address => uint256) internal ownedTokensCount;

  // Mapping from owner to operator approvals
  mapping (address => mapping (address => bool)) internal operatorApprovals;

  /**
   * @dev Guarantees msg.sender is owner of the given token
   * @param _tokenId uint256 ID of the token to validate its ownership belongs to msg.sender
   */
  modifier onlyOwnerOf(uint256 _tokenId) {
    require(ownerOf(_tokenId) == msg.sender);
    _;
  }

  /**
   * @dev Checks msg.sender can transfer a token, by being owner, approved, or operator
   * @param _tokenId uint256 ID of the token to validate
   */
  modifier canTransfer(uint256 _tokenId) {
    require(isApprovedOrOwner(msg.sender, _tokenId));
    _;
  }

  constructor()
    public
  {
    // register the supported interfaces to conform to ERC721 via ERC165
    _registerInterface(InterfaceId_ERC721);
    _registerInterface(InterfaceId_ERC721Exists);
  }

  /**
   * @dev Gets the balance of the specified address
   * @param _owner address to query the balance of
   * @return uint256 representing the amount owned by the passed address
   */
  function balanceOf(address _owner) public view returns (uint256) {
    require(_owner != address(0));
    return ownedTokensCount[_owner];
  }

  /**
   * @dev Gets the owner of the specified token ID
   * @param _tokenId uint256 ID of the token to query the owner of
   * @return owner address currently marked as the owner of the given token ID
   */
  function ownerOf(uint256 _tokenId) public view returns (address) {
    address owner = tokenOwner[_tokenId];
    require(owner != address(0));
    return owner;
  }

  /**
   * @dev Returns whether the specified token exists
   * @param _tokenId uint256 ID of the token to query the existence of
   * @return whether the token exists
   */
  function exists(uint256 _tokenId) public view returns (bool) {
    address owner = tokenOwner[_tokenId];
    return owner != address(0);
  }

  /**
   * @dev Approves another address to transfer the given token ID
   * The zero address indicates there is no approved address.
   * There can only be one approved address per token at a given time.
   * Can only be called by the token owner or an approved operator.
   * @param _to address to be approved for the given token ID
   * @param _tokenId uint256 ID of the token to be approved
   */
  function approve(address _to, uint256 _tokenId) public {
    address owner = ownerOf(_tokenId);
    require(_to != owner);
    require(msg.sender == owner || isApprovedForAll(owner, msg.sender));

    tokenApprovals[_tokenId] = _to;
    emit Approval(owner, _to, _tokenId);
  }

  /**
   * @dev Gets the approved address for a token ID, or zero if no address set
   * @param _tokenId uint256 ID of the token to query the approval of
   * @return address currently approved for the given token ID
   */
  function getApproved(uint256 _tokenId) public view returns (address) {
    return tokenApprovals[_tokenId];
  }

  /**
   * @dev Sets or unsets the approval of a given operator
   * An operator is allowed to transfer all tokens of the sender on their behalf
   * @param _to operator address to set the approval
   * @param _approved representing the status of the approval to be set
   */
  function setApprovalForAll(address _to, bool _approved) public {
    require(_to != msg.sender);
    operatorApprovals[msg.sender][_to] = _approved;
    emit ApprovalForAll(msg.sender, _to, _approved);
  }

  /**
   * @dev Tells whether an operator is approved by a given owner
   * @param _owner owner address which you want to query the approval of
   * @param _operator operator address which you want to query the approval of
   * @return bool whether the given operator is approved by the given owner
   */
  function isApprovedForAll(
    address _owner,
    address _operator
  )
    public
    view
    returns (bool)
  {
    return operatorApprovals[_owner][_operator];
  }

  /**
   * @dev Transfers the ownership of a given token ID to another address
   * Usage of this method is discouraged, use `safeTransferFrom` whenever possible
   * Requires the msg sender to be the owner, approved, or operator
   * @param _from current owner of the token
   * @param _to address to receive the ownership of the given token ID
   * @param _tokenId uint256 ID of the token to be transferred
  */
  function transferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  )
    public
    canTransfer(_tokenId)
  {
    require(_from != address(0));
    require(_to != address(0));

    clearApproval(_from, _tokenId);
    removeTokenFrom(_from, _tokenId);
    addTokenTo(_to, _tokenId);

    emit Transfer(_from, _to, _tokenId);
  }

  /**
   * @dev Safely transfers the ownership of a given token ID to another address
   * If the target address is a contract, it must implement `onERC721Received`,
   * which is called upon a safe transfer, and return the magic value
   * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
   * the transfer is reverted.
   *
   * Requires the msg sender to be the owner, approved, or operator
   * @param _from current owner of the token
   * @param _to address to receive the ownership of the given token ID
   * @param _tokenId uint256 ID of the token to be transferred
  */
  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  )
    public
    canTransfer(_tokenId)
  {
    // solium-disable-next-line arg-overflow
    safeTransferFrom(_from, _to, _tokenId, "");
  }

  /**
   * @dev Safely transfers the ownership of a given token ID to another address
   * If the target address is a contract, it must implement `onERC721Received`,
   * which is called upon a safe transfer, and return the magic value
   * `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`; otherwise,
   * the transfer is reverted.
   * Requires the msg sender to be the owner, approved, or operator
   * @param _from current owner of the token
   * @param _to address to receive the ownership of the given token ID
   * @param _tokenId uint256 ID of the token to be transferred
   * @param _data bytes data to send along with a safe transfer check
   */
  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _tokenId,
    bytes _data
  )
    public
    canTransfer(_tokenId)
  {
    transferFrom(_from, _to, _tokenId);
    // solium-disable-next-line arg-overflow
    require(checkAndCallSafeTransfer(_from, _to, _tokenId, _data));
  }

  /**
   * @dev Returns whether the given spender can transfer a given token ID
   * @param _spender address of the spender to query
   * @param _tokenId uint256 ID of the token to be transferred
   * @return bool whether the msg.sender is approved for the given token ID,
   *  is an operator of the owner, or is the owner of the token
   */
  function isApprovedOrOwner(
    address _spender,
    uint256 _tokenId
  )
    internal
    view
    returns (bool)
  {
    address owner = ownerOf(_tokenId);
    // Disable solium check because of
    // https://github.com/duaraghav8/Solium/issues/175
    // solium-disable-next-line operator-whitespace
    return (
      _spender == owner ||
      getApproved(_tokenId) == _spender ||
      isApprovedForAll(owner, _spender)
    );
  }

  /**
   * @dev Internal function to mint a new token
   * Reverts if the given token ID already exists
   * @param _to The address that will own the minted token
   * @param _tokenId uint256 ID of the token to be minted by the msg.sender
   */
  function _mint(address _to, uint256 _tokenId) internal {
    require(_to != address(0));
    addTokenTo(_to, _tokenId);
    emit Transfer(address(0), _to, _tokenId);
  }

  /**
   * @dev Internal function to burn a specific token
   * Reverts if the token does not exist
   * @param _tokenId uint256 ID of the token being burned by the msg.sender
   */
  function _burn(address _owner, uint256 _tokenId) internal {
    clearApproval(_owner, _tokenId);
    removeTokenFrom(_owner, _tokenId);
    emit Transfer(_owner, address(0), _tokenId);
  }

  /**
   * @dev Internal function to clear current approval of a given token ID
   * Reverts if the given address is not indeed the owner of the token
   * @param _owner owner of the token
   * @param _tokenId uint256 ID of the token to be transferred
   */
  function clearApproval(address _owner, uint256 _tokenId) internal {
    require(ownerOf(_tokenId) == _owner);
    if (tokenApprovals[_tokenId] != address(0)) {
      tokenApprovals[_tokenId] = address(0);
    }
  }

  /**
   * @dev Internal function to add a token ID to the list of a given address
   * @param _to address representing the new owner of the given token ID
   * @param _tokenId uint256 ID of the token to be added to the tokens list of the given address
   */
  function addTokenTo(address _to, uint256 _tokenId) internal {
    require(tokenOwner[_tokenId] == address(0));
    tokenOwner[_tokenId] = _to;
    ownedTokensCount[_to] = ownedTokensCount[_to].add(1);
  }

  /**
   * @dev Internal function to remove a token ID from the list of a given address
   * @param _from address representing the previous owner of the given token ID
   * @param _tokenId uint256 ID of the token to be removed from the tokens list of the given address
   */
  function removeTokenFrom(address _from, uint256 _tokenId) internal {
    require(ownerOf(_tokenId) == _from);
    ownedTokensCount[_from] = ownedTokensCount[_from].sub(1);
    tokenOwner[_tokenId] = address(0);
  }

  /**
   * @dev Internal function to invoke `onERC721Received` on a target address
   * The call is not executed if the target address is not a contract
   * @param _from address representing the previous owner of the given token ID
   * @param _to target address that will receive the tokens
   * @param _tokenId uint256 ID of the token to be transferred
   * @param _data bytes optional data to send along with the call
   * @return whether the call correctly returned the expected magic value
   */
  function checkAndCallSafeTransfer(
    address _from,
    address _to,
    uint256 _tokenId,
    bytes _data
  )
    internal
    returns (bool)
  {
    if (!_to.isContract()) {
      return true;
    }
    bytes4 retval = ERC721Receiver(_to).onERC721Received(
      msg.sender, _from, _tokenId, _data);
    return (retval == ERC721_RECEIVED);
  }
}

// File: openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol

/**
 * @title Full ERC721 Token
 * This implementation includes all the required and some optional functionality of the ERC721 standard
 * Moreover, it includes approve all functionality using operator terminology
 * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract ERC721Token is SupportsInterfaceWithLookup, ERC721BasicToken, ERC721 {

  bytes4 private constant InterfaceId_ERC721Enumerable = 0x780e9d63;
  /**
   * 0x780e9d63 ===
   *   bytes4(keccak256('totalSupply()')) ^
   *   bytes4(keccak256('tokenOfOwnerByIndex(address,uint256)')) ^
   *   bytes4(keccak256('tokenByIndex(uint256)'))
   */

  bytes4 private constant InterfaceId_ERC721Metadata = 0x5b5e139f;
  /**
   * 0x5b5e139f ===
   *   bytes4(keccak256('name()')) ^
   *   bytes4(keccak256('symbol()')) ^
   *   bytes4(keccak256('tokenURI(uint256)'))
   */

  // Token name
  string internal name_;

  // Token symbol
  string internal symbol_;

  // Mapping from owner to list of owned token IDs
  mapping(address => uint256[]) internal ownedTokens;

  // Mapping from token ID to index of the owner tokens list
  mapping(uint256 => uint256) internal ownedTokensIndex;

  // Array with all token ids, used for enumeration
  uint256[] internal allTokens;

  // Mapping from token id to position in the allTokens array
  mapping(uint256 => uint256) internal allTokensIndex;

  // Optional mapping for token URIs
  mapping(uint256 => string) internal tokenURIs;

  /**
   * @dev Constructor function
   */
  constructor(string _name, string _symbol) public {
    name_ = _name;
    symbol_ = _symbol;

    // register the supported interfaces to conform to ERC721 via ERC165
    _registerInterface(InterfaceId_ERC721Enumerable);
    _registerInterface(InterfaceId_ERC721Metadata);
  }

  /**
   * @dev Gets the token name
   * @return string representing the token name
   */
  function name() external view returns (string) {
    return name_;
  }

  /**
   * @dev Gets the token symbol
   * @return string representing the token symbol
   */
  function symbol() external view returns (string) {
    return symbol_;
  }

  /**
   * @dev Returns an URI for a given token ID
   * Throws if the token ID does not exist. May return an empty string.
   * @param _tokenId uint256 ID of the token to query
   */
  function tokenURI(uint256 _tokenId) public view returns (string) {
    require(exists(_tokenId));
    return tokenURIs[_tokenId];
  }

  /**
   * @dev Gets the token ID at a given index of the tokens list of the requested owner
   * @param _owner address owning the tokens list to be accessed
   * @param _index uint256 representing the index to be accessed of the requested tokens list
   * @return uint256 token ID at the given index of the tokens list owned by the requested address
   */
  function tokenOfOwnerByIndex(
    address _owner,
    uint256 _index
  )
    public
    view
    returns (uint256)
  {
    require(_index < balanceOf(_owner));
    return ownedTokens[_owner][_index];
  }

  /**
   * @dev Gets the total amount of tokens stored by the contract
   * @return uint256 representing the total amount of tokens
   */
  function totalSupply() public view returns (uint256) {
    return allTokens.length;
  }

  /**
   * @dev Gets the token ID at a given index of all the tokens in this contract
   * Reverts if the index is greater or equal to the total number of tokens
   * @param _index uint256 representing the index to be accessed of the tokens list
   * @return uint256 token ID at the given index of the tokens list
   */
  function tokenByIndex(uint256 _index) public view returns (uint256) {
    require(_index < totalSupply());
    return allTokens[_index];
  }

  /**
   * @dev Internal function to set the token URI for a given token
   * Reverts if the token ID does not exist
   * @param _tokenId uint256 ID of the token to set its URI
   * @param _uri string URI to assign
   */
  function _setTokenURI(uint256 _tokenId, string _uri) internal {
    require(exists(_tokenId));
    tokenURIs[_tokenId] = _uri;
  }

  /**
   * @dev Internal function to add a token ID to the list of a given address
   * @param _to address representing the new owner of the given token ID
   * @param _tokenId uint256 ID of the token to be added to the tokens list of the given address
   */
  function addTokenTo(address _to, uint256 _tokenId) internal {
    super.addTokenTo(_to, _tokenId);
    uint256 length = ownedTokens[_to].length;
    ownedTokens[_to].push(_tokenId);
    ownedTokensIndex[_tokenId] = length;
  }

  /**
   * @dev Internal function to remove a token ID from the list of a given address
   * @param _from address representing the previous owner of the given token ID
   * @param _tokenId uint256 ID of the token to be removed from the tokens list of the given address
   */
  function removeTokenFrom(address _from, uint256 _tokenId) internal {
    super.removeTokenFrom(_from, _tokenId);

    uint256 tokenIndex = ownedTokensIndex[_tokenId];
    uint256 lastTokenIndex = ownedTokens[_from].length.sub(1);
    uint256 lastToken = ownedTokens[_from][lastTokenIndex];

    ownedTokens[_from][tokenIndex] = lastToken;
    ownedTokens[_from][lastTokenIndex] = 0;
    // Note that this will handle single-element arrays. In that case, both tokenIndex and lastTokenIndex are going to
    // be zero. Then we can make sure that we will remove _tokenId from the ownedTokens list since we are first swapping
    // the lastToken to the first position, and then dropping the element placed in the last position of the list

    ownedTokens[_from].length--;
    ownedTokensIndex[_tokenId] = 0;
    ownedTokensIndex[lastToken] = tokenIndex;
  }

  /**
   * @dev Internal function to mint a new token
   * Reverts if the given token ID already exists
   * @param _to address the beneficiary that will own the minted token
   * @param _tokenId uint256 ID of the token to be minted by the msg.sender
   */
  function _mint(address _to, uint256 _tokenId) internal {
    super._mint(_to, _tokenId);

    allTokensIndex[_tokenId] = allTokens.length;
    allTokens.push(_tokenId);
  }

  /**
   * @dev Internal function to burn a specific token
   * Reverts if the token does not exist
   * @param _owner owner of the token to burn
   * @param _tokenId uint256 ID of the token being burned by the msg.sender
   */
  function _burn(address _owner, uint256 _tokenId) internal {
    super._burn(_owner, _tokenId);

    // Clear metadata (if any)
    if (bytes(tokenURIs[_tokenId]).length != 0) {
      delete tokenURIs[_tokenId];
    }

    // Reorg all tokens array
    uint256 tokenIndex = allTokensIndex[_tokenId];
    uint256 lastTokenIndex = allTokens.length.sub(1);
    uint256 lastToken = allTokens[lastTokenIndex];

    allTokens[tokenIndex] = lastToken;
    allTokens[lastTokenIndex] = 0;

    allTokens.length--;
    allTokensIndex[_tokenId] = 0;
    allTokensIndex[lastToken] = tokenIndex;
  }

}

// File: contracts/World.sol

/**
* @title Block42 land token contract
* @author Richard Fu (richardf@block42.world)
* @dev Complant with OpenZeppelin's implementation of the ERC721 spec
*/

contract World is ERC721Token, Pausable {

  /**
  * @dev Constructor function
  */
  constructor() public
    ERC721Token("Block42 World", "B42WD")
  { }

  /**
   * @dev Don't accept payment directly to contract
   */
  function() public payable {
    revert();
  }

  /**
   * @dev Create a new world and assign to himself, contract owner only
   * @param _tokenId uint256 ID of the token
   */
  function create(uint256 _tokenId) public onlyOwner {
    createAndTransfer(msg.sender, _tokenId);
  }

  /**
   * @dev Create a new world and assign to someone, contract owner only
   * @param _tokenId uint256 ID of the token
   */
  function createAndTransfer(address _to, uint256 _tokenId) public onlyOwner {
    require(!exists(_tokenId));
    _mint(_to, _tokenId);
  }

  /** 
   * @dev Owner of contract can retake the ownership of a world, ONLY when world 
   * owner is extremely inactive or damaging the community
   * @param _tokenId uint256 ID of the token to expropriate
   */
  function expropriate(uint256 _tokenId) public onlyOwner {
    address owner = ownerOf(_tokenId);
    clearApproval(owner, _tokenId);
    removeTokenFrom(owner, _tokenId);
    addTokenTo(msg.sender, _tokenId);
    emit Transfer(owner, msg.sender, _tokenId);
  }

}

// File: contracts/Land.sol

/**
* @title Block42 land token contract
* @author Richard Fu (richardf@block42.world)
* @dev Complant with OpenZeppelin's implementation of the ERC721 spec.
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
    revert();
  }

  /**
   * @dev Throws if a position not within valid range.
   */
  modifier validPosition(uint32 _world, int64 _x, int64 _y) {
    require(isValidPosition(_world, _x, _y));
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
    require(msg.sender == worldContract_.ownerOf(_world) || msg.sender == owner || authorizedAddresses_[msg.sender]);
    _;
  }

  /**
   * @dev Authorizes a contract or a person the right to create a land token, contract owner or world creator only.
   */
  function authorize(address recipient) public onlyOwner {
    require(recipient != address(0) && recipient != owner);
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
    require(isValidPosition(_worldId, _x, _y));
  }

  /**
   * @dev Gets the owner of the specified position.
   */
  function ownerOf(uint32 _worldId, int64 _x, int64 _y) public view returns (address) {
    return ownerOf(encodeTokenId(_worldId, _x, _y));
  }

  /**
   * @dev Returns whether the specified land exists.
   */
  function exists(uint32 _worldId, int64 _x, int64 _y) public view returns (bool) {
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
  function create(uint32 _worldId, int64[] _xs, int64[] _ys) public onlyAuthorized(_worldId) {
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
    require(isApprovedOrOwner(msg.sender, tokenId));
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
  function tokenURI(uint32 _worldId, int64 _x, int64 _y) public view returns (string) {
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

// File: contracts/BidLand.sol

/**
* @title Block42 bid land token contract
* @author Richard Fu (richardf@block42.world)
* @dev Complant with OpenZeppelin's implementation of the ERC721 spec, add bid info on top of Land.
*/

contract BidLand is Land, BidLandBasic {

  mapping(uint256 => uint256) internal biddingPrice;
  mapping(uint256 => string) internal names;
  mapping(uint256 => string) internal descriptions;

  function setBidPrice(uint32 _worldId, int64 _x, int64 _y, uint256 _biddingPrice) public validPosition(_worldId, _x, _y) onlyAuthorized(_worldId) {
    uint256 tokenId = encodeTokenId(_worldId, _x, _y);
    biddingPrice[tokenId] = _biddingPrice;
  }

  function setInfo(uint32 _worldId, int64 _x, int64 _y, string _name, string _description) public validPosition(_worldId, _x, _y) {
    uint256 tokenId = encodeTokenId(_worldId, _x, _y);
    require(msg.sender == ownerOf(tokenId) || msg.sender == worldContract_.ownerOf(_worldId) || msg.sender == owner);
    descriptions[tokenId] = _name;
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
