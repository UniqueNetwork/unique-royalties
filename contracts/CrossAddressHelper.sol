// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import { CrossAddress } from "@unique-nft/solidity-interfaces/contracts/UniqueNFT.sol";

library CrossAddressHelper {
    function numberFromAscII(bytes1 b) private pure returns (uint8 res) {
        if (b>="0" && b<="9") {
            return uint8(b) - uint8(bytes1("0"));
        } else if (b>="A" && b<="F") {
            return 10 + uint8(b) - uint8(bytes1("A"));
        } else if (b>="a" && b<="f") {
            return 10 + uint8(b) - uint8(bytes1("a"));
        }
        return uint8(b);
    }

    function parseSubstratePrivateKey(bytes memory _strBytes) internal pure returns (uint256 value) {
        uint256 number = 0;

        require(_strBytes.length == 64 || _strBytes.length == 66, 'Address string should be 40 or 42 characters long');
        uint startFrom = _strBytes.length == 66 ? 2 : 0;

        for(uint i=startFrom; i<_strBytes.length; i++){
            number = number << 4;
            number |= numberFromAscII(_strBytes[i]);
        }

        return number;
    }

    function parseSubstratePrivateKey(string memory _publicKeyString) internal pure returns (uint256 value) {
        return parseSubstratePrivateKey(bytes(_publicKeyString));
    }

    function parseEthereumAddress (string memory _addressString) internal pure returns (address) {
        return parseEthereumAddress(bytes(_addressString));
    }

    function parseEthereumAddress (bytes memory _strBytes) internal pure returns (address) {
        uint160 _address = 0;
        uint160 b1;
        uint160 b2;

        require(_strBytes.length == 40 || _strBytes.length == 42, 'Address string should be 40 or 42 characters long');
        uint startFrom = _strBytes.length == 42 ? 2 : 0;

        for (uint i = startFrom; i < startFrom + 2 * 20; i += 2){
            _address *= 256;

            b1 = uint160(uint8(_strBytes[i]));
            b2 = uint160(uint8(_strBytes[i+1]));

            if ((b1 >= 97)&&(b1 <= 102)) b1 -= 87;
            else if ((b1 >= 48)&&(b1 <= 57)) b1 -= 48;

            if ((b2 >= 97)&&(b2 <= 102)) b2 -= 87;
            else if ((b2 >= 48)&&(b2 <= 57)) b2 -= 48;

            _address += (b1*16+b2);
        }

        return address(_address);
    }

    function fromString(string memory str) pure internal returns (CrossAddress memory) {
        bytes memory b = bytes(str);

        if (b.length == 40 || b.length == 42) {
            return CrossAddress({
            eth: parseEthereumAddress(str),
            sub: 0
            });
        } else if (b.length == 64 || b.length == 66) {
            return CrossAddress({
            eth: address(0x0),
            sub: parseSubstratePrivateKey(str)
            });
        }

        revert("Invalid cross address string; expecting 40/42 char Ethereum address or 64/66 char Substrate private key");
    }
}