# Spin-to-Earn

## Introduction

Spin-to-Earn is a blockchain project that uses Hardhat for compiling, deploying, and testing smart contracts. This project allows users to participate in earning activities through spinning.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nguyennhukhanh/spin-to-earn
   cd spin-to-earn
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and add the necessary environment variables:
   ```plaintext
   BSC_TESTNET_URL=https://data-seed-prebsc-1-s1.binance.org:8545
   PRIVATE_KEY=
   BSC_API_KEY=
   ```

## Scripts

- **Compile**: Compile the smart contracts.

  ```bash
  npm run compile
  ```

- **Node**: Start a local blockchain network.

  ```bash
  npm run node
  ```

- **Deploy**: Deploy the smart contracts to the blockchain network.

  ```bash
  npm run deploy
  ```

- **Verify**: Verify the contract on the BSC Testnet.

  ```bash
  npm run verify
  ```

- **Test**: Run tests for the smart contracts.

  ```bash
  npm run test
  ```

- **Coverage**: Check the test coverage.

  ```bash
  npm run coverage
  ```

- **Console**: Interact with the deployed smart contracts.

  ```bash
  npm run console
  ```

- **Help**: View other commands and help.
  ```bash
  npm run help
  ```

## Dependencies

- **@nomicfoundation/hardhat-toolbox**: ^5.0.0
- **hardhat**: ^2.22.11
- **ethers**: ^6.13.2
- **dotenv**: ^16.4.5

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- **@nguyennhukhanh**
