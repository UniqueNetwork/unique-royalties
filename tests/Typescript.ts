import {
  calculateAmount,
  calculateRoyalty,
  decodeRoyalty,
  decodeRoyaltyPart,
  encodeRoyalty,
  encodeRoyaltyPart,
} from '../ts-implementation';
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

  describe('Calculate royalty', () => {
    it('should calculate royalty', () => {
      expect(calculateAmount(1n, 0, 100n)).to.equal(1);
      expect(calculateAmount(100n, 0, 100n)).to.equal(100);
      expect(calculateAmount(50n, 0, 100n)).to.equal(50);
      expect(calculateAmount(1n, 6, 1_000_000_000n)).to.equal(10);

      expect(
        calculateRoyalty(SUB_PRIMARY.decoded, 1_000_000_000_000n),
      ).to.deep.equal({
        address: SUB_PRIMARY.decoded.address,
        amount: 255_000_000n,
      });

      expect(
        calculateRoyalty(ETH_SECONDARY.decoded, 1_000_000_000_000n),
      ).to.deep.equal({
        address: ETH_SECONDARY.decoded.address,
        amount: 150_000n,
      });
    });
  });
});
