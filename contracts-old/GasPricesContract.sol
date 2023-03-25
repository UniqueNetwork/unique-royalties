// SPDX-License-Identifier: MIT

pragma solidity >=0.8.18;

import "./BytesHelper.sol";
import "./CrossAddressHelper.sol";
import "./UniqueRoyaltyPartHelper.sol";
import "./UniqueRoyaltyHelper.sol";

contract GasPricesContract {
    event CrossAddressDecoded(CrossAddress crossAddress);
    event UniqueRoyaltyPartDecoded(UniqueRoyaltyPart royaltyPart);
    event UniqueRoyaltyDecoded(UniqueRoyalty royalty);

    function crossAddressFromString(string memory str) public {
        CrossAddress memory crossAddress = CrossAddressHelper.fromString(str);

        emit CrossAddressDecoded(crossAddress);
    }

    function crossAddressFromAbiEncoded(bytes memory b) public {
        CrossAddress memory crossAddress = abi.decode(b, (CrossAddress));

        emit CrossAddressDecoded(crossAddress);
    }

    function uniqueRoyaltyPartFromString(string memory str) public {
        UniqueRoyaltyPart memory royaltyPart = UniqueRoyaltyPartHelper.fromString(str);

        emit UniqueRoyaltyPartDecoded(royaltyPart);
    }

    function uniqueRoyaltyPartFromAbiEncoded(bytes memory b) public {
        UniqueRoyaltyPart memory royaltyPart = abi.decode(b, (UniqueRoyaltyPart));

        emit UniqueRoyaltyPartDecoded(royaltyPart);
    }

    function uniqueRoyaltyFromString(string memory str) public {
        UniqueRoyalty memory royalty = UniqueRoyaltyHelper.fromString(str);

        emit UniqueRoyaltyDecoded(royalty);
    }

    function uniqueRoyaltyFromAbiEncoded(bytes memory b) public {
        UniqueRoyalty memory royalty = abi.decode(b, (UniqueRoyalty));

        emit UniqueRoyaltyDecoded(royalty);
    }
}
