// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;


abstract contract MyStorage {
	// !!! Add new variable MUST append it only, do not insert, update type & name, or change order !!!
	// https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#potentially-unsafe-operations

    uint public constant const1 = 1;

    uint256 public addResult;


	// !!! Never add new variable at here, because this contract is inherited by MyStorage !!!
	// !!! Add new variable at MyStorage directly !!!
} 