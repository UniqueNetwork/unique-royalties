import { Address } from '@unique-nft/utils/address';
import { expect } from 'chai';

import { ETH_DEFAULT, SUB_PRIMARY_ONLY } from './_samples';
import { loadFixtureOrDeploy, libTestingFixture } from './_fixtures';

import { decodeRoyalty, fromLibParts } from '../src';

const structToLibPart = (struct: any) => ({
  account: struct.account,
  value: struct.value,
});

describe('LibPartAdapter', () => {
  const deploy = loadFixtureOrDeploy(libTestingFixture);

  const SAMPLES_ENCODED = [
    '01000000000000000000000000000000000000000000000400000000000004d20000000000000000000000001234a38988dd5ecc93dd9ce90a44a00e5fb91e4c',
    '01000000000000000000000000000000000000000000000400000000000010e10000000000000000000000002e61479a581f023808aaa5f2ec90be6c2b250102',
  ];

  const SAMPLES_DECODED = [
    { value: 1234n, account: ETH_DEFAULT.decoded.address },
    {
      value: 4321n,
      account: Address.mirror.substrateToEthereum(
        SUB_PRIMARY_ONLY.decoded.address,
      ),
    },
  ];

  it('encode', async () => {
    const { contract } = await deploy;

    const encoded = await contract.encodeLibPart(SAMPLES_DECODED);

    expect(encoded).to.equal('0x' + SAMPLES_ENCODED.join(''));

    const asUniqueRoyalties = decodeRoyalty(encoded);

    expect(asUniqueRoyalties).to.deep.equal(fromLibParts(SAMPLES_DECODED));
  });

  it('decode', async () => {
    const { contract } = await deploy;

    const decoded = await contract
      .decodeLibPart('0x' + SAMPLES_ENCODED.join(''))
      .then((d) => d.map(structToLibPart));

    expect(decoded).to.deep.equal(SAMPLES_DECODED);
  });
});
