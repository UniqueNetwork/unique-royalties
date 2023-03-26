import {
  expectRoyaltyPartStruct,
  formatEncoded,
  getContract,
  structFromRoyaltyPart,
} from './_util';
import { ETH_SECONDARY, SUB_PRIMARY } from './_samples';
import { expect } from 'chai';

describe('Solidity implementation', () => {
  describe('UniqueRoyaltyParts', () => {
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

  describe('UniqueRoyalty', () => {
    const ROYALTY_ENCODED =
      SUB_PRIMARY.encoded + ETH_SECONDARY.encoded.slice(2);

    const ROYALTY_DECODED = [SUB_PRIMARY.decoded, ETH_SECONDARY.decoded];

    const ROYALTY_AS_STRUCTS_ARRAY = [
      structFromRoyaltyPart(SUB_PRIMARY.decoded),
      structFromRoyaltyPart(ETH_SECONDARY.decoded),
    ];

    it('encode', async () => {
      const { contract } = await getContract();

      const encoded = await contract.encode(ROYALTY_AS_STRUCTS_ARRAY);

      expect(encoded).to.equal(ROYALTY_ENCODED);
    });

    it('decode', async () => {
      const { contract } = await getContract();

      const [first, second] = await contract.decode(ROYALTY_ENCODED);

      expectRoyaltyPartStruct(first).toEqual(SUB_PRIMARY.decoded);
      expectRoyaltyPartStruct(second).toEqual(ETH_SECONDARY.decoded);
    });
  });
});
