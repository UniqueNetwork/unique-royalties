// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19;

struct Property {
    string key;
    bytes value;
}

struct TokenPropertyPermission {
    string key;
    PropertyPermission[] permissions;
}

struct PropertyPermission {
    TokenPermissionField code;
    bool value;
}

enum TokenPermissionField {
    Mutable,
    TokenOwner,
    CollectionAdmin
}

contract CollectionMock {
    mapping(string => bytes) public collectionProperties;

    mapping(uint256 => mapping(string => bytes)) public tokenProperties;

    function setCollectionProperties(Property[] memory properties) public payable {
        for (uint256 i = 0; i < properties.length; i++) {
            collectionProperties[properties[i].key] = properties[i].value;
        }
    }

    function setProperties(uint256 tokenId, Property[] memory properties) public payable {
        for (uint256 i = 0; i < properties.length; i++) {
            tokenProperties[tokenId][properties[i].key] = properties[i].value;
        }
    }

    function collectionProperty(string memory key) external view returns (bytes memory) {
        return collectionProperties[key];
    }

    function property(uint256 tokenId, string memory key) external view returns (bytes memory) {
        return tokenProperties[tokenId][key];
    }

    function setTokenPropertyPermissions(TokenPropertyPermission[] memory permissions) public payable {
        // do nothing
    }
}