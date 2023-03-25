import {
  UniqueRoyaltyPartStruct,
  UniqueRoyaltyPartStructOutput,
} from '../typechain-types/TestingContract';
import { RoyaltyType, UniqueRoyaltyPart } from '../unique-royalties';
import { expect } from 'chai';
import { Address } from '@unique-nft/utils/address';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

export const crossAddressTypes = [
  {
    name: 'eth',
    type: 'address',
  },
  {
    name: 'sub',
    type: 'uint256',
  },
];

export const uniqueRoyaltyPartTypes = [
  {
    components: crossAddressTypes,
    name: 'crossAddress',
    type: 'tuple',
  },
  {
    name: 'value',
    type: 'uint32',
  },
];

export const uniqueRoyaltyTypes = [
  {
    name: 'version',
    type: 'uint16',
  },
  {
    name: 'decimals',
    type: 'uint8',
  },
  {
    components: uniqueRoyaltyPartTypes,
    name: 'primary',
    type: 'tuple[]',
  },
  {
    components: uniqueRoyaltyPartTypes,
    name: 'secondary',
    type: 'tuple[]',
  },
];

export const formatEncoded = (encoded: string): string[] =>
  encoded.substring(2).match(/.{1,64}/g) ?? [];

export const expectRoyaltyPartStruct = (
  actual: UniqueRoyaltyPartStructOutput,
) => ({
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

export const structFromRoyaltyPart = (
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

async function deployFixture() {
  const TestingContract = await ethers.getContractFactory('TestingContract');

  const contract = await TestingContract.deploy();

  return { contract };
}

export const getContract = () => loadFixture(deployFixture);

export const logGasDiff = (
  name: string,
  { dummyReceipt, realReceipt }: { dummyReceipt: any; realReceipt: any },
) => {
  console.dir({
    name,
    dummy: dummyReceipt.gasUsed,
    real: realReceipt.gasUsed,
    diff: realReceipt.gasUsed - dummyReceipt.gasUsed,
  });
};
