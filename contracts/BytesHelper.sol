// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

library BytesHelper {
    function stringToUint(string memory s) internal pure returns (uint) {
        bytes memory b = bytes(s);

        return bytesToUint(b);
    }

    function bytesToUint(bytes memory b) internal pure returns (uint) {
        uint i;
        uint result = 0;
        for (i = 0; i < b.length; i++) {
            uint c = uint8(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }

        return result;
    }


    function slice(bytes memory input, uint startIndex, uint length) internal pure returns (bytes memory) {
        bytes memory b = new bytes(length);

        require(startIndex + length <= input.length, "Slice out of bounds");

        for (uint i = 0; i < length; i++) {
            b[i] = input[i + startIndex];
        }

        return b;
    }
}
















