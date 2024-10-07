// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/Pausable.sol';

contract FireBomberToken is ERC20, Ownable, Pausable {
    constructor() ERC20('FireBomberToken', 'FBBT') {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        return super.transfer(recipient, amount);
    }

    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        return super.approve(spender, amount);
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }

    function allowance(
        address owner,
        address spender
    ) public view override returns (uint256) {
        return super.allowance(owner, spender);
    }

    function totalSupply() public view override returns (uint256) {
        return super.totalSupply();
    }

    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }
}
