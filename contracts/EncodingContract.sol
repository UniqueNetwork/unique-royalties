// SPDX-License-Identifier: MIT

pragma solidity >=0.8.18;

import "./BytesHelper.sol";
import "./CrossAddressHelper.sol";
import "./UniqueRoyaltyPartHelper.sol";
import "./UniqueRoyaltyHelper.sol";

contract EncodingContract {
    function encodeCrossAddress(string memory str) public pure returns (bytes memory) {
        CrossAddress memory crossAddress = CrossAddressHelper.fromString(str);

        return abi.encode(crossAddress);
    }

    function encodeUniqueRoyaltyPart(string memory str) public pure returns (bytes memory) {
        UniqueRoyaltyPart memory royaltyPart = UniqueRoyaltyPartHelper.fromString(str);

        return abi.encode(royaltyPart);
    }

    function encodeUniqueRoyalty(string memory str) public pure returns (bytes memory) {
        UniqueRoyalty memory royalty = UniqueRoyaltyHelper.fromString(str);

        return abi.encode(royalty);
    }
}
