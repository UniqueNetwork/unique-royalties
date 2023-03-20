// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;


library UniqueRoyaltyPartHelper {
    struct UniqueRoyalty {
        uint8 version;
        uint8 decimals;
        UniqueRoyaltyPart[] primary;
        UniqueRoyaltyPart[] secondary;
    }

    struct UniqueRoyaltyPart {
        uint16 value;
        address eth;
        uint256 sub;
    }

    function substring(string memory str, uint startIndex, uint endIndex) internal pure returns (string memory ) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }

    function deserialize(string memory str) internal pure returns (UniqueRoyaltyPart memory) {
        bytes memory b = bytes(str);

        if (b[0] == "e") {
            return UniqueRoyaltyPart({
                value: uint16(stringToUint(substring(str, 0, 2))),
                eth: str2ethereumAddress(substring(str, 2, 42)),
                sub: 0
            });
        }

        return UniqueRoyaltyPart({
            value: uint16(stringToUint(substring(str, 0, 2))),
            eth: address(0x0),
            sub: 0
        });
    }

    function serializeRaw (uint16 value, address eth, uint256 sub) internal pure returns (string memory) {
        if (eth != address(0x0)) {
            return string.concat("e-", ethereumAddress2str(eth), "-", uint2str(value));
        }

        return string.concat("s-", uint2str(sub), "-", uint2str(value));
    }

    function serialize(UniqueRoyaltyPart memory part) internal pure returns (string memory) {
        return serializeRaw(part.value, part.eth, part.sub);
    }

    function ethereumAddress2str(address eth) internal pure returns (string memory) {
        if (eth == address(0x0)) {
            return "0000000000000000000000000000000000000000";
        }

        bytes memory alphabet = "0123456789abcdef";

        bytes memory addressPacked = abi.encodePacked(eth);

        bytes memory strAddress = new bytes(addressPacked.length * 2);

        for (uint i = 0; i < addressPacked.length; i++) {
            strAddress[i*2] = alphabet[uint(uint8(addressPacked[i] >> 4))];
            strAddress[1+i*2] = alphabet[uint(uint8(addressPacked[i] & 0x0f))];
        }

        return string(strAddress);
    }

    function str2ethereumAddress(string memory _addressString) public pure returns (address) {
        return address(bytes20(bytes(_addressString)));
    }

    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }

        uint256 j = _i;
        uint256 length;

        while (j != 0) {
            length++;
            j /= 10;
        }

        bytes memory bytesStr = new bytes(length);

        uint256 k = length;

        j = _i;

        while (j != 0) {
            bytesStr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }

        str = string(bytesStr);
    }

    function stringToUint(string memory s) internal pure returns (uint) {
        bytes memory stringBytes = bytes(s);
        uint result = 0;
        for (uint i = 0; i < stringBytes.length; i++) {
            uint c = uint(uint8(stringBytes[i]));
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
        return result;
    }
}


contract Sample {
    function serializeEthereum(uint16 value, address ethereumAddress) public pure returns (string memory) {
        UniqueRoyaltyPartHelper.UniqueRoyaltyPart memory part = UniqueRoyaltyPartHelper.UniqueRoyaltyPart(value, ethereumAddress, 0);

        return UniqueRoyaltyPartHelper.serialize(part);
    }

    function serializeSubstrate(uint16 value, uint256 substrateAddress) public pure returns (string memory) {
        UniqueRoyaltyPartHelper.UniqueRoyaltyPart memory part = UniqueRoyaltyPartHelper.UniqueRoyaltyPart(value, address(0), substrateAddress);

        return UniqueRoyaltyPartHelper.serialize(part);
    }

    function testDeserialize(string memory str) public pure returns (uint16, address, uint256) {
        UniqueRoyaltyPartHelper.UniqueRoyaltyPart memory part = UniqueRoyaltyPartHelper.deserialize(str);

        return (part.value, part.eth, part.sub);
    }
}
