(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports=[
    {
        "tokenId": "0000000000000000000000000000000000000000000000000000000000000000",
        "x": 0,
        "y": 0,
        "owner": "0x3ae7e2f63991808dedc04b2d25a5c88f874a17ad",
        "name": "Block+42",
        "description": "Block+42"
    },
    {
        "tokenId": "00000000ffffffffffffffffffffffffffff0000000000000000000000000000",
        "x": -1,
        "y": 0,
        "owner": "0x3ae7e2f63991808dedc04b2d25a5c88f874a17ad",
        "name": "SweatyChair",
        "description": "SweatyChair"
    },
    {
        "tokenId": "0000000000000000000000000000000000010000000000000000000000000000",
        "x": 1,
        "y": 0,
        "owner": "0x3ae7e2f63991808dedc04b2d25a5c88f874a17ad",
        "name": "Shibuya",
        "description": "Shibuya"
    },
    {
        "tokenId": "0000000000000000000000000000000000000000000000000000000000000001",
        "x": 0,
        "y": -1,
        "owner": "0x3ae7e2f63991808dedc04b2d25a5c88f874a17ad",
        "name": "city+ugly",
        "description": "city+ugly"
    },
    {
        "tokenId": "000000000000000000000000000000000000ffffffffffffffffffffffffffff",
        "x": 0,
        "y": 1,
        "owner": "0x3ae7e2f63991808dedc04b2d25a5c88f874a17ad",
        "name": "city+ugly",
        "description": "city+ugly"
    }
]
},{}],2:[function(require,module,exports){
// TODO: Get info of lands from local JSON, this will be replaced by blockchain getLands() later
var landsJson = require('./Lands-auto-generated.json')
Land.init(landsJson)

},{"./Lands-auto-generated.json":1}]},{},[2]);
