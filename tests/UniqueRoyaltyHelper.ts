import { ETH_SECONDARY, ROYALTY_ENCODED, SUB_PRIMARY } from './_samples';
import { expect } from 'chai';
import { helperTestingFixture, loadFixtureOrDeploy } from './_fixtures';
import { structFromRoyaltyPart } from './_util';
import {
  calculateRoyalty,
  toLibPart,
  ROYALTIES_PROPERTY,
} from '../unique-royalties';
import { Address } from '@unique-nft/utils/address';

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

  it('Validation', async function () {
    const { uniqueRoyaltyHelper } = await deploy;

    const ok = await Promise.all([
      uniqueRoyaltyHelper.validate(ROYALTY_ENCODED),
      uniqueRoyaltyHelper.validatePart(SUB_PRIMARY.encoded),
      uniqueRoyaltyHelper.validatePart(ETH_SECONDARY.encoded),
    ]);

    expect(ok.every((i) => i)).to.equal(true);

    const notOk = await Promise.all([
      uniqueRoyaltyHelper.validatePart(ROYALTY_ENCODED),
      uniqueRoyaltyHelper.validate(ETH_SECONDARY.encoded.substring(0, 10)),
    ]);

    expect(notOk.every((i) => !i)).to.equal(true);
  });

  it('Calculation', async function () {
    const { uniqueRoyaltyHelper } = await deploy;

    const sellPrice = 1_000_000_000_000n;

    const asStruct = [
      structFromRoyaltyPart(SUB_PRIMARY.decoded),
      structFromRoyaltyPart(ETH_SECONDARY.decoded),
    ];

    const [sub] = await uniqueRoyaltyHelper.calculateRoyalties(
      asStruct.slice(0, 1),
      sellPrice,
    );

    const [eth] = await uniqueRoyaltyHelper.calculateRoyalties(
      asStruct.slice(1, 2),
      sellPrice,
    );

    const both = await uniqueRoyaltyHelper.calculateRoyalties(
      asStruct,
      sellPrice,
    );

    expect(both[0]).to.deep.equal(sub);
    expect(both[1]).to.deep.equal(eth);

    expect(sub.crossAddress.sub).to.equal(
      Address.substrate.decode(SUB_PRIMARY.decoded.address).bigint,
    );

    expect(eth.crossAddress.eth.toLowerCase()).to.equal(
      ETH_SECONDARY.decoded.address,
    );

    expect(sub.amount.toBigInt()).to.equal(
      calculateRoyalty(SUB_PRIMARY.decoded, sellPrice).amount,
    );

    expect(eth.amount.toBigInt()).to.equal(
      calculateRoyalty(ETH_SECONDARY.decoded, sellPrice).amount,
    );
  });

  it('Transformation to Lib.Part', async () => {
    const { uniqueRoyaltyHelper } = await deploy;

    const asStruct = [
      structFromRoyaltyPart(SUB_PRIMARY.decoded),
      structFromRoyaltyPart(ETH_SECONDARY.decoded),
    ];

    const [subLibPart, ethLibPart] =
      await uniqueRoyaltyHelper.convertToLibParts(asStruct);

    const expectedSubLibPart = toLibPart(SUB_PRIMARY.decoded);
    const expectedEthLibPart = toLibPart(ETH_SECONDARY.decoded);

    expect(subLibPart.value.toBigInt()).to.equal(expectedSubLibPart.value);
    expect(subLibPart.account).to.equal(expectedSubLibPart.account);

    expect(ethLibPart.value.toBigInt()).to.equal(expectedEthLibPart.value);
    expect(ethLibPart.account.toLowerCase()).to.equal(
      expectedEthLibPart.account,
    );
  });
});
