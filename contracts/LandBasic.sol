pragma solidity ^0.4.24;


/**
 * @title Land interface
 */
contract LandBasic {
  function createAndTransfer(address _to, uint32 _world, int64 _x, int64 _y) public;
  event Create(uint32 indexed _world, int64 indexed _x, int64 indexed _y);
}