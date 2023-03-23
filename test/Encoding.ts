import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { formatEncoded } from "./_util";
import {expect} from "chai";

const crossAddressString = '0x1234a38988dd5ecc93dd9ce90a44a00e5fb91e4c';
const royaltyPartString = 'e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000';
const royaltyString = `d:06|v:0001|`
    + `P-0125:e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250`
    + ';'
    + `S-0125:s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250;e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000`;


describe('EncodingContract', () => {
    async function deployFixture() {
        const [owner] = await ethers.getSigners();

        const EncodingContract = await ethers.getContractFactory('EncodingContract');
        const encodingContract = await EncodingContract.deploy();

        return { encodingContract, owner };
    }

    it('Encode CrossAddress', async () => {
        const { encodingContract } = await loadFixture(deployFixture);

        const encoded = await encodingContract.encodeCrossAddress(crossAddressString);
        const formatted = formatEncoded(encoded);

        await encodingContract.decodeCrossAddress(encoded);

        console.dir({ encoded, formatted }, { depth: null });

        expect(formatted.length).not.equal(0);
    });

    it('Encode UniqueRoyaltyPart', async () => {
        const { encodingContract } = await loadFixture(deployFixture);

        const encoded = await encodingContract.encodeUniqueRoyaltyPart(royaltyPartString);
        const formatted = formatEncoded(encoded);
        await encodingContract.decodeUniqueRoyaltyPart(encoded);

        console.dir({ encoded, formatted }, { depth: null });

        expect(formatted.length).not.equal(0);
    });

    it('Encode UniqueRoyalty', async () => {
        const { encodingContract } = await loadFixture(deployFixture);

        const encoded = await encodingContract.encodeUniqueRoyalty(royaltyString);
        const formatted = formatEncoded(encoded);

        await encodingContract.decodeUniqueRoyalty(encoded);

        console.dir({ encoded, formatted }, { depth: null });

        expect(formatted.length).not.equal(0);
    });
});