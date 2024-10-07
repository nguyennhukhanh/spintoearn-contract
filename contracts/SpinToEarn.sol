// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function decimals() external view returns (uint8);
}

contract SpinToEarn {
    uint256 public ticketPrice = 1 * 10 ** 18; // 1 FireBomberToken
    struct User {
        uint256 points;
        uint256 tickets;
    }
    mapping(address => User) public users;
    address public owner;
    IERC20 public token;

    event TicketsPurchased(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 points, uint256 reward);
    event PointsAssigned(address indexed user, uint256 points);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token); // Set FireBomberToken as the token used
    }

    function setPoints(
        address[] calldata userAddresses,
        uint256[] calldata points
    ) external onlyOwner {
        require(
            userAddresses.length == points.length,
            "Users and points array must have the same length"
        );
        for (uint256 i = 0; i < userAddresses.length; i++) {
            users[userAddresses[i]].points = points[i];
            emit PointsAssigned(userAddresses[i], points[i]);
        }
    }

    function buyTickets(uint256 amount) external {
        require(
            amount >= ticketPrice,
            "Insufficient token amount to buy tickets"
        );
        token.transferFrom(msg.sender, address(this), amount); // Transfer FireBomberToken from user
        uint256 tickets = amount / ticketPrice;
        users[msg.sender].tickets += tickets;
        emit TicketsPurchased(msg.sender, tickets);
    }

    function withdrawFunds() external {
        uint256 points = users[msg.sender].points;
        require(
            points >= 100,
            "You need at least 100 points to withdraw rewards"
        );
        uint8 decimals = token.decimals();
        uint256 reward = (points * (10 ** decimals)) / 100; // 1 point = 0.01 FireBomberToken
        require(reward > 0, "Reward is too small");
        users[msg.sender].points = 0;
        token.transfer(msg.sender, reward); // Transfer FireBomberToken as reward
        emit RewardClaimed(msg.sender, points, reward);
    }

    function getPoints() external view returns (uint256) {
        return users[msg.sender].points;
    }
}