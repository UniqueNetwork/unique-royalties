// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import { CrossAddress } from "@unique-nft/solidity-interfaces/contracts/UniqueNFT.sol";

import "./CrossAddressHelper.sol";

import "./PersonHelper.sol";
import "./UniqueRoyaltyPartHelper.sol";
import "./BytesHelper.sol";

contract SampleContract {
    CrossAddress crossAddress;

    uint public value;

    function testGas(string memory str) public {
        crossAddress = CrossAddressHelper.fromString(str);
    }

    function testUniqueRoyaltyPartHelper(string memory str) public pure returns (UniqueRoyaltyPartHelper.UniqueRoyaltyPart memory) {
        return UniqueRoyaltyPartHelper.fromString(str);
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
}
