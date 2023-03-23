import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ethereum } from '@unique-nft/utils/extension';
import {formatEncoded, uniqueRoyaltyTypes} from "./_util";

describe('Royalties', () => {
    const equalsIgnoreCase = (a?: string, b?: string) => expect(a?.toLowerCase()).to.equal(b?.toLowerCase());

    async function deployFixture() {
        const [owner] = await ethers.getSigners();

        const SampleContract = await ethers.getContractFactory('SampleContract');
        const sampleContract = await SampleContract.deploy();


        return { sampleContract, SampleContract, owner };
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

        it('Version, decimal, primary and secondary', async () => {
            const { sampleContract } = await loadFixture(deployFixture);
            const str = `d:06|v:0001|`
             + `P-0125:e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250`
             + ';'
             + `S-0125:s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250;e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000`;

            const result = await sampleContract.testUniqueRoyaltyHelper(str);

            equalsIgnoreCase(result?.primary[0].crossAddress?.eth, '0x'+ '1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C');
            expect(result?.primary[0].value).to.equal(200000);

            expect(result?.primary[1].crossAddress?.sub).to.equal('0x'+ 'd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d');
            expect(result?.primary[1].value).to.equal(6250);

            expect(result?.secondary[0].crossAddress?.sub).to.equal('0x'+ 'd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d');
            expect(result?.secondary[0].value).to.equal(6250);

            equalsIgnoreCase(result?.secondary[1].crossAddress?.eth, '0x'+ '1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C');
            expect(result?.secondary[1].value).to.equal(200000);
        });

        it('Test gas', async () => {
            const { sampleContract, SampleContract } = await loadFixture(deployFixture);
            const str = `d:06|v:0001|`
             + `P-0125:e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250`
             + ';'
             + `S-0125:s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250;e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000`;

            const tx = await sampleContract.testGas(str);

            const receipt = Ethereum.parseEthersTxReceipt(await tx.wait());

            // console.dir(Object.keys(SampleContract), { depth: 20 });
            //
            // return;

            const parsed = SampleContract.interface.events['TestEvent3(bytes)'].format(receipt.events.TestEvent3.royaltyBytes)




            console.dir(parsed, { depth: 20 })

            // console.log(`Gas used: ${receipt.gasUsed.toString()}`);
        });

        it('Test CrossAddress decoding', async () => {
            const { sampleContract, SampleContract } = await loadFixture(deployFixture);

            const [crossAddress, encoded] = await sampleContract.getCrossAddressForTest('d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d');

            const decoded = ethers.utils.AbiCoder.prototype.decode([{ name: 'eth', type: 'address' }, {name: 'sub', type : 'uint256'}], encoded);
            expect(decoded).to.deep.equal(crossAddress);
        });

        it('Test UniqueRoyaltyPart decoding', async () => {
            const { sampleContract, SampleContract } = await loadFixture(deployFixture);

            const paramTypes = [
                {
                    components: [
                        {
                            name: "eth",
                            type: "address",
                        },
                        {
                            name: "sub",
                            type: "uint256",
                        },
                    ],
                    name: "crossAddress",
                    type: "tuple",
                },
                {
                    name: "value",
                    type: "uint32",
                },
            ];

            const str = `e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000`;

            const [uniqueRoyaltyPart, encoded] = await sampleContract.getUniqueRoyaltyPartForTest(str);



            const decoded = ethers.utils.AbiCoder.prototype.decode(paramTypes, encoded);
            expect(decoded).to.deep.equal(uniqueRoyaltyPart);
        });

        it('Test UniqueRoyalty decoding', async () => {
            const { sampleContract, SampleContract } = await loadFixture(deployFixture);



            const str = `d:06|v:0001|`
                + `P-0125:e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250`;
                // + ';'
                // + `S-0125:s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250;e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000`;

            const [uniqueRoyalty, encoded] = await sampleContract.getUniqueRoyaltyForTest(str);

            const formatted = formatEncoded(encoded);



            console.dir({ formatted }, { depth: 20 });
            console.dir({ encoded }, { depth: 20 });
            // console.dir({ uniqueRoyalty }, { depth: 20 });

            // const decoded = ethers.utils.AbiCoder.prototype.decode(paramTypes, encoded);
            // expect(decoded).to.deep.equal(uniqueRoyalty);


            // console.dir({ decoded }, { depth: 20 });
        });

        it('Test encoding', async () => {
            const { sampleContract, SampleContract } = await loadFixture(deployFixture);

            const ethAddressStr = `1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C`;
            const royaltyPartStr = `e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000`;
            const royaltyStr = `d:06|v:0001|P-0125:e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250`;

            const [crossAddress, encodedEthAddress] = await sampleContract.getCrossAddressForTest(ethAddressStr);
            const [uniqueRoyaltyPart, encodedRoyaltyPart] = await sampleContract.getUniqueRoyaltyPartForTest(royaltyPartStr);
            const [uniqueRoyalty, encodedRoyalty] = await sampleContract.getUniqueRoyaltyForTest(royaltyStr);

            const formattedEthAddress = formatEncoded(encodedEthAddress);
            const formattedRoyaltyPart = formatEncoded(encodedRoyaltyPart);
            const formattedRoyalty = formatEncoded(encodedRoyalty);

            const fixedEncodedRoyalty = '0x' + encodedRoyalty.substring(2 + 64);

            console.dir({ formattedEthAddress }, { depth: 20 });
            console.dir({ formattedRoyaltyPart }, { depth: 20 });
            console.dir({ formattedRoyalty }, { depth: 20 });

            const decodedRoyalty = ethers.utils.AbiCoder.prototype.decode(uniqueRoyaltyTypes, fixedEncodedRoyalty);

            console.dir({ decodedRoyalty }, { depth: 20 });

        });
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