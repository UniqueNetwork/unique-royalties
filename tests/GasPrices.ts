import { expect } from 'chai';
import { SUB_PRIMARY } from './_samples';
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
  it('encoding', async () => {
    const { contract } = await getContract();

    const dummyTx = await contract.emitDummyEncoded();

    const realTx = await contract.encodePartAndEmit(
      structFromRoyaltyPart(SUB_PRIMARY.decoded),
    );

    await compare('encoding', dummyTx, realTx);
  });

  it('decoding', async () => {
    const { contract } = await getContract();

    const dummyTx = await contract.emitDummyDecoded();

    const realTx = await contract.decodePartAndEmit(SUB_PRIMARY.encoded);

    await compare('decoding', dummyTx, realTx);
  });
});
