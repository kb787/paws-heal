// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract PaymentGateway {
    address public owner;
    
    mapping(address => uint256) public balances;
    
    event PaymentReceived(address indexed from, uint256 amount);
    event WithdrawalMade(address indexed to, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    function deposit(address account) external payable {
        balances[account] += msg.value;
        emit PaymentReceived(account, msg.value);
    }
    
    function withdraw(address account, uint256 amount) external {
        require(balances[account] >= amount, "Insufficient balance");
        balances[account] -= amount;
        payable(account).transfer(amount);
        emit WithdrawalMade(account, amount);
    }
    
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
    
    function totalBalance() public view returns (uint256) {
        return address(this).balance;
    }
}


