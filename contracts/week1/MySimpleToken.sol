//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MySimpleToken is ERC20, Ownable {


    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        _mint(msg.sender, 1000 * 10 **18);
    }

    function mint(address to, uint256 inc) external onlyOwner {
        _mint(to, inc);
    }

    function burn(uint256 dec) external {
        _burn(msg.sender, dec);
    }


}