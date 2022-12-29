# Uniswap Liquidity Contract

This project is a Solidity contract that allows a user to add or remove liquidity to a pool on the Uniswap decentralized exchange. It uses the Hardhat framework and the Ethers.js library for deployment and interaction with the Ethereum network. Note that this project runs on a mainnet fork, but can be tweaked for deployment use cases.

## Prerequisites

- Node.js and npm
- Hardhat
- dotenv

## Setting up the project

1. Clone the repository and navigate to the project directory:

```shell
git clone https://github.com/Jesserc/UniswapV2-Liquidity-Pools.git
cd UniswapV2-Liquidity-Pools
```

2. Install the dependencies:

```shell
npm install
```

3. Create a file named `.env` in the root of the project and add the following environment variables:

```.env
URL="YOUR_INFURA_OR_ALCHEMY_API_URL_WITH_KEY"
```

## Interacting with the Contract

To interact with this contract on a mainnet fork, you can use the UniswapLiquidity contract instance located in the `deploy.ts` file within the `scripts` folder. To do so, set up your `.env` file and then start a local hardhat node by running:

```shell
npx hardhat node
```

Then, execute the following command to run the deploy.ts script:

```shell
npx hardhat run scripts/deploy.ts
```
