import { ContractReceipt, ContractTransaction } from "ethers";
import { ethers } from "hardhat";

// Require the hardhat-network-helpers library for convenient utility functions
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  // Declare the address of the "whale" account that will be adding liquidity to Uniswap
  const WHALE_ADDRESS = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

  // Get an impersonated signer for the "whale" account
  const WHALE = await ethers.getImpersonatedSigner(WHALE_ADDRESS);

  // Get the signer for the user account
  const [USER] = await ethers.getSigners();

  // Declare the addresses of the WETH and BUSD ERC20 tokens that will be added to Uniswap
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const BUSD = "0x4fabb145d64652a948d72533023f6e7a623c7c53";

  // Parse the amount of WETH and BUSD tokens to be added to Uniswap
  const WETH_AMOUNT = ethers.utils.parseEther("20");
  const BUSD_AMOUNT = ethers.utils.parseEther("23870");

  // Get the contract instances for the WETH and BUSD tokens
  const TOKEN_WETH = await ethers.getContractAt("IERC20", WETH);
  const TOKEN_BUSD = await ethers.getContractAt("IERC20", BUSD);

  // Send 20 ETH from the user account to the "whale" account
  await USER.sendTransaction({
    to: WHALE.address,
    value: ethers.utils.parseEther("20"),
  });

  // Get the contract factory for the UniswapLiquidity contract
  const UniswapLiquidity = await ethers.getContractFactory("UniswapLiquidity");

  // Deploy a new instance of the UniswapLiquidity contract
  const liquidityContract = await UniswapLiquidity.deploy();

  // Wait for the contract to be deployed before continuing
  await liquidityContract.deployed();

  // Log the address of the deployed liquidity contract
  console.log(`Liquidity Contract Address: ${liquidityContract.address}`);

  // Approve the transfer of BUSD and WETH tokens from the "whale" account to the liquidity contract

  //=== Approve BUSD ===//
  await TOKEN_BUSD.connect(WHALE).approve(
    liquidityContract.address,
    BUSD_AMOUNT
  );

  //=== Approve WETH ===//
  await TOKEN_WETH.connect(WHALE).approve(
    liquidityContract.address,
    WETH_AMOUNT
  );

  // Call the addLiquidity function on the liquidity contract to add the approved tokens
  const addLiquidity: ContractTransaction = await liquidityContract
    .connect(WHALE)
    .addLiquidity(WETH, BUSD, WETH_AMOUNT, BUSD_AMOUNT);

  // Wait for the transaction to be mined and get the receipt
  const receipt: ContractReceipt = await addLiquidity.wait();

  // Log all the events emitted by the transaction receipt
  for (const event of receipt.events!) {
    console.log(`Event ${event.event} with args ${event.args}`);
  }

  // Call the removeLiquidity function on the liquidity contract to remove our previously added tokens
  const removeLiquidity: ContractTransaction =
    await liquidityContract.removeLiquidity(WETH, BUSD);

  // Wait for the transaction to be mined and get the receipt
  const receipt2: ContractReceipt = await removeLiquidity.wait();

  // Log all the events emitted by the transaction receipt
  for (const event of receipt2.events!) {
    console.log(`Event ${event.event} with args ${event.args}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
