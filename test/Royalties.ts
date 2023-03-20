import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// const version = `v:0001`;
// const decimals = `d:06`;
// const primary = `r1-0125:e-0000000000000000000000000000000000000000-0200000;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250`;
// const secondary = `r2-0125:e-0000000000000000000000000000000000000000-0000300;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0002500`;
//
// const serializedRoyalty = [version, decimals, primary, secondary].join('|');


describe.only('Royalties', () => {
    async function deployFixture() {
        const [owner] = await ethers.getSigners();

        const Sample = await ethers.getContractFactory('Sample');
        const sample = await Sample.deploy();

        return { sample, owner };
    }

    it('test serialize', async () => {
        const { sample, owner } = await loadFixture(deployFixture);

        const value = 777;
        const ethAddress = owner.address.toLowerCase().substring(2);

        const royaltyEthStr = await sample.serializeEthereum(value, ethAddress);

        expect(royaltyEthStr).equal(`e-${ethAddress}-${value}`);

        const royaltySubstrateStr = await sample.serializeSubstrate(value, 111);

        expect(royaltySubstrateStr).equal(`e-${ethAddress}-${value}`);
    });


    // it('test deserialize', async () => {
    //     const { sample, owner } = await loadFixture(deployFixture);
    //
    //     let royalty = await sample.testDeserialize(`e-${owner.address.toLowerCase().substring(2)}`);
    //
    //     expect(royalty).to.deep.equal([]);
    // });
});