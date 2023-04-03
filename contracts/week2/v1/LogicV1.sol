// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import {Access} from "../Access.sol";
import {MyStorageExt} from "./MyStorageExt.sol";

contract LogicV1 is Access, MyStorageExt {

    function LogicV1_init(address _admin) public initializer  {
        __Access_init(_admin);
    }

    function add(uint x, uint y) public pure returns (uint) {
        return x + y;
    }

    function addAndStore(uint x, uint y) external returns (uint) {
        uint z = x + y;
        addResult = z;
        return z;
    }

    function version() external pure returns (string memory) {
        return "1.0";
    }
}