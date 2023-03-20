import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const deserializedRoyalty = { // customised royalties for the token
    royaltyVersion: 1,
    decimals: 6,
    primary: {
        addresses: {
            '0x0000000000000000000000000000000000000000': 200000, // 0.2%
            '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY': 6250, // 0.625%
        },
    },
    secondary: {
        addresses: {
            '0x0000000000000000000000000000000000000000': 300, // 0.03%
            '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY': 2500, // 0.25%
        },
    },
};

const version = `v:0001`;
const decimals = `d:06`;
const primary = `r1-0125:e-0000000000000000000000000000000000000000-0200000;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250`;
const secondary = `r2-0125:e-0000000000000000000000000000000000000000-0000300;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0002500`;

const serializedRoyalty = [version, decimals, primary, secondary].join('|');


describe.only('Royalties', () => {
    async function deployFixture() {
        const [owner] = await ethers.getSigners();

        const UniqueSchemaRoyaltiesHelper = await ethers.getContractFactory('UniqueSchemaRoyaltiesHelper');
        const uniqueSchemaRoyaltiesHelper = await UniqueSchemaRoyaltiesHelper.deploy(serializedRoyalty);

        return { uniqueSchemaRoyaltiesHelper, owner };
    }

    it('should set and return royalty', async () => {
        const { uniqueSchemaRoyaltiesHelper } = await loadFixture(deployFixture);

        let royalty = await uniqueSchemaRoyaltiesHelper.retrieve();

        expect(royalty).to.equal(serializedRoyalty);

        await uniqueSchemaRoyaltiesHelper.store([version, decimals].join('|'));

        royalty = await uniqueSchemaRoyaltiesHelper.retrieve();

        expect(royalty).to.equal('v:0001|d:06');
    });
});