// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19;

import "./UniqueRoyalty.sol";
import "./LibPart.sol";

string constant ROYALTIES_PROPERTY = "royalties";

interface ICollection {
    function collectionProperty(string memory key) external view returns (bytes memory);
    function property(uint256 tokenId, string memory key) external view returns (bytes memory);
}

struct RoyaltyAmount {
    CrossAddress crossAddress;
    uint amount;
}

contract UniqueRoyaltyHelper {
    function encodePart(UniqueRoyaltyPart memory part) public pure returns (bytes memory) {
        (uint256 encodedMeta, uint256 encodedAddress) = UniqueRoyalty.encodePart(part);

        return abi.encodePacked(encodedMeta, encodedAddress);
    }

    function decodePart(bytes memory data) public pure returns (UniqueRoyaltyPart memory) {
        return UniqueRoyalty.decodePart(data);
    }

    // todo - implement
    function validatePart(bytes memory b) public pure returns (bool isValid) {
        isValid = b.length == 64;
    }

    function encode(UniqueRoyaltyPart[] memory royalties) public pure returns (bytes memory) {
        return UniqueRoyalty.encode(royalties);
    }

    function decode(bytes memory data) public pure returns (UniqueRoyaltyPart[] memory) {
        return UniqueRoyalty.decode(data);
    }

    // todo - implement
    function validate(bytes memory b) public pure returns (bool) {
        return b.length % 64 == 0;
    }

    function getTokenRoyalty(address collection, uint tokenId) public view returns (UniqueRoyaltyPart[] memory) {
        bytes memory encoded = ICollection(collection).property(tokenId, ROYALTIES_PROPERTY);

        return UniqueRoyalty.decode(encoded);
    }

    function getCollectionRoyalty(address collection) public view returns (UniqueRoyaltyPart[] memory) {
        bytes memory encoded = ICollection(collection).collectionProperty(ROYALTIES_PROPERTY);

        return UniqueRoyalty.decode(encoded);
    }

    function getRoyalty(address collection, uint tokenId) public view returns (UniqueRoyaltyPart[] memory royalty) {
        royalty = getTokenRoyalty(collection, tokenId);

        if (royalty.length == 0) {
            royalty = getCollectionRoyalty(collection);
        }
    }

    // todo - implement
    function convertToRaribleV2(UniqueRoyaltyPart[] memory royalties) public pure returns (LibPart.Part[] memory) {
        return new LibPart.Part[](0);
    }

    // todo - implement
    function calculateRoyalties(UniqueRoyaltyPart[] memory royalties, uint amount) public pure returns (RoyaltyAmount[] memory) {
        return new RoyaltyAmount[](0);
    }

    // todo - implement
    function calculateRoyalties(address collection, uint tokenId, uint amount) public view returns (RoyaltyAmount[] memory) {
        UniqueRoyaltyPart[] memory royalties = getRoyalty(collection, tokenId);

        return calculateRoyalties(royalties, amount);
    }
}
