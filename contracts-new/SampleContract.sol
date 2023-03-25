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

contract SampleContract {
    uint private constant DECIMALS_OFFSET = 4 * 16;
    uint private constant ADDRESS_TYPE_OFFSET = 4 * (16 + 2);
    uint private constant ROYALTY_TYPE_OFFSET = 4 * (16 + 2 + 1);
    uint private constant VERSION_OFFSET = 4 * (16 + 2 + 1 + 1 + 42);

    event RoyaltyPartDecoded(UniqueRoyaltyPart royaltyPart);
    event RoyaltyPartEncoded(bytes b);

    function decodeRoyaltyPart(bytes memory b) public pure returns (UniqueRoyaltyPart memory) {
        uint256[2] memory encoded = abi.decode(b, (uint256[2]));

        uint256 version = encoded[0] >> VERSION_OFFSET;
        uint256 royaltyType = encoded[0] & (1 << ROYALTY_TYPE_OFFSET);
        uint256 addressType = encoded[0] & (1 << ADDRESS_TYPE_OFFSET);
        uint256 decimals = (encoded[0] >> 4 * 16) & 0xFF;
        uint256 value = encoded[0] & 0xFFFFFFFFFFFFFFFF;

        CrossAddress memory crossAddress = addressType > 0
        ? CrossAddress({ sub: encoded[1], eth: address(0) })
        : CrossAddress({ sub: 0, eth: address(uint160(encoded[1])) });

        UniqueRoyaltyPart memory royaltyPart = UniqueRoyaltyPart({
            version: uint8(version),
            decimals: uint8(decimals),
            value: uint64(value),
            royaltyType: royaltyType > 0 ? RoyaltyType.SECONDARY : RoyaltyType.PRIMARY,
            crossAddress: crossAddress
        });

        return royaltyPart;
    }

    function emitSomeShit(bytes memory b) public {
        emit RoyaltyPartEncoded(b);
    }

    function encodeRoyaltyPart(UniqueRoyaltyPart memory royaltyPart) public pure returns (bytes memory) {
        uint256 encodedMeta = 0;
        uint256 encodedAddress = 0;

        encodedMeta |= uint256(royaltyPart.version) << 4 * 60;
        encodedMeta |= uint256(royaltyPart.royaltyType == RoyaltyType.PRIMARY ? 0 : 1) << 4 * 59;
        encodedMeta |= uint256(royaltyPart.crossAddress.eth != address(0x0) ? 0 : 1) << 4 * 58;
        encodedMeta |= uint256(royaltyPart.decimals) << 4 * 56;
        encodedMeta |= uint256(royaltyPart.value);

        encodedAddress |= uint256(royaltyPart.crossAddress.eth == address(0x0) ? royaltyPart.crossAddress.sub : uint160(royaltyPart.crossAddress.eth));

        return abi.encode(encodedMeta, encodedAddress);
    }
}
