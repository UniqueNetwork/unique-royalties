// SPDX-License-Identifier: MIT

pragma solidity >=0.8.18;

import "./BytesHelper.sol";
import "./CrossAddressHelper.sol";
import "./UniqueRoyaltyPartHelper.sol";
import "./UniqueRoyaltyHelper.sol";

contract SampleContract {
    event TestEvent(string str);
    event TestEvent2(UniqueRoyalty royalty);
    event TestEvent3(bytes royaltyBytes);

    UniqueRoyalty uniqueRoyalty;

    uint public value;

    function testGas(string memory str) public {
        UniqueRoyalty memory royalty = UniqueRoyaltyHelper.fromString(str);

        emit TestEvent(str);
        emit TestEvent2(royalty);
        emit TestEvent3(abi.encode(royalty));
    }

    function testUniqueRoyaltyHelper(string memory str) public pure returns (UniqueRoyalty memory) {
        return UniqueRoyaltyHelper.fromString(str);
    }

    function getUniqueRoyaltyForTest(string memory str) public pure returns (UniqueRoyalty memory, bytes memory) {
        UniqueRoyalty memory royalty = UniqueRoyaltyHelper.fromString(str);
        bytes memory encoded = abi.encode(royalty);

        return (royalty, encoded);
    }

    function testUniqueRoyaltyPartHelper(string memory str) public pure returns (UniqueRoyaltyPart memory) {
        return UniqueRoyaltyPartHelper.fromString(str);
    }

    function getUniqueRoyaltyPartForTest(string memory str) public pure returns (UniqueRoyaltyPart memory, bytes memory) {
        UniqueRoyaltyPart memory royaltyPart = UniqueRoyaltyPartHelper.fromString(str);
        bytes memory encoded = abi.encode(royaltyPart);

        return (royaltyPart, encoded);
    }

    function testBytesHelper(string memory str, uint dashIndex) public pure returns (string memory, uint) {
        bytes memory b = bytes(str);
        bytes memory nameBytes = BytesHelper.slice(bytes(b), 0, dashIndex);
        bytes memory valueBytes = BytesHelper.slice(bytes(b), dashIndex + 1);

        return (string (nameBytes), BytesHelper.bytesToUint(valueBytes));
    }

    function testCrossAddress(string memory str) public pure returns (CrossAddress memory) {
        return CrossAddressHelper.fromString(str);
    }

    function getCrossAddressForTest(string memory str) public pure returns (CrossAddress memory, bytes memory) {
        CrossAddress memory crossAddress = CrossAddressHelper.fromString(str);

        bytes memory encoded = abi.encode(crossAddress);

        return (crossAddress, encoded);
    }
}
