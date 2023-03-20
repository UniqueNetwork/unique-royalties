// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import "./UniqueSchemaRoyalties.sol";

contract RoyaltiesSample {
    UniqueRoyaltyPart royaltyPart;

    function deserializeAndStoreRoyalties(string memory royaltyString) public {
        royaltyPart = UniqueRoyaltyPart.deserialize(royaltyString);
    }

    function getValue() public view returns (uint256) {
        return royaltyPart.value;
    }

    function getEthAddress() public view returns (address) {
        return royaltyPart.eth;
    }

    function getSubAddress() public view returns (uint256) {
        return royaltyPart.sub;
    }
}