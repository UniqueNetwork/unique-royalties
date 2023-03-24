import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { formatEncoded } from "./_util";
import {expect} from "chai";
import { HexString } from '@unique-nft/utils/string'
import { Ethereum } from '@unique-nft/utils/extension';



describe.only('Better royalties', () => {
    async function deployFixture() {
        const [owner] = await ethers.getSigners();

        const UniqueRoyaltyTestContract = await ethers.getContractFactory('SampleContract');
        const contract = await UniqueRoyaltyTestContract.deploy();


        return { contract, owner };
    }

    it('test', async () => {
        const { contract } = await loadFixture(deployFixture);

        const str = '0x'
            + '0001230400000000000000050000000000000000000000000000000000000000'
            + '0000000000000000000000000000000000000000000000000000000000000000';

        console.dir(formatEncoded(str));

        // const result = await contract.decodeEncode(str);
        const txOrResult = await contract.decodeRoyaltyPart(str);

        if (txOrResult.wait) {
            const receipt = Ethereum.parseEthersTxReceipt(await txOrResult.wait());

            console.dir(receipt);
        } else {
            console.dir(txOrResult);
        }

        // console.dir(result);
    });
});
