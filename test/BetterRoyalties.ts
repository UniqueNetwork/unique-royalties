import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { formatEncoded } from './_util';
import { expect } from 'chai';
import { Ethereum } from '@unique-nft/utils/extension';
import { encodeRoyaltyPart, decodeRoyaltyPart } from '../unique-royalties';
import { ETH_SECONDARY, SUB_PRIMARY } from './samples';

describe.only('Better royalties', () => {
  async function deployFixture() {
    const [owner] = await ethers.getSigners();

    const UniqueRoyaltyTestContract = await ethers.getContractFactory(
      'SampleContract',
    );
    const contract = await UniqueRoyaltyTestContract.deploy();

    return { contract, owner };
  }

  describe('TS - encode', () => {
    it('sub - primary', async () => {
      const encoded = encodeRoyaltyPart(SUB_PRIMARY.decoded);
      expect(encoded).to.equal(SUB_PRIMARY.encoded);
    });

    it('eth - secondary', async () => {
      const encoded = encodeRoyaltyPart(ETH_SECONDARY.decoded);
      expect(encoded).to.equal(ETH_SECONDARY.encoded);
    });
  });

  describe('TS - decode', () => {
    it('sub - primary', async () => {
      const decoded = decodeRoyaltyPart(SUB_PRIMARY.encoded);
      expect(decoded).to.deep.equal(SUB_PRIMARY.decoded);
    });

    it('eth - secondary', async () => {
      const decoded = decodeRoyaltyPart(ETH_SECONDARY.encoded);
      expect(decoded).to.deep.equal(ETH_SECONDARY.decoded);
    });
  });

  describe.skip('Solidity - encode', () => {
    it('TBD', async () => {
      const { contract } = await loadFixture(deployFixture);

      const str =
        '0x' +
        '0001230400000000000000050000000000000000000000000000000000000000';
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
});
