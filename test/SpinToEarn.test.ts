import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { parseEther } from "ethers";

describe("SpinToEarn", function () {
  async function deployContractsFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    // Deploy FireBomberToken contract
    const FireBomberToken = await ethers.getContractFactory("FireBomberToken");
    const token = await FireBomberToken.deploy();

    // Deploy SpinToEarn contract with FireBomberToken address
    const SpinToEarn = await ethers.getContractFactory("SpinToEarn");
    const spinToEarn = await SpinToEarn.deploy(token.getAddress());

    // Mint some tokens to user1 and user2 for testing
    await token.mint(user1.address, parseEther("100"));
    await token.mint(user2.address, parseEther("100"));

    return { token, spinToEarn, owner, user1, user2 };
  }

  it("Should allow users to buy tickets", async function () {
    const { token, spinToEarn, user1 } = await loadFixture(deployContractsFixture);

    const ticketPrice = parseEther("1");
    await token.connect(user1).approve(spinToEarn.getAddress(), ticketPrice);

    await expect(spinToEarn.connect(user1).buyTickets(ticketPrice))
      .to.emit(spinToEarn, "TicketsPurchased")
      .withArgs(user1.address, 1); // 1 ticket for 1 FBBT

    const userTickets = await spinToEarn.users(user1.address);
    expect(userTickets.tickets).to.equal(1);
  });

  it("Should allow owner to set points for users", async function () {
    const { spinToEarn, owner, user1, user2 } = await loadFixture(deployContractsFixture);

    const userAddresses = [user1.address, user2.address];
    const points = [150, 200];

    await expect(spinToEarn.connect(owner).setPoints(userAddresses, points))
      .to.emit(spinToEarn, "PointsAssigned")
      .withArgs(user1.address, 150);

    const user1Data = await spinToEarn.users(user1.address);
    const user2Data = await spinToEarn.users(user2.address);
    expect(user1Data.points).to.equal(150);
    expect(user2Data.points).to.equal(200);
  });

  it("Should allow users to withdraw rewards when they have enough points", async function () {
    const { token, spinToEarn, user1, owner } = await loadFixture(deployContractsFixture);

    // Set user points over the required minimum (e.g., 150 points)
    await spinToEarn.connect(owner).setPoints([user1.address], [150]);

    const user1BalanceBefore = await token.balanceOf(user1.address);
    
    await expect(spinToEarn.connect(user1).withdrawFunds())
      .to.emit(spinToEarn, "RewardClaimed")
      .withArgs(user1.address, 150, parseEther("1.5")); // 150 points -> 1.5 FBBT reward

    const user1BalanceAfter = await token.balanceOf(user1.address);
    console.log({user1BalanceAfter});
    expect(user1BalanceAfter - (user1BalanceBefore)).to.equal(parseEther("1.5"));

    const user1Data = await spinToEarn.users(user1.address);
    expect(user1Data.points).to.equal(0); // Points should reset to 0 after withdrawal
  });

  it("Should fail to withdraw rewards if points are less than 100", async function () {
    const { spinToEarn, user1, owner } = await loadFixture(deployContractsFixture);

    // Set user points less than 100 (e.g., 50 points)
    await spinToEarn.connect(owner).setPoints([user1.address], [50]);

    await expect(spinToEarn.connect(user1).withdrawFunds()).to.be.revertedWith(
      "You need at least 100 points to withdraw rewards"
    );
  });

  it("Should not allow non-owners to set points", async function () {
    const { spinToEarn, user1 } = await loadFixture(deployContractsFixture);

    const userAddresses = [user1.address];
    const points = [150];

    await expect(
      spinToEarn.connect(user1).setPoints(userAddresses, points)
    ).to.be.revertedWith("Only owner can perform this action");
  });
});
