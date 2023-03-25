import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { formatEncoded } from './_util';
import { expect } from 'chai';
import { Ethereum } from '@unique-nft/utils/extension';
import {
  encodeRoyaltyPart,
  decodeRoyaltyPart,
  UniqueRoyaltyPart,
} from '../unique-royalties';

describe.only('Better royalties', () => {
  async function deployFixture() {
    const [owner] = await ethers.getSigners();

    const UniqueRoyaltyTestContract = await ethers.getContractFactory(
      'SampleContract',
    );
    const contract = await UniqueRoyaltyTestContract.deploy();

    return { contract, owner };
  }

  it.only('test - 2', async () => {
    const royaltyPart: UniqueRoyaltyPart = {
      version: 1,
      decimals: 6,
      value: 7n,
      royaltyType: 'SECONDARY',
      address: '0x1234a38988dd5ecc93dd9ce90a44a00e5fb91e4c',
    };

    const encoded = encodeRoyaltyPart(royaltyPart);

    const decoded = decodeRoyaltyPart(encoded);

    expect(decoded).to.deep.equal(royaltyPart);
    console.dir(royaltyPart);
    console.dir(decoded);
    // console.dir(encoded);
    console.dir(formatEncoded(encoded));
  });

  it('test', async () => {
    const { contract } = await loadFixture(deployFixture);

    const str =
      '0x' + '0001230400000000000000050000000000000000000000000000000000000000';
    // + 'VV000000000000000000000000000000000000000000RAddvvvvvvvvvvvvvvvv'
    // + '0100000000000000000000000000000000000000000010060000000000000007'
    ('0000000000000000000000001234a38988dd5ecc93dd9ce90a44a00e5fb91e4c');

    console.dir(formatEncoded(str));

    // const result = await contract.decodeEncode(str);
    const txOrResult = await contract.decodeRoyaltyPart(str);
    // const txOrResult = await contract.emitSomeShit(str);

    if (txOrResult.wait) {
      const receipt = Ethereum.parseEthersTxReceipt(await txOrResult.wait());

      // console.dir(receipt);
    } else {
      // console.dir(txOrResult);
    }

    // console.dir(result);
  });
});
