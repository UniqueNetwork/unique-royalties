import { ETH_SECONDARY, ROYALTY_ENCODED, SUB_PRIMARY } from './_samples';
import { expect } from 'chai';
import { helperTestingFixture, loadFixtureOrDeploy } from './_fixtures';
import { structFromRoyaltyPart } from './_util';
import {
  calculateRoyalty,
  toLibPart,
  ROYALTIES_PROPERTY,
} from '../ts-implementation';
import { Address } from '@unique-nft/utils/address';

describe('UniqueRoyaltyHelper', () => {
  const deploy = loadFixtureOrDeploy(helperTestingFixture);

  const getAllRoyalties = async (collection, uniqueRoyaltyHelper) => {
    const collectionRoyalty = await uniqueRoyaltyHelper.getCollectionRoyalty(
      collection.address,
    );

    const tokenRoyalty = await uniqueRoyaltyHelper.getTokenRoyalty(
      collection.address,
      1,
    );

    const royalty = await uniqueRoyaltyHelper.getRoyalty(collection.address, 1);

    return { collectionRoyalty, tokenRoyalty, royalty };
  };

  it('Collection and tokens royalties', async function () {
    this.timeout(120_000);

    const { collection, uniqueRoyaltyHelper } = await deploy;

    let allRoyalties = await getAllRoyalties(collection, uniqueRoyaltyHelper);
    expect(allRoyalties.collectionRoyalty.length).to.equal(0);
    expect(allRoyalties.tokenRoyalty.length).to.equal(0);
    expect(allRoyalties.royalty.length).to.equal(0);

    await (
      await collection.setCollectionProperties([
        { key: ROYALTIES_PROPERTY, value: ROYALTY_ENCODED },
      ])
    ).wait();

    allRoyalties = await getAllRoyalties(collection, uniqueRoyaltyHelper);

    expect(allRoyalties.collectionRoyalty.length).to.equal(2);
    expect(allRoyalties.royalty).to.deep.equal(allRoyalties.collectionRoyalty);
    expect(allRoyalties.tokenRoyalty.length).to.equal(0);

    await (
      await collection.setTokenPropertyPermissions([
        { key: ROYALTIES_PROPERTY, permissions: [{ code: 2, value: true }] },
      ])
    ).wait();

    const setTokenPropsTx = await collection.setProperties(1, [
      { key: ROYALTIES_PROPERTY, value: SUB_PRIMARY.encoded },
    ]);

    allRoyalties = await getAllRoyalties(collection, uniqueRoyaltyHelper);

    expect(allRoyalties.collectionRoyalty.length).to.equal(2);
    expect(allRoyalties.tokenRoyalty.length).to.equal(1);
    expect(allRoyalties.royalty).to.deep.equal(allRoyalties.tokenRoyalty);
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

    const [sub, ...restPrimary] = await uniqueRoyaltyHelper.calculateRoyalties(
      asStruct,
      true,
      sellPrice,
    );

    expect(restPrimary.length).to.equal(0);

    const [eth, ...restSecondary] =
      await uniqueRoyaltyHelper.calculateRoyalties(asStruct, false, sellPrice);

    expect(restSecondary.length).to.equal(0);

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
