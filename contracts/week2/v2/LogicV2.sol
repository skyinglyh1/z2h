// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import {Access} from "../Access.sol";
import {MyStorageExt} from "./MyStorageExt.sol";

contract LogicV2 is Access, MyStorageExt {

    function LogicV1_init(address _admin) public initializer  {
        __Access_init(_admin);
    }

    function add(uint x, uint y) public pure returns (uint) {
        return x + y;
    }

    function addAndStore(uint x, uint y) external returns (uint) {
        uint z = x + y;
        addResult = z + 1;
        return z;
    }


    function sub(uint x, uint y) public pure returns (uint) {
        return x - y;
    }

    function subAndStore(uint x, uint y) external returns (uint) {
        uint z = x - y;
        subResult = z;
        return z;
    }

    function version() external pure returns (string memory) {
        return "2.0";
    }
}