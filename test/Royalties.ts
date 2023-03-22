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

describe('Royalties', () => {
    const equalsIgnoreCase = (a?: string, b?: string) => expect(a?.toLowerCase()).to.equal(b?.toLowerCase());

    async function deployFixture() {
        const [owner] = await ethers.getSigners();

        const SampleContract = await ethers.getContractFactory('SampleContract');
        const sampleContract = await SampleContract.deploy();

        return { sampleContract, owner };
    }

    describe('UniqueRoyaltyHelper', async () => {
        it('Version and decimal', async () => {
            const { sampleContract } = await loadFixture(deployFixture);
            const str = `v:0001|d:06`;
            const result = await sampleContract.testUniqueRoyaltyHelper(str);

            expect(result?.version).to.equal(1);
            expect(result?.decimals).to.equal(6);
        });

        it('Decimal and version', async () => {
            const { sampleContract } = await loadFixture(deployFixture);
            const str = `d:06|v:0001`;
            const result = await sampleContract.testUniqueRoyaltyHelper(str);

            expect(result?.version).to.equal(1);
            expect(result?.decimals).to.equal(6);
        });

        it('Version, decimal and single primary', async () => {
            const { sampleContract } = await loadFixture(deployFixture);
            const str = `d:06|v:0001|P-0050:e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000`;
            const result = await sampleContract.testUniqueRoyaltyHelper(str);

            expect(result?.version).to.equal(1);
            expect(result?.decimals).to.equal(6);

            equalsIgnoreCase(result?.primary[0].crossAddress?.eth, '0x'+ '1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C');
            expect(result?.primary[0].value).to.equal(200000);
        });

        it('Version, decimal and multiple primary', async () => {
            const { sampleContract } = await loadFixture(deployFixture);
            const str = `d:06|v:0001|P-0125:e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250`;
            const result = await sampleContract.testUniqueRoyaltyHelper(str);

            expect(result?.version).to.equal(1);
            expect(result?.decimals).to.equal(6);

            expect(result?.primary[1]?.crossAddress?.sub).to.equal('0x'+ 'd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d');
            expect(result?.primary[1]?.value).to.equal(6250);
        });

        // it('Version, decimal, primary and secondary', async () => {
        //     const { sampleContract } = await loadFixture(deployFixture);
        //     const str = `d:06|v:0001|`
        //      + `P-0125:e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250`
        //      + `S-0125:s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250;e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000`;
        //
        //     const result = await sampleContract.testUniqueRoyaltyHelper(str);
        //
        //     equalsIgnoreCase(result?.primary[0].crossAddress?.eth, '0x'+ '1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C');
        //     expect(result?.primary[0].value).to.equal(200000);
        //
        //     expect(result?.primary[1].crossAddress?.sub).to.equal('0x'+ 'd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d');
        //     expect(result?.primary[1].value).to.equal(200000);
        // });
    });

    describe('UniqueRoyaltyPartHelper', async () => {
        it('Ethereum sample - 300', async () => {
            const { sampleContract } = await loadFixture(deployFixture);

            const str = `e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0000300`;
            const result = await sampleContract.testUniqueRoyaltyPartHelper(str);

            equalsIgnoreCase(result?.crossAddress?.eth, '0x' + '1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C');
            expect(result?.value).to.equal(300);
        });

        it('Ethereum sample - 200000', async () => {
            const { sampleContract } = await loadFixture(deployFixture);

            const str = `e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000`;
            const result = await sampleContract.testUniqueRoyaltyPartHelper(str);

            equalsIgnoreCase(result?.crossAddress?.eth, '0x' + '1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C');
            expect(result?.value).to.equal(200000);
        });

        it('Substrate sample', async () => {
            const { sampleContract } = await loadFixture(deployFixture);

            const str = `s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250`;
            const result = await sampleContract.testUniqueRoyaltyPartHelper(str);

            expect(result?.crossAddress?.sub, '0x' + 'd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d');
            expect(result?.value).to.equal(6250);
        });
    });

    describe('BytesHelper test', async () => {
        it('Alice-00039', async () => {
            const { sampleContract, owner } = await loadFixture(deployFixture);

            const result = await sampleContract.testBytesHelper('Alice-00039', 5);

            expect(result[0]).to.equal('Alice');
            expect(result[1]).to.equal(39);
        });

        it('Alice-9999999', async () => {
            const { sampleContract, owner } = await loadFixture(deployFixture);

            const result = await sampleContract.testBytesHelper('Alice-9999999', 5);

            expect(result[0]).to.equal('Alice');
            expect(result[1]).to.equal(9999999);
        });
    });

    describe('CrossAddress from string', async () => {
        it('parse eth address (40)', async () => {
            const { sampleContract, owner } = await loadFixture(deployFixture);

            const original = owner.address.toLowerCase().substring(2);
            const result = await sampleContract.testCrossAddress(original);

            expect(result.eth.toLowerCase()).to.equal('0x' + original);
        });

        it('parse eth address (42)', async () => {
            const { sampleContract, owner } = await loadFixture(deployFixture);

            const original = owner.address.toLowerCase();
            const result = await sampleContract.testCrossAddress(original);

            expect(result.eth.toLowerCase()).to.equal(original);
        });

        it('parse substrate public key (64)', async () => {
            const { sampleContract } = await loadFixture(deployFixture);

            const original = '0x8ea22863f6d84b1f76e4377c1ba1f6c8bd75b0d3bb5d11c36c0436bdd3110867';
            const result = await sampleContract.testCrossAddress(original);

            expect(result.sub).to.equal(original);
        });

        it('parse substrate public key (66)', async () => {
            const { sampleContract } = await loadFixture(deployFixture);

            const original = '8ea22863f6d84b1f76e4377c1ba1f6c8bd75b0d3bb5d11c36c0436bdd3110867';
            const result = await sampleContract.testCrossAddress(original);

            expect(result.sub).to.equal('0x' + original);
        });
    });
});