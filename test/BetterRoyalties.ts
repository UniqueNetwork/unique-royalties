import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import {
  encodeRoyaltyPart,
  decodeRoyaltyPart,
  UniqueRoyaltyPart,
  RoyaltyType,
} from '../unique-royalties';
import { ETH_SECONDARY, SUB_PRIMARY } from './samples';
import { Address } from '@unique-nft/utils/address';
import {
  UniqueRoyaltyPartStruct,
  UniqueRoyaltyPartStructOutput,
} from '../typechain-types/SampleContract';

const expectRoyaltyPartStruct = (actual: UniqueRoyaltyPartStructOutput) => ({
  toEqual: (expected: UniqueRoyaltyPart) => {
    const [version, decimals, value, royaltyType, address] = actual;
    const [ethAddress, subAddress] = address;

    expect(actual.version).to.equal(version);
    expect(actual.decimals).to.equal(decimals);
    expect(actual.value).to.equal(expected.value);

    expect(
      actual.royaltyType ? RoyaltyType.SECONDARY : RoyaltyType.PRIMARY,
    ).to.equal(expected.royaltyType);

    if (Address.is.ethereumAddress(expected.address)) {
      expect(subAddress).to.equal(0n);
      expect(ethAddress.toLowerCase()).to.equal(expected.address.toLowerCase());
    } else {
      const expectedSub = Address.substrate.decode(expected.address).bigint;

      expect(subAddress).to.equal(expectedSub);
      expect(ethAddress).to.equal('0x0000000000000000000000000000000000000000');
    }
  },
});

const structFromRoyaltyPart = (
  part: UniqueRoyaltyPart,
): UniqueRoyaltyPartStruct => ({
  value: part.value,
  version: part.version,
  decimals: part.decimals,
  royaltyType: part.royaltyType === RoyaltyType.SECONDARY ? 1 : 0,
  crossAddress: Address.is.ethereumAddress(part.address)
    ? {
        eth: part.address,
        sub: 0,
      }
    : {
        eth: '0x0000000000000000000000000000000000000000',
        sub: Address.substrate.decode(part.address).bigint,
      },
});

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

  describe('Solidity - decode', () => {
    it('sub - primary', async () => {
      const { contract } = await loadFixture(deployFixture);

      const decoded = await contract.decodeRoyaltyPart(SUB_PRIMARY.encoded);

      expectRoyaltyPartStruct(decoded).toEqual(SUB_PRIMARY.decoded);
    });

    it('eth - secondary', async () => {
      const { contract } = await loadFixture(deployFixture);

      const decoded = await contract.decodeRoyaltyPart(ETH_SECONDARY.encoded);

      expectRoyaltyPartStruct(decoded).toEqual(ETH_SECONDARY.decoded);
    });
  });

  describe('Solidity - encode', () => {
    it('sub - primary', async () => {
      const { contract } = await loadFixture(deployFixture);

      const encoded = await contract.encodeRoyaltyPart(
        structFromRoyaltyPart(SUB_PRIMARY.decoded),
      );

      expect(encoded).to.equal(SUB_PRIMARY.encoded);
    });

    it('eth - secondary', async () => {
      const { contract } = await loadFixture(deployFixture);

      const encoded = await contract.encodeRoyaltyPart(
        structFromRoyaltyPart(ETH_SECONDARY.decoded),
      );

      expect(encoded).to.equal(ETH_SECONDARY.encoded);
    });
  });
});
