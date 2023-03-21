// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import { CrossAddress } from "@unique-nft/solidity-interfaces/contracts/UniqueNFT.sol";

import "./CrossAddressHelper.sol";
import "./BytesHelper.sol";

library UniqueRoyaltyPartHelper {
    event Loggg(string message);

    struct UniqueRoyaltyPart {
        CrossAddress crossAddress;
        uint16 value;
    }

    function fromString(string memory royaltyPartString) internal pure returns (UniqueRoyaltyPart memory) {
        bytes memory b = bytes(royaltyPartString);

        return fromBytes(b);
    }

    function fromBytes(bytes memory royaltyPartBytes) internal pure returns (UniqueRoyaltyPart memory) {
        if (royaltyPartBytes[0] == "e") {
            bytes memory addressBytes = BytesHelper.slice(royaltyPartBytes, 2, 42);
            bytes memory valueBytes = BytesHelper.slice(royaltyPartBytes, 43);

            return UniqueRoyaltyPart({
                crossAddress: CrossAddressHelper.fromBytes(addressBytes),
                value: uint16(BytesHelper.bytesToUint(valueBytes))
            });
        } else if (royaltyPartBytes[0] == "s") {
            bytes memory addressBytes = BytesHelper.slice(royaltyPartBytes, 2, 66);
            bytes memory valueBytes = BytesHelper.slice(royaltyPartBytes, 67);

            return UniqueRoyaltyPart({
                crossAddress: CrossAddressHelper.fromBytes(addressBytes),
                value: uint16(BytesHelper.bytesToUint(valueBytes))
            });
        }

        revert("Unknown address type; expected e (ethereum) or s (substrate)");
    }
}
