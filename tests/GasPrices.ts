import { expect } from 'chai';
import { ETH_SECONDARY, ROYALTY_ENCODED, SUB_PRIMARY } from './_samples';
import { getContract, logGasDiff, structFromRoyaltyPart } from './_util';
import { Ethereum } from '@unique-nft/utils/extension';
import { ContractTransaction } from 'ethers';

const compare = async (
  name: string,
  dummyTx: ContractTransaction,
  realTx: ContractTransaction,
) => {
  const dummyReceipt = Ethereum.parseEthersTxReceipt(await dummyTx.wait());
  const realReceipt = Ethereum.parseEthersTxReceipt(await realTx.wait());

  logGasDiff(name, { dummyReceipt, realReceipt });

  expect(realReceipt.gasUsed).to.gt(dummyReceipt.gasUsed);
};

describe('Gas prices', () => {
  it('encoding part', async () => {
    const { contract } = await getContract();

    const dummyTx = await contract.emitDummyPartEncoded();

    const realTx = await contract.encodePartAndEmit(
      structFromRoyaltyPart(SUB_PRIMARY.decoded),
    );

    await compare('encoding part', dummyTx, realTx);
  });

  it('decoding part', async () => {
    const { contract } = await getContract();

    const dummyTx = await contract.emitDummyPartDecoded();

    const realTx = await contract.decodePartAndEmit(SUB_PRIMARY.encoded);

    await compare('decoding part', dummyTx, realTx);
  });

  it('encoding', async () => {
    const { contract } = await getContract();

    const dummyTx = await contract.emitDummyEncoded();

    const realTx = await contract.encodeAndEmit([
      structFromRoyaltyPart(SUB_PRIMARY.decoded),
      structFromRoyaltyPart(ETH_SECONDARY.decoded),
    ]);

    await compare('encoding', dummyTx, realTx);
  });

  it('decoding', async () => {
    const { contract } = await getContract();

    const dummyTx = await contract.emitDummyDecoded();

    const realTx = await contract.decodeAndEmit(ROYALTY_ENCODED);

    await compare('decoding', dummyTx, realTx);
  });
});
