// SPDX-License-Identifier: MIT

pragma solidity >=0.8.18;

struct CrossAddress {
    address eth;
    uint256 sub;
}

enum RoyaltyType{ PRIMARY, SECONDARY }

struct UniqueRoyaltyPart {
    uint16 version;
    uint8 decimals;
    uint32 value;
    RoyaltyType royaltyType;
    CrossAddress crossAddress;
}


library UniqueRoyaltyHelper {

}
