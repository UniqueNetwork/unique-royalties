import { expectRoyaltyPartStruct, structFromRoyaltyPart } from './_util';
import { ETH_DEFAULT, ROYALTY_ENCODED, SUB_PRIMARY_ONLY } from './_samples';
import { expect } from 'chai';
import { libTestingFixture, loadFixtureOrDeploy } from './_fixtures';

describe('Solidity implementation', () => {
  const deployed = loadFixtureOrDeploy(libTestingFixture);

  describe('UniqueRoyaltyPart', () => {
    it('encode - sub - primary', async () => {
      const { contract } = await deployed;

      const encoded = await contract.encodePart(
        structFromRoyaltyPart(SUB_PRIMARY_ONLY.decoded),
      );

      expect(encoded).to.equal(SUB_PRIMARY_ONLY.encoded);
    });

    it('encode - eth - secondary', async () => {
      const { contract } = await deployed;

      const encoded = await contract.encodePart(
        structFromRoyaltyPart(ETH_DEFAULT.decoded),
      );

      expect(encoded).to.equal(ETH_DEFAULT.encoded);
    });

    it('decode - sub - primary', async () => {
      const { contract } = await deployed;

      const decoded = await contract.decodePart(SUB_PRIMARY_ONLY.encoded);

      expectRoyaltyPartStruct(decoded).toEqual(SUB_PRIMARY_ONLY.decoded);
    });

    it('decode - eth - secondary', async () => {
      const { contract } = await deployed;

      const decoded = await contract.decodePart(ETH_DEFAULT.encoded);

      expectRoyaltyPartStruct(decoded).toEqual(ETH_DEFAULT.decoded);
    });
  });

  describe('UniqueRoyalty', () => {
    it('encode', async () => {
      const { contract } = await deployed;

      const asStructsArray = [
        structFromRoyaltyPart(SUB_PRIMARY_ONLY.decoded),
        structFromRoyaltyPart(ETH_DEFAULT.decoded),
      ];

      const encoded = await contract.encode(asStructsArray);

      expect(encoded).to.equal(ROYALTY_ENCODED);
    });

    it('decode', async () => {
      const { contract } = await deployed;

      const [first, second] = await contract.decode(ROYALTY_ENCODED);

      expectRoyaltyPartStruct(first).toEqual(SUB_PRIMARY_ONLY.decoded);
      expectRoyaltyPartStruct(second).toEqual(ETH_DEFAULT.decoded);
    });
  });
});
