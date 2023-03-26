import {
  decodeRoyalty,
  decodeRoyaltyPart,
  encodeRoyalty,
  encodeRoyaltyPart,
} from '../unique-royalties';
import {
  ETH_SECONDARY,
  SUB_PRIMARY,
  ROYALTY_ENCODED,
  ROYALTY_DECODED,
} from './_samples';
import { expect } from 'chai';

describe('TS implementation', () => {
  describe('UniqueRoyaltyPart', () => {
    it('encode - sub - primary', () => {
      const encoded = encodeRoyaltyPart(SUB_PRIMARY.decoded);
      expect(encoded).to.equal(SUB_PRIMARY.encoded);
    });

    it('encode - eth - secondary', () => {
      const encoded = encodeRoyaltyPart(ETH_SECONDARY.decoded);
      expect(encoded).to.equal(ETH_SECONDARY.encoded);
    });

    it('decode - sub - primary', () => {
      const decoded = decodeRoyaltyPart(SUB_PRIMARY.encoded);
      expect(decoded).to.deep.equal(SUB_PRIMARY.decoded);
    });

    it('decode - eth - secondary', () => {
      const decoded = decodeRoyaltyPart(ETH_SECONDARY.encoded);
      expect(decoded).to.deep.equal(ETH_SECONDARY.decoded);
    });
  });

  describe('UniqueRoyalty', () => {
    it('encode', () => {
      const encoded = encodeRoyalty(ROYALTY_DECODED);

      expect(encoded).to.equal(ROYALTY_ENCODED);
    });

    it('decode', () => {
      const decoded = decodeRoyalty(ROYALTY_ENCODED);

      expect(decoded).to.deep.equal(ROYALTY_DECODED);
    });
  });
});
