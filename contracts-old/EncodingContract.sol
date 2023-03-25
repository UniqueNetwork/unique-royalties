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

    function decodeCrossAddress(bytes memory b) public pure returns (CrossAddress memory) {
        return abi.decode(b, (CrossAddress));
    }

    function encodeUniqueRoyaltyPart(string memory str) public pure returns (bytes memory) {
        UniqueRoyaltyPart memory royaltyPart = UniqueRoyaltyPartHelper.fromString(str);

        return abi.encode(royaltyPart);
    }

    function decodeUniqueRoyaltyPart(bytes memory b) public pure returns (UniqueRoyaltyPart memory) {
        return abi.decode(b, (UniqueRoyaltyPart));
    }

    function encodeUniqueRoyalty(string memory str) public pure returns (bytes memory) {
        UniqueRoyalty memory royalty = UniqueRoyaltyHelper.fromString(str);

        return abi.encode(royalty);
    }

    function decodeUniqueRoyalty(bytes memory b) public pure returns (UniqueRoyalty memory) {
        return abi.decode(b, (UniqueRoyalty));
    }
}
