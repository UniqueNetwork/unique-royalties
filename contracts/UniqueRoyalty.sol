// SPDX-License-Identifier: MIT

pragma solidity >=0.8.18;

struct CrossAddress {
    address eth;
    uint256 sub;
}

enum RoyaltyType{
    PRIMARY,        /* 0 */
    SECONDARY       /* 1 */
}

enum AddressType{
    ETH,            /* 0 */
    SUB             /* 1 */
}

struct UniqueRoyaltyPart {
    uint8 version;
    uint8 decimals;
    uint64 value;
    RoyaltyType royaltyType;
    CrossAddress crossAddress;
}

library UniqueRoyalty {
    uint private constant DECIMALS_OFFSET = 4 * 16;
    uint private constant ADDRESS_TYPE_OFFSET = 4 * (16 + 2);
    uint private constant ROYALTY_TYPE_OFFSET = 4 * (16 + 2 + 1);
    uint private constant VERSION_OFFSET = 4 * (16 + 2 + 1 + 1 + 42);

    function decode(bytes memory b) internal pure returns (UniqueRoyaltyPart[] memory) {
        if (b.length == 0) return new UniqueRoyaltyPart[](0);

        require(b.length % (64 * 2) == 0, "Invalid bytes length, expected (64 * 2) * UniqueRoyaltyParts count");
        uint partsCount = b.length / (64 * 2);

        UniqueRoyaltyPart[] memory parts = new UniqueRoyaltyPart[](partsCount);

        uint256[] memory encoded = abi.decode(b, (uint256[]));

        for (uint i = 0; i < partsCount; i++) {
            parts[i] = decodePart(encoded[i * 2], encoded[i * 2 + 1]);
        }

        return parts;
    }

    function encode(UniqueRoyaltyPart[] memory parts) internal pure returns (bytes memory) {
        if (parts.length == 0) return "";

        uint256[] memory encoded = new uint256[](parts.length * 2);

        for (uint i = 0; i < parts.length; i++) {
            (uint256 encodedMeta, uint256 encodedAddress) = encodePart(parts[i]);

            encoded[i * 2] = encodedMeta;
            encoded[i * 2 + 1] = encodedAddress;
        }

        return abi.encode(encoded);
    }

    function decodePart(
        uint256 _meta,
        uint256 _address
    ) internal pure returns (UniqueRoyaltyPart memory) {
        uint256 version = _meta >> VERSION_OFFSET;
        uint256 royaltyType = _meta & (1 << ROYALTY_TYPE_OFFSET);
        uint256 addressType = _meta & (1 << ADDRESS_TYPE_OFFSET);
        uint256 decimals = (_meta >> 4 * 16) & 0xFF;
        uint256 value = _meta & 0xFFFFFFFFFFFFFFFF;

        CrossAddress memory crossAddress = addressType > 0
            ? CrossAddress({ sub: _address, eth: address(0) })
            : CrossAddress({ sub: 0, eth: address(uint160(_address)) });

        UniqueRoyaltyPart memory royaltyPart = UniqueRoyaltyPart({
            version: uint8(version),
            decimals: uint8(decimals),
            value: uint64(value),
            royaltyType: royaltyType > 0 ? RoyaltyType.SECONDARY : RoyaltyType.PRIMARY,
            crossAddress: crossAddress
        });

        return royaltyPart;
    }

    function encodePart(UniqueRoyaltyPart memory royaltyPart) internal pure returns (uint256, uint256) {
        uint256 encodedMeta = 0;
        uint256 encodedAddress = 0;

        encodedMeta |= uint256(royaltyPart.version) << VERSION_OFFSET;
        encodedMeta |= uint256(royaltyPart.royaltyType == RoyaltyType.PRIMARY ? 0 : 1) << ROYALTY_TYPE_OFFSET;
        encodedMeta |= uint256(royaltyPart.crossAddress.eth != address(0x0) ? 0 : 1) << ADDRESS_TYPE_OFFSET;
        encodedMeta |= uint256(royaltyPart.decimals) << DECIMALS_OFFSET;
        encodedMeta |= uint256(royaltyPart.value);

        encodedAddress |= uint256(royaltyPart.crossAddress.eth == address(0x0)
            ? royaltyPart.crossAddress.sub
            : uint160(royaltyPart.crossAddress.eth));

        return (encodedMeta, encodedAddress);
    }
}