import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { Ethereum } from '@unique-nft/utils/extension';

import {
  CollectionHelpersFactory,
  UniqueNFTFactory,
  constants,
  UniqueNFT,
} from '@unique-nft/solidity-interfaces';
import { Contract } from 'ethers';

export async function loadFixtureOrDeploy<T>(
  fixture: () => Promise<T>,
): Promise<T> {
  try {
    return await loadFixture(fixture);
  } catch (e) {
    return fixture();
  }
}

export async function libTestingFixture() {
  const TestingContract = await ethers.getContractFactory('TestingContract');

  const contract = await TestingContract.deploy();

  return { contract };
}

export async function helperTestingFixture() {
  const collectionHelpersCode = await ethers.provider.getCode(
    constants.STATIC_ADDRESSES.collectionHelpers,
  );

  const UniqueRoyaltyHelper = await ethers.getContractFactory(
    'UniqueRoyaltyHelper',
  );

  const uniqueRoyaltyHelper = await UniqueRoyaltyHelper.deploy();

  if (collectionHelpersCode && collectionHelpersCode !== '0x') {
    const [signer] = await ethers.getSigners();

    // @ts-ignore - remove after ethers update
    const collectionHelpers = await CollectionHelpersFactory(signer, ethers);

    const collectionTx = await collectionHelpers.createNFTCollection(
      'Test',
      'test',
      'TST',
      { value: await collectionHelpers.collectionCreationFee() },
    );

    const parsed = Ethereum.parseEthersTxReceipt<{
      CollectionCreated: { collectionId: string };
    }>(await collectionTx.wait());

    const collection = (await UniqueNFTFactory(
      parsed.events.CollectionCreated.collectionId,
      // @ts-ignore - remove after ethers update
      signer,
      ethers,
    )) as UniqueNFT & Contract;

    await (await collection.mint(signer.address)).wait();

    return { collection, uniqueRoyaltyHelper };
  }

  const CollectionMock = await ethers.getContractFactory('CollectionMock');
  const collection = await CollectionMock.deploy();

  return { collection, uniqueRoyaltyHelper };
}
