// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.6.0;

/**
 * @title Interface for RAI https://reflexer.finance/ Oracle.
 * @dev This only contains the methods/events that we use in our contracts or offchain infrastructure.
 */
abstract contract RaiInterface {
    // Return redemption price in RAY (number with 27 decimals).
    function redemptionPrice() external view virtual returns (uint256);

    // Return redemption rate in RAY (number with 27 decimals). Negative numbers are wrapped around the maximal value.
    function redemptionRate() external view virtual returns (uint256);
}
