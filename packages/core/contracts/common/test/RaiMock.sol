// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.6.0;

import "../interfaces/RaiInterface.sol";

/**
 * @title Mock for RAI oracle.
 */
contract RaiMock is RaiInterface {
    uint256 private _redemptionPrice = 0;
    uint256 private _redemptionRate = 0;

    function redemptionPrice() external view override returns (uint256) {
        return _redemptionPrice;
    }

    function redemptionRate() external view override returns (uint256) {
        return _redemptionRate;
    }

    function setRedemptionPriceAndRate(uint256 price, uint256 rate) external {
        _redemptionPrice = price;
        _redemptionRate = rate;
    }
}
