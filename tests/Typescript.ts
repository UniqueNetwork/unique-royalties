import { decodeRoyaltyPart, encodeRoyaltyPart } from '../unique-royalties';
import { ETH_SECONDARY, SUB_PRIMARY } from './_samples';
import { expect } from 'chai';

describe('TS implementation', () => {
  it('encode - sub - primary', async () => {
    const encoded = encodeRoyaltyPart(SUB_PRIMARY.decoded);
    expect(encoded).to.equal(SUB_PRIMARY.encoded);
  });

  it('encode - eth - secondary', async () => {
    const encoded = encodeRoyaltyPart(ETH_SECONDARY.decoded);
    expect(encoded).to.equal(ETH_SECONDARY.encoded);
  });

  it('decode - sub - primary', async () => {
    const decoded = decodeRoyaltyPart(SUB_PRIMARY.encoded);
    expect(decoded).to.deep.equal(SUB_PRIMARY.decoded);
  });

  it('decode - eth - secondary', async () => {
    const decoded = decodeRoyaltyPart(ETH_SECONDARY.encoded);
    expect(decoded).to.deep.equal(ETH_SECONDARY.decoded);
  });
});
