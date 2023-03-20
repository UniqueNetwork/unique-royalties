// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import { CrossAddress } from "@unique-nft/solidity-interfaces/contracts/UniqueNFT.sol";

import "./CrossAddressHelper.sol";

library UniqueRoyaltyHelper {
    struct UniqueRoyaltyPart {
        CrossAddress crossAddress;
        uint16 value;
    }

    struct UniqueRoyalty {
        uint8 version;
        uint8 decimals;
        UniqueRoyaltyPart[] primary;
        UniqueRoyaltyPart[] secondary;
    }

    function deserialize(string memory royaltyString) internal pure returns (UniqueRoyalty memory) {
        UniqueRoyalty memory royalty = UniqueRoyalty({
            version: 1,
            decimals: 1,
            primary: new UniqueRoyaltyPart[](0),
            secondary: new UniqueRoyaltyPart[](0)
        });

        return royalty;
    }
}


contract Sample {
    function testDeserialize(string memory str) public pure returns (UniqueRoyaltyHelper.UniqueRoyalty memory) {
        return UniqueRoyaltyHelper.deserialize(str);
    }

    function test(string memory str) public pure returns (uint) {
        return bytes(str).length;
    }

    function testCrossAddress(string memory str) public pure returns (CrossAddress memory) {
        return CrossAddressHelper.fromString(str);
    }
}
