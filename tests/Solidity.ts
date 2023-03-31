import { expectRoyaltyPartStruct, structFromRoyaltyPart } from './_util';
import { ETH_SECONDARY, ROYALTY_ENCODED, SUB_PRIMARY } from './_samples';
import { expect } from 'chai';
import { libTestingFixture, loadFixtureOrDeploy } from './_fixtures';

describe('Solidity implementation', () => {
  const deployed = loadFixtureOrDeploy(libTestingFixture);

  describe('UniqueRoyaltyPart', () => {
    it('encode - sub - primary', async () => {
      const { contract } = await deployed;

      const encoded = await contract.encodePart(
        structFromRoyaltyPart(SUB_PRIMARY.decoded),
      );

      expect(encoded).to.equal(SUB_PRIMARY.encoded);
    });

    it('encode - eth - secondary', async () => {
      const { contract } = await deployed;

      const encoded = await contract.encodePart(
        structFromRoyaltyPart(ETH_SECONDARY.decoded),
      );

      expect(encoded).to.equal(ETH_SECONDARY.encoded);
    });

    it('decode - sub - primary', async () => {
      const { contract } = await deployed;

      const decoded = await contract.decodePart(SUB_PRIMARY.encoded);

      expectRoyaltyPartStruct(decoded).toEqual(SUB_PRIMARY.decoded);
    });

    it('decode - eth - secondary', async () => {
      const { contract } = await deployed;

      const decoded = await contract.decodePart(ETH_SECONDARY.encoded);

      expectRoyaltyPartStruct(decoded).toEqual(ETH_SECONDARY.decoded);
    });
  });

  describe('UniqueRoyalty', () => {
    it('encode', async () => {
      const { contract } = await deployed;

      const asStructsArray = [
        structFromRoyaltyPart(SUB_PRIMARY.decoded),
        structFromRoyaltyPart(ETH_SECONDARY.decoded),
      ];

      const encoded = await contract.encode(asStructsArray);

      expect(encoded).to.equal(ROYALTY_ENCODED);
    });

    it('decode', async () => {
      const { contract } = await deployed;

      const [first, second] = await contract.decode(ROYALTY_ENCODED);

      expectRoyaltyPartStruct(first).toEqual(SUB_PRIMARY.decoded);
      expectRoyaltyPartStruct(second).toEqual(ETH_SECONDARY.decoded);
    });
  });
});
