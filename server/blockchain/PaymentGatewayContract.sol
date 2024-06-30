// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentGateway {
    address public owner; // Owner of the contract
    mapping(address => uint256) public balances; // User balances

    event PaymentReceived(address indexed from, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        emit PaymentReceived(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}
