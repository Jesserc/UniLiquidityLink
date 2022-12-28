// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./interface/IUniswapV2Factory.sol";
import "./interface/IUniswapV2Router01.sol";
import "./interface/IUniswapV2Router02.sol";
import "./interface/IERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract UniswapLiquidity {
    address UniswapV2Router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address UniswapV2Factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    event Logs(string message, uint256 value);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountA,
        uint amountB
    )
        external
        returns (uint256 amountOne, uint256 amountTwo, uint256 liquidity)
    {
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        IERC20(tokenA).approve(UniswapV2Router, amountA);
        IERC20(tokenB).approve(UniswapV2Router, amountB);

        (amountOne, amountTwo, liquidity) = IUniswapV2Router02(UniswapV2Router)
            .addLiquidity(
                tokenA,
                tokenB,
                amountA,
                amountB,
                1,
                1,
                address(this),
                block.timestamp
            );
    }
}
