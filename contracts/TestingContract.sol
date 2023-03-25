// SPDX-License-Identifier: MIT

pragma solidity >=0.8.18;

import "./UniqueRoyalty.sol";

contract TestingContract {
    event Decoded(UniqueRoyaltyPart royaltyPart);
    event Encoded(bytes b);

    function decodePart(bytes memory b) public pure returns (UniqueRoyaltyPart memory) {
        uint256[2] memory encoded = abi.decode(b, (uint256[2]));

        return UniqueRoyalty.decodePart(encoded[0], encoded[1]);
    }

    function decodePartAndEmit(bytes memory b) public returns (UniqueRoyaltyPart memory) {
        uint256[2] memory encoded = abi.decode(b, (uint256[2]));

        UniqueRoyaltyPart memory royaltyPart = UniqueRoyalty.decodePart(encoded[0], encoded[1]);

        emit Decoded(royaltyPart);

        return royaltyPart;
    }

    function emitDummyDecoded() public {
        UniqueRoyaltyPart memory royaltyPart = UniqueRoyaltyPart({
            version: 1,
            decimals: 2,
            value: 3,
            royaltyType: RoyaltyType.PRIMARY,
            crossAddress: CrossAddress({
                eth: address(0),
                sub: 0
            })
        });

        emit Decoded(royaltyPart);
    }

    function encodePart(UniqueRoyaltyPart memory royaltyPart) public pure returns (bytes memory) {
        (uint256 encodedMeta, uint256 encodedAddress) = UniqueRoyalty.encodePart(royaltyPart);

        return abi.encodePacked(encodedMeta, encodedAddress);
    }

    function encodePartAndEmit(UniqueRoyaltyPart memory royaltyPart) public returns (bytes memory) {
        (uint256 encodedMeta, uint256 encodedAddress) = UniqueRoyalty.encodePart(royaltyPart);

        bytes memory b = abi.encodePacked(encodedMeta, encodedAddress);

        emit Encoded(b);

        return b;
    }

    function emitDummyEncoded() public {
        bytes memory b = hex"01000000000000000000000000000000000000000000010400000000000000ff2e61479a581f023808aaa5f2ec90be6c2b250102d99d788bde3c8d4153a0ed08";

        emit Encoded(b);
    }
}
