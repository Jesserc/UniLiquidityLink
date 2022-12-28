import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const WETHHolder = "0x6B44ba0a126a2A1a8aa6cD1AdeeD002e141Bcd44";
  await helpers.impersonateAccount(WETHHolder);
  const WETHHolderSigner = await ethers.getSigner(WETHHolder);
  const DAIHolder = "0x2fEb1512183545f48f6b9C5b4EbfCaF49CfCa6F3";
  const DAIHolderSigner = await ethers.getSigner(DAIHolder);

  const DAIAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETHAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  const UniswapLiquidity = await ethers.getContractFactory("UniswapLiquidity");
  const uniswapLiquidity = await UniswapLiquidity.deploy();

  await uniswapLiquidity.deployed();

  console.log(`Contract deployed to ${uniswapLiquidity.address}`);

  const DAI = await ethers.getContractAt(
    "IERC20",
    DAIAddress,
    WETHHolderSigner
  );
  const WETH = await ethers.getContractAt(
    "IERC20",
    WETHAddress,
    WETHHolderSigner
  );

  DAI.transfer(WETHHolderSigner.address, "10000000000000000000");

  await WETH.connect(WETHHolderSigner).approve(
    uniswapLiquidity.address,
    "10000000000000000000000000000"
  );
  await DAI.connect(WETHHolderSigner).approve(
    uniswapLiquidity.address,
    "10000000000000000000000000000"
  );

  const addLiquidity = await uniswapLiquidity
    .connect(WETHHolderSigner)
    .addLiquidity(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      11931.2,
      10
    );

  addLiquidity.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
