// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./interface/IUniswapV2Factory.sol";
import "./interface/IUniswapV2Router02.sol";
import "./interface/IERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract UniswapLiquidity {
    address UniswapV2Router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address UniswapV2Factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    event Logs(string message, uint value);

    //add liquidity to uniswap pool
    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint _amountA,
        uint _amountB
    ) external {
        require(
            IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA)
        );

        require(
            IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB)
        );

        require(IERC20(_tokenA).approve(UniswapV2Router, _amountA));
        require(IERC20(_tokenB).approve(UniswapV2Router, _amountB));

        (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        ) = IUniswapV2Router02(UniswapV2Router).addLiquidity(
                _tokenA,
                _tokenB,
                _amountA,
                _amountB,
                1,
                1,
                address(this),
                block.timestamp + 20 seconds
            );

        emit Logs("amount A taken", amountA);
        emit Logs("amount B taken", amountB);
        emit Logs("Liquidity token received", liquidity);
    }

    //remove our liquidity added before
    function removeLiquidity(
        address _tokenA,
        address _tokenB
    ) external returns (address pair) {
        //get pair address
        pair = IUniswapV2Factory(UniswapV2Factory).getPair(_tokenA, _tokenB);
        uint liquidity = IERC20(pair).balanceOf(address(this));

        //approve router to remove our liquidity token
        require(IERC20(pair).approve(UniswapV2Router, liquidity));

        (uint amountA, uint amountB) = IUniswapV2Router02(UniswapV2Router)
            .removeLiquidity(
                _tokenA,
                _tokenB,
                liquidity,
                1,
                1,
                address(this),
                block.timestamp + 20 seconds
            );

        emit Logs("amount A gotten", amountA);
        emit Logs("amount B gotten", amountB);
        emit Logs("Liquidity token burnt", liquidity);
    }
}
