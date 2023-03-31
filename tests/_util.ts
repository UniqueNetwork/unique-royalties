import {
  UniqueRoyaltyPartStruct,
  UniqueRoyaltyPartStructOutput,
} from '../typechain-types/TestingContract';
import { RoyaltyType, UniqueRoyaltyPart } from '../unique-royalties';
import { expect } from 'chai';
import { Address } from '@unique-nft/utils/address';

export const formatBytes = (encoded: string): string[] =>
  encoded.substring(2).match(/.{1,64}/g) ?? [];

export const expectRoyaltyPartStruct = (
  actual: UniqueRoyaltyPartStructOutput | any,
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
