pragma solidity ^0.5.0;

/**
 * @title Financial contract facing Oracle interface.
 * @dev Interface used by financial contracts to interact with the Oracle. Voters will use a different interface.
 */
interface OracleInterface {
    /**
     * @notice Enqueues a request (if a request isn't already present) for the given `identifier`, `time` pair.
     */
    function requestPrice(bytes32 identifier, uint time) external;

    /**
     * @notice Whether the price for `identifier` and `time` is available.
     */
    function hasPrice(bytes32 identifier, uint time) external view returns (bool);

    /**
     * @notice Gets the price for `identifier` and `time` if it has already been requested and resolved.
     * @dev If the price is not available, the method reverts.
     */
    function getPrice(bytes32 identifier, uint time) external view returns (int price);
}