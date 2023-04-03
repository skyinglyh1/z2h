// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import {MyStorage} from "./MyStorage.sol";

abstract contract MyStorageExt is MyStorage {
    


	// !!! Add new variable MUST append it only, do not insert, update type & name, or change order !!!
	// https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#potentially-unsafe-operations


    uint256 public subResult;

    // For upgradable, add one new variable above, minus 1 at here
    uint[49] private __gap;
}
