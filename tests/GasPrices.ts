import { expect } from 'chai';
import { ETH_DEFAULT, ROYALTY_ENCODED, SUB_PRIMARY_ONLY } from './_samples';
import { logGasDiff, structFromRoyaltyPart } from './_util';
import { Ethereum } from '@unique-nft/utils/extension';
import { ContractTransaction } from 'ethers';
import { libTestingFixture, loadFixtureOrDeploy } from './_fixtures';

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
  const deployed = loadFixtureOrDeploy(libTestingFixture);

  it('encoding part', async () => {
    const { contract } = await deployed;

    const dummyTx = await contract.emitDummyPartEncoded();

    const realTx = await contract.encodePartAndEmit(
      structFromRoyaltyPart(SUB_PRIMARY_ONLY.decoded),
    );

    await compare('encoding part', dummyTx, realTx);
  });

  it('decoding part', async () => {
    const { contract } = await deployed;

    const dummyTx = await contract.emitDummyPartDecoded();

    const realTx = await contract.decodePartAndEmit(SUB_PRIMARY_ONLY.encoded);

    await compare('decoding part', dummyTx, realTx);
  });

  it('encoding', async () => {
    const { contract } = await deployed;

    const dummyTx = await contract.emitDummyEncoded();

    const realTx = await contract.encodeAndEmit([
      structFromRoyaltyPart(SUB_PRIMARY_ONLY.decoded),
      structFromRoyaltyPart(ETH_DEFAULT.decoded),
    ]);

    await compare('encoding', dummyTx, realTx);
  });

  it('decoding', async () => {
    const { contract } = await deployed;

    const dummyTx = await contract.emitDummyDecoded();

    const realTx = await contract.decodeAndEmit(ROYALTY_ENCODED);

    await compare('decoding', dummyTx, realTx);
  });
});
