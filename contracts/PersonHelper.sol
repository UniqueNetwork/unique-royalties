// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

library PersonSerialization {

    struct Person {
        string name;
        uint age;
    }

    function serialize(Person memory person) internal pure returns (string memory) {
        return string(abi.encodePacked(person.name, ",", uintToString(person.age)));
    }

    function deserialize(string memory input) internal pure returns (Person memory) {
        bytes memory data = bytes(input);
        uint commaIndex = indexOf(data, ",");
        require(commaIndex != data.length - 1, "Invalid input");

        string memory name = string(subBytes(data, 0, commaIndex - 1));
        uint age = stringToUint(string(subBytes(data, commaIndex + 1, data.length - 1)));

        return Person(name, age);
    }

    function indexOf(bytes memory haystack, string memory needle) internal pure returns (uint) {
        bytes memory needleBytes = bytes(needle);
        uint needleLength = needleBytes.length;
        for (uint i = 0; i < haystack.length - needleLength; i++) {
            if (matches(haystack, needleBytes, i)) {
                return i;
            }
        }
        // todo - throw error?
        return uint(0);
    }

    function matches(bytes memory haystack, bytes memory needle, uint offset) internal pure returns (bool) {
        for (uint i = 0; i < needle.length; i++) {
            if (haystack[offset + i] != needle[i]) {
                return false;
            }
        }
        return true;
    }

    function subBytes(bytes memory input, uint startIndex, uint endIndex) internal pure returns (bytes memory) {
        require(endIndex >= startIndex, "Invalid input");
        bytes memory result = new bytes(endIndex - startIndex + 1);
        for (uint i = startIndex; i <= endIndex; i++) {
            result[i - startIndex] = input[i];
        }
        return result;
    }

    function stringToUint(string memory input) internal pure returns (uint) {
        bytes memory data = bytes(input);
        uint result = 0;
        for (uint i = 0; i < data.length; i++) {
            uint digit = uint8(data[i]) - 48;
            require(digit <= 9, "Invalid input");
            result = result * 10 + digit;
        }
        return result;
    }

    function uintToString(uint input) internal pure returns (string memory) {
        if (input == 0) {
            return "0";
        }
        uint temp = input;
        uint digits;
        while (temp > 0) {
            digits++;
            temp /= 10;
        }
        bytes memory result = new bytes(digits);
        temp = input;
        while (temp > 0) {
            result[--digits] = bytes1(uint8(48 + temp % 10));
            temp /= 10;
        }
        return string(result);
    }
}
