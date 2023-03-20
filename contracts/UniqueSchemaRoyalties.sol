// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

struct UniqueRoyaltyPart {
    address eth;
    uint256 sub;

    uint16 value;
}

struct UniqueRoyalty {
    uint8 version;
    uint8 decimals;
    UniqueRoyaltyPart[] primary;
    UniqueRoyaltyPart[] secondary;
}

pragma solidity ^0.8.0;

library UniqueRoyaltyPartSerializer {
    function serialize(UniqueRoyaltyPart memory royaltyPart, bool isEth) internal pure returns (string memory) {
        bytes memory ethBytes = abi.encodePacked(royaltyPart.eth);
        bytes memory subBytes = abi.encodePacked(royaltyPart.sub);
        bytes memory valueBytes = abi.encodePacked(royaltyPart.value);

        bytes memory serialized = new bytes(2 + ethBytes.length + subBytes.length + valueBytes.length);
        uint256 index = 0;
        if (isEth) {
            serialized[index++] = bytes1('e');
            serialized[index++] = bytes1('t');
            serialized[index++] = bytes1('h');
        } else {
            serialized[index++] = bytes1('s');
            serialized[index++] = bytes1('u');
            serialized[index++] = bytes1('b');
        }
        serialized[index++] = bytes1('-');

        for (uint256 i = 0; i < ethBytes.length; i++) {
            serialized[index++] = ethBytes[i];
        }
        serialized[index++] = bytes1('-');

        for (uint256 i = 0; i < valueBytes.length; i++) {
            serialized[index++] = valueBytes[i];
        }

        return string(serialized);
    }

    function deserialize(string memory royaltyPartString) internal pure returns (UniqueRoyaltyPart memory) {
        bytes memory serialized = bytes(royaltyPartString);
        uint256 index = 4; // skipping the prefix and dash

        bool isEth = (serialized[0] == 'e' && serialized[1] == 't' && serialized[2] == 'h');

        bytes20 ethBytes;
        bytes20 subBytes;
        uint16 value;

        for (uint256 i = 0; i < 20; i++) {
            ethBytes |= bytes20(serialized[index++]) >> (i * 8);
        }
        index++; // skipping the dash

        for (uint256 i = 0; i < 20; i++) {
            subBytes |= bytes20(serialized[index++]) >> (i * 8);
        }
        index++; // skipping the dash

        for (uint256 i = 0; i < 2; i++) {
            value |= uint16(serialized[index++]) << (i * 8);
        }

        return UniqueRoyaltyPart(address(ethBytes), address(subBytes), value);
    }
}

library UniqueSchemaRoyalties {
    string public royaltyString = '';

    constructor (string memory initialRoyaltyString) {
        royaltyString = initialRoyaltyString;
    }

    function store(string memory newRoyaltyString) public {
        royaltyString = newRoyaltyString;
    }

    function retrieve() public view returns (string memory) {
        return (royaltyString );
    }
}
