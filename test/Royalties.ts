import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// const version = `v:0001`;
// const decimals = `d:06`;
// const primary = `r1-0125:e-0000000000000000000000000000000000000000-0200000;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250`;
// const secondary = `r2-0125:e-0000000000000000000000000000000000000000-0000300;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0002500`;
//
// const serializedRoyalty = [version, decimals, primary, secondary].join('|');

export function fromStructToObject<T extends object>(struct: [] & T) : T{
    struct = { ...struct };
    const keysNumber = Object.keys(struct).length;
    for(let i = 0; i < keysNumber/2; i++){
        delete struct[i];
    }

    return struct;
}

describe.only('Royalties', () => {
    async function deployFixture() {
        const [owner] = await ethers.getSigners();

        const Sample = await ethers.getContractFactory('Sample');
        const sample = await Sample.deploy();

        return { sample, owner };
    }

    // it('test deserialize', async () => {
    //     const { sample, owner } = await loadFixture(deployFixture);
    //
    //     const royaltyStruct = await sample.testDeserialize(`e-${owner.address.toLowerCase().substring(2)}`);
    //
    //     const royalty = fromStructToObject(royaltyStruct as any);
    //
    //     expect(royalty).to.deep.equal({
    //         version: 1,
    //         decimals: 6,
    //         primary: [],
    //         secondary: [],
    //     });
    // });

    // it('parse eth address', async () => {
    //     const { sample, owner } = await loadFixture(deployFixture);
    //
    //     const original = owner.address.toLowerCase().substring(2);
    //     const result = await sample.test(original);
    //
    //     expect(result.toLowerCase().substring(2)).to.equal(original);
    // });
    //
    // it('parse substrate public key', async () => {
    //     const { sample, owner } = await loadFixture(deployFixture);
    //
    //     const original = '0x8ea22863f6d84b1f76e4377c1ba1f6c8bd75b0d3bb5d11c36c0436bdd3110867';
    //     const result = await sample.test2(original);
    //
    //     expect(result).to.equal(original);
    // });
    //
    describe('CrossAddress from string', async () => {
        it('parse eth address (40)', async () => {
            const { sample, owner } = await loadFixture(deployFixture);

            const original = owner.address.toLowerCase().substring(2);
            const result = await sample.testCrossAddress(original);

            expect(result.eth.toLowerCase()).to.equal('0x' + original);
        });

        it('parse eth address (42)', async () => {
            const { sample, owner } = await loadFixture(deployFixture);

            const original = owner.address.toLowerCase();
            const result = await sample.testCrossAddress(original);

            expect(result.eth.toLowerCase()).to.equal(original);
        });

        it('parse substrate public key (64)', async () => {
            const { sample } = await loadFixture(deployFixture);

            const original = '0x8ea22863f6d84b1f76e4377c1ba1f6c8bd75b0d3bb5d11c36c0436bdd3110867';
            const result = await sample.testCrossAddress(original);

            expect(result.sub).to.equal(original);
        });

        it('parse substrate public key (66)', async () => {
            const { sample } = await loadFixture(deployFixture);

            const original = '8ea22863f6d84b1f76e4377c1ba1f6c8bd75b0d3bb5d11c36c0436bdd3110867';
            const result = await sample.testCrossAddress(original);

            expect(result.sub).to.equal('0x' + original);
        });
    });
});