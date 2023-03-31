import { ROYALTY_ENCODED, SUB_PRIMARY } from './_samples';
import { expect } from 'chai';
import { helperTestingFixture, loadFixtureOrDeploy } from './_fixtures';
import { ROYALTIES_PROPERTY } from '../unique-royalties';

describe('UniqueRoyaltyHelper', () => {
  const deploy = loadFixtureOrDeploy(helperTestingFixture);

  it('Collection and tokens royalties', async function () {
    const { collection, uniqueRoyaltyHelper } = await deploy;

    let collectionRoyalty;
    let tokenRoyalty;
    let royalty;

    const refreshRoyalties = async () => {
      collectionRoyalty = await uniqueRoyaltyHelper.getCollectionRoyalty(
        collection.address,
      );

      tokenRoyalty = await uniqueRoyaltyHelper.getTokenRoyalty(
        collection.address,
        1,
      );

      royalty = await uniqueRoyaltyHelper.getRoyalty(collection.address, 1);
    };

    await refreshRoyalties();

    expect(collectionRoyalty.length).to.equal(0);
    expect(tokenRoyalty.length).to.equal(0);
    expect(royalty.length).to.equal(0);

    await collection.setCollectionProperties([
      {
        key: ROYALTIES_PROPERTY,
        value: ROYALTY_ENCODED,
      },
    ]);

    await refreshRoyalties();

    expect(collectionRoyalty.length).to.equal(2);
    expect(royalty).to.deep.equal(collectionRoyalty);

    expect(tokenRoyalty.length).to.equal(0);

    await collection.setProperties(1, [
      {
        key: ROYALTIES_PROPERTY,
        value: SUB_PRIMARY.encoded,
      },
    ]);

    await refreshRoyalties();

    expect(collectionRoyalty.length).to.equal(2);
    expect(tokenRoyalty.length).to.equal(1);
    expect(royalty).to.deep.equal(tokenRoyalty);
  });
});
