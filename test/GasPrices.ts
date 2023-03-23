import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ethereum } from '@unique-nft/utils/extension';
import { HexString } from '@unique-nft/utils/string';
import { uniqueRoyaltyTypes } from "./_util";

describe('Gas prices', () => {
    async function deployFixture() {
        const [owner] = await ethers.getSigners();

        const GasPricesContract = await ethers.getContractFactory('GasPricesContract');
        const gasPricesContract = await GasPricesContract.deploy();


        return { gasPricesContract, owner };
    }

    const logDiff = (name: string, {strReceipt, abiReceipt}: { strReceipt: any, abiReceipt: any }) => {
        console.dir({
            name,
            strReceipt: strReceipt.gasUsed,
            abiReceipt: abiReceipt.gasUsed,
            diff: (strReceipt.gasUsed / abiReceipt.gasUsed),
        });
    }

    it('Compare CrossAddress', async () => {
        const { gasPricesContract } = await loadFixture(deployFixture);

        const encoded = {
            abi: '0x0000000000000000000000001234a38988dd5ecc93dd9ce90a44a00e5fb91e4c0000000000000000000000000000000000000000000000000000000000000000',
            str: '0x1234a38988dd5ecc93dd9ce90a44a00e5fb91e4c',
        };

        const abiTx = await gasPricesContract.crossAddressFromAbiEncoded(HexString.toU8a(encoded.abi));
        const abiReceipt = Ethereum.parseEthersTxReceipt(await abiTx.wait());

        const strTx = await gasPricesContract.crossAddressFromString(encoded.str);
        const strReceipt = Ethereum.parseEthersTxReceipt(await strTx.wait());

        expect(abiReceipt.events.CrossAddressDecoded).to.deep.equal(strReceipt.events.CrossAddressDecoded);

        logDiff('CrossAddress', {strReceipt, abiReceipt});
    });

    it('Compare UniqueRoyaltyPart', async () => {
        const { gasPricesContract } = await loadFixture(deployFixture);

        const encoded = {
            abi: '0x0000000000000000000000001234a38988dd5ecc93dd9ce90a44a00e5fb91e4c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030d40',
            str: 'e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000',
        };


        const strTx = await gasPricesContract.uniqueRoyaltyPartFromString(encoded.str);
        const strReceipt = Ethereum.parseEthersTxReceipt(await strTx.wait());

        const abiTx = await gasPricesContract.uniqueRoyaltyPartFromAbiEncoded(HexString.toU8a(encoded.abi));
        const abiReceipt = Ethereum.parseEthersTxReceipt(await abiTx.wait());

        expect(abiReceipt.events.UniqueRoyaltyPartDecoded).to.deep.equal(strReceipt.events.UniqueRoyaltyPartDecoded);

        logDiff('UniqueRoyaltyPart', {strReceipt, abiReceipt});
    });

    it('Compare UniqueRoyalty', async () => {
        const { gasPricesContract } = await loadFixture(deployFixture);

        const encoded = {
            abi: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000020000000000000000000000001234a38988dd5ecc93dd9ce90a44a00e5fb91e4c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030d400000000000000000000000000000000000000000000000000000000000000000d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d000000000000000000000000000000000000000000000000000000000000186a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d000000000000000000000000000000000000000000000000000000000000186a0000000000000000000000001234a38988dd5ecc93dd9ce90a44a00e5fb91e4c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030d40',
            str: `d:06|v:0001|`
                + `P-0125:e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000;s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250` + ';'
                + `S-0125:s-d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d-0006250;e-1234A38988Dd5ecC93Dd9cE90a44A00e5FB91e4C-0200000`,
        };


        const abiTx = await gasPricesContract.uniqueRoyaltyFromAbiEncoded(HexString.toU8a(encoded.abi));
        const abiReceipt = Ethereum.parseEthersTxReceipt(await abiTx.wait());

        const strTx = await gasPricesContract.uniqueRoyaltyFromString(encoded.str);
        const strReceipt = Ethereum.parseEthersTxReceipt(await strTx.wait());

        expect(abiReceipt.events.UniqueRoyaltyDecoded).to.deep.equal(strReceipt.events.UniqueRoyaltyDecoded);

        logDiff('UniqueRoyalty', {strReceipt, abiReceipt});
    });
});