import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';

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

const COLLECTION_HELPERS_ADDRESS = '0x6C4E9fE1AE37a41E93CEE429e8E1881aBdcbb54F';

export async function helperTestingFixture() {
  const collectionHelpersCode = await ethers.provider.getCode(
    COLLECTION_HELPERS_ADDRESS,
  );

  const UniqueRoyaltyHelper = await ethers.getContractFactory(
    'UniqueRoyaltyHelper',
  );

  const uniqueRoyaltyHelper = await UniqueRoyaltyHelper.deploy();

  if (!collectionHelpersCode || collectionHelpersCode === '0x') {
    const CollectionMock = await ethers.getContractFactory('CollectionMock');
    const collection = await CollectionMock.deploy();

    return { collection, uniqueRoyaltyHelper };
  }

  return { uniqueRoyaltyHelper };
}
