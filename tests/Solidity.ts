import {
  expectRoyaltyPartStruct,
  getContract,
  structFromRoyaltyPart,
} from './_util';
import { ETH_SECONDARY, SUB_PRIMARY } from './_samples';
import { expect } from 'chai';

describe('Solidity implementation', () => {
  it('encode - sub - primary', async () => {
    const { contract } = await getContract();

    const encoded = await contract.encodePart(
      structFromRoyaltyPart(SUB_PRIMARY.decoded),
    );

    expect(encoded).to.equal(SUB_PRIMARY.encoded);
  });

  it('encode - eth - secondary', async () => {
    const { contract } = await getContract();

    const encoded = await contract.encodePart(
      structFromRoyaltyPart(ETH_SECONDARY.decoded),
    );

    expect(encoded).to.equal(ETH_SECONDARY.encoded);
  });

  it('decode - sub - primary', async () => {
    const { contract } = await getContract();

    const decoded = await contract.decodePart(SUB_PRIMARY.encoded);

    expectRoyaltyPartStruct(decoded).toEqual(SUB_PRIMARY.decoded);
  });

  it('decode - eth - secondary', async () => {
    const { contract } = await getContract();

    const decoded = await contract.decodePart(ETH_SECONDARY.encoded);

    expectRoyaltyPartStruct(decoded).toEqual(ETH_SECONDARY.decoded);
  });
});
