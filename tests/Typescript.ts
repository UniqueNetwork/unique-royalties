import {
  calculateAmount,
  calculateRoyalties,
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
      expect(calculateAmount(1n, 0, 100n)).to.equal(100);
      expect(calculateAmount(100n, 0, 100n)).to.equal(10000);
      expect(calculateAmount(50n, 0, 100n)).to.equal(5000);
      expect(calculateAmount(1n, 6, 1_000_000_000n)).to.equal(1000);

      expect(
        calculateRoyalty(SUB_PRIMARY.decoded, 1_000_000_000_000n),
      ).to.deep.equal({
        address: SUB_PRIMARY.decoded.address,
        amount: 255_000_00000n,
      });

      expect(
        calculateRoyalty(ETH_SECONDARY.decoded, 1_000_000_000_000n),
      ).to.deep.equal({
        address: ETH_SECONDARY.decoded.address,
        amount: 150_00000n,
      });
    });

    it('should calculate royalty depending on sale type', () => {
      const primary = calculateRoyalties(
        ROYALTY_DECODED,
        true,
        1_000_000_000_000n,
      );

      expect(primary.length).to.equal(1);
      expect(primary[0].address).to.equal(SUB_PRIMARY.decoded.address);
      expect(primary[0].amount).to.equal(255_000_00000n);

      const secondary = calculateRoyalties(
        ROYALTY_DECODED,
        false,
        1_000_000_000_000n,
      );

      expect(secondary.length).to.equal(1);
      expect(secondary[0].address).to.equal(ETH_SECONDARY.decoded.address);
      expect(secondary[0].amount).to.equal(150_00000n);
    });
  });
});
