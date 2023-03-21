// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import { CrossAddress } from "@unique-nft/solidity-interfaces/contracts/UniqueNFT.sol";

import "./UniqueRoyaltyPartHelper.sol";
import "./CrossAddressHelper.sol";
import "./BytesHelper.sol";

struct UniqueRoyalty {
    uint16 version;
    uint8 decimals;
    UniqueRoyaltyPart[] primary;
    UniqueRoyaltyPart[] secondary;
}

library UniqueRoyaltyHelper {
    function fromString(string memory royaltyString) internal pure returns (UniqueRoyalty memory) {
        bytes memory b = bytes(royaltyString);

        return fromBytes(b);
    }

    function fromBytes(bytes memory royaltyBytes) internal pure returns (UniqueRoyalty memory) {
        uint index = 0;

        uint16 version = 0;
        uint8 decimals = 4;

        while (index <= royaltyBytes.length) {
            if (royaltyBytes[index] == "v") {
                version = uint16(BytesHelper.bytesToUint(BytesHelper.slice(royaltyBytes, index + 2, index + 6)));

                require(version == 1, "Unknown version; expected v:0001");

                index += 7;
            } else if (royaltyBytes[index] == "d") {
                decimals = uint8(BytesHelper.bytesToUint(BytesHelper.slice(royaltyBytes, index + 2, index + 4)));

                index += 5;
            } else {
                revert("Unknown field; expected 'v' (version), 'd' (decimals), 'P' (primary) or 'S' (secondary)");
            }
        }

        return UniqueRoyalty(
            version,
            decimals,
            new UniqueRoyaltyPart[](0),
            new UniqueRoyaltyPart[](0)
        );
    }
}
