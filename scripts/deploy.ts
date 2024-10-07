import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const tokenAddress = "0x4DD2EC07a49BE2Bb2Ee9A63df867EEf513bB73bD";

  console.log("Deploying contracts with the account:", deployer.address);

  const SpinToEarn = await ethers.getContractFactory("SpinToEarn");
  const election = await SpinToEarn.deploy(tokenAddress);

  console.log("SpinToEarn deployed to:", election.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
