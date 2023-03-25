import { expect } from 'chai';
import { encodeRoyaltyPart, decodeRoyaltyPart } from '../unique-royalties';
import { ETH_SECONDARY, SUB_PRIMARY } from './_samples';
import {
  expectRoyaltyPartStruct,
  getContract,
  logGasDiff,
  structFromRoyaltyPart,
} from './_util';
import { Ethereum } from '@unique-nft/utils/extension';

describe.only('TS implementation', () => {
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

describe.only('Solidity implementation', () => {
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

describe.only('Gas prices', () => {
  it('encoding', async () => {
    const { contract } = await getContract();

    const dummyTx = await contract.emitDummyEncoded();

    const dummyReceipt = Ethereum.parseEthersTxReceipt(await dummyTx.wait());

    const realTx = await contract.encodePartAndEmit(
      structFromRoyaltyPart(SUB_PRIMARY.decoded),
    );

    const realReceipt = Ethereum.parseEthersTxReceipt(await realTx.wait());

    logGasDiff('encoding', { dummyReceipt, realReceipt });

    expect(realReceipt.gasUsed).to.gt(dummyReceipt.gasUsed);
  });

  it('decoding', async () => {
    const { contract } = await getContract();

    const dummyTx = await contract.emitDummyDecoded();

    const dummyReceipt = Ethereum.parseEthersTxReceipt(await dummyTx.wait());

    const realTx = await contract.decodePartAndEmit(SUB_PRIMARY.encoded);

    const realReceipt = Ethereum.parseEthersTxReceipt(await realTx.wait());

    logGasDiff('decoding', { dummyReceipt, realReceipt });

    expect(realReceipt.gasUsed).to.gt(dummyReceipt.gasUsed);
  });
});
