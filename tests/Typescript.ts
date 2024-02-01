import {
  calculateAmount,
  calculateRoyalties,
  calculateRoyalty,
  decodeRoyalty,
  decodeRoyaltyPart,
  encodeRoyalty,
  encodeRoyaltyPart,
  toLibPart,
  fromLibPart,
} from '../src';
import {
  ETH_DEFAULT,
  SUB_PRIMARY_ONLY,
  ROYALTY_ENCODED,
  ROYALTY_DECODED,
} from './_samples';
import { expect } from 'chai';

describe('TS implementation', () => {
  describe('UniqueRoyaltyPart', () => {
    it('encode - sub - primary', () => {
      const encoded = encodeRoyaltyPart(SUB_PRIMARY_ONLY.decoded);
      expect(encoded).to.equal(SUB_PRIMARY_ONLY.encoded);
    });

    it('encode - eth - secondary', () => {
      const encoded = encodeRoyaltyPart(ETH_DEFAULT.decoded);
      expect(encoded).to.equal(ETH_DEFAULT.encoded);
    });

    it('decode - sub - primary', () => {
      const decoded = decodeRoyaltyPart(SUB_PRIMARY_ONLY.encoded);
      expect(decoded).to.deep.equal(SUB_PRIMARY_ONLY.decoded);
    });

    it('decode - eth - secondary', () => {
      const decoded = decodeRoyaltyPart(ETH_DEFAULT.encoded);
      expect(decoded).to.deep.equal(ETH_DEFAULT.decoded);
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
      expect(calculateAmount(1n, 2, 100n)).to.equal(1n);
      expect(calculateAmount(15n, 4, 100n)).to.equal(0n);

      expect(
        calculateRoyalty(SUB_PRIMARY_ONLY.decoded, 1_000_000_000_000n),
      ).to.deep.equal({
        address: SUB_PRIMARY_ONLY.decoded.address,
        amount: 255_000_00000n,
      });

      expect(
        calculateRoyalty(ETH_DEFAULT.decoded, 1_000_000_000_000n),
      ).to.deep.equal({
        address: ETH_DEFAULT.decoded.address,
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
      expect(primary[0].address).to.equal(SUB_PRIMARY_ONLY.decoded.address);
      expect(primary[0].amount).to.equal(255_000_00000n);

      const secondary = calculateRoyalties(
        ROYALTY_DECODED,
        false,
        1_000_000_000_000n,
      );

      expect(secondary.length).to.equal(1);
      expect(secondary[0].address).to.equal(ETH_DEFAULT.decoded.address);
      expect(secondary[0].amount).to.equal(150_00000n);
    });
  });

  describe('LibPart adapter', () => {
    it('to LibPart', () => {
      const sample = ETH_DEFAULT.decoded;
      const expected = { account: ETH_DEFAULT.decoded.address };

      const getValueFor = (decimals: number, value: bigint) =>
        toLibPart({ ...ETH_DEFAULT.decoded, decimals, value }).value;

      expect(getValueFor(0, 1n)).to.equal(10000n);
      expect(getValueFor(2, 1n)).to.equal(100n);
      expect(getValueFor(4, 1n)).to.equal(1n);
      expect(getValueFor(6, 100n)).to.equal(1n);
      expect(getValueFor(6, 1n)).to.equal(0n);
      expect(getValueFor(7, 1000n)).to.equal(1n);
    });

    it('from LibPart', () => {
      expect(
        fromLibPart({ account: ETH_DEFAULT.decoded.address, value: 1n }),
      ).to.deep.equal({
        ...ETH_DEFAULT.decoded,
        decimals: 4,
        value: 1n,
      });
    });
  });
});
