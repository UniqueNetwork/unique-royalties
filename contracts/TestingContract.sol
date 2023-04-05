// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19;

import "./UniqueRoyalty.sol";

contract TestingContract {
    bytes constant SUB_PRIMARY_BYTES = hex"01000000000000000000000000000000000000000000010400000000000000ff2e61479a581f023808aaa5f2ec90be6c2b250102d99d788bde3c8d4153a0ed08";
    bytes constant ETH_SECONDARY_BYTES = hex"010000000000000000000000000000000000000000001006000000000000000f0000000000000000000000001234a38988dd5ecc93dd9ce90a44a00e5fb91e4c";
    bytes constant ROYALTY_BYTES = hex"01000000000000000000000000000000000000000000010400000000000000ff2e61479a581f023808aaa5f2ec90be6c2b250102d99d788bde3c8d4153a0ed08010000000000000000000000000000000000000000001006000000000000000f0000000000000000000000001234a38988dd5ecc93dd9ce90a44a00e5fb91e4c";
    bytes constant ROYALTY_BYTES2 = hex"0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000401000000000000000000000000000000000000000000010400000000000000ff2e61479a581f023808aaa5f2ec90be6c2b250102d99d788bde3c8d4153a0ed08010000000000000000000000000000000000000000001006000000000000000f0000000000000000000000001234a38988dd5ecc93dd9ce90a44a00e5fb91e4c";

    event DecodedPart(UniqueRoyaltyPart royaltyPart);
    event Decoded(UniqueRoyaltyPart[] royalty);

    event EncodedPart(bytes b);
    event Encoded(bytes b);

    // UniqueRoyaltyPart testing methods

    function decodePart(bytes memory b) public pure returns (UniqueRoyaltyPart memory) {
        uint256[2] memory encoded = abi.decode(b, (uint256[2]));

        return UniqueRoyalty.decodePart(encoded[0], encoded[1]);
    }

    function decodePartAndEmit(bytes memory b) public returns (UniqueRoyaltyPart memory) {
        uint256[2] memory encoded = abi.decode(b, (uint256[2]));

        UniqueRoyaltyPart memory royaltyPart = UniqueRoyalty.decodePart(encoded[0], encoded[1]);

        emit DecodedPart(royaltyPart);

        return royaltyPart;
    }

    function emitDummyPartDecoded() public {
        UniqueRoyaltyPart memory royaltyPart = UniqueRoyaltyPart({
            version: 1,
            decimals: 4,
            value: 255,
            isPrimarySaleOnly: true,
            crossAddress: CrossAddress({
                eth: address(0),
                sub: 20978269385216403909128489231801018566079057093140524795293939145867075317000
            })
        });

        emit DecodedPart(royaltyPart);
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

    function emitDummyPartEncoded() public {
        emit EncodedPart(SUB_PRIMARY_BYTES);
    }

    // UniqueRoyalty testing methods

    function decode(bytes memory b) public pure returns (UniqueRoyaltyPart[] memory) {
        return UniqueRoyalty.decode(b);
    }

    function decodeAndEmit(bytes memory b) public returns (UniqueRoyaltyPart[] memory) {
        UniqueRoyaltyPart[] memory royalty = UniqueRoyalty.decode(b);

        emit Decoded(royalty);

        return royalty;
    }

    function emitDummyDecoded() public {
        UniqueRoyaltyPart[] memory royalty = new UniqueRoyaltyPart[](2);

        royalty[0] = UniqueRoyaltyPart({
            version: 1,
            decimals: 4,
            value: 255,
            isPrimarySaleOnly: true,
            crossAddress: CrossAddress({
                eth: address(0),
                sub: 20978269385216403909128489231801018566079057093140524795293939145867075317000
            })
        });

        royalty[1] = UniqueRoyaltyPart({
            version: 1,
            decimals: 6,
            value: 15,
            isPrimarySaleOnly: false,
            crossAddress: CrossAddress({
                eth: address(0x1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C),
                sub: 0
            })
        });

        emit Decoded(royalty);
    }

    function encode(UniqueRoyaltyPart[] memory royalty) public pure returns (bytes memory) {
        return UniqueRoyalty.encode(royalty);
    }

    function encodeAndEmit(UniqueRoyaltyPart[] memory royalty) public returns (bytes memory) {
        bytes memory b = UniqueRoyalty.encode(royalty);

        emit Encoded(b);

        return b;
    }

    function emitDummyEncoded() public {
        emit Encoded(ROYALTY_BYTES);
    }
}
