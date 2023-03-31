import { Address } from '@unique-nft/utils/address';

// todo: split into separate files

export enum RoyaltyType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export const ROYALTIES_PROPERTY = 'royalties';

export interface UniqueRoyaltyPart {
  version: number;
  decimals: number;
  value: bigint;
  royaltyType: RoyaltyType | `${RoyaltyType}`;
  address: string;
}

type UniqueRoyaltyPartNoBigint = Omit<UniqueRoyaltyPart, 'value'> & {
  value: number;
};

const ZEROS = ''.padStart(42, '0');

export const validateRoyaltyPart = (
  part: UniqueRoyaltyPart | UniqueRoyaltyPartNoBigint,
): void => {
  if (1 > part.version || part.version > 127) {
    throw new Error(`Version must be between 1 and 127, got ${part.version}`);
  }

  if (!Number.isInteger(part.version)) {
    throw new Error(`Version must be an integer, got ${part.version}`);
  }

  if (0 > part.decimals || part.decimals > 255) {
    throw new Error(`Decimals must be between 0 and 255, got ${part.decimals}`);
  }

  if (!Number.isInteger(part.decimals)) {
    throw new Error(`Decimals must be an integer, got ${part.decimals}`);
  }

  if (1 > part.value || part.value > 18446744073709551615n) {
    throw new Error(
      `Value must be between 1 and 18446744073709551615 (uint64), got ${part.value}`,
    );
  }

  if (!RoyaltyType[part.royaltyType]) {
    throw new Error(
      `Royalty type must be one of ${Object.keys(RoyaltyType)}, got ${
        part.royaltyType
      }`,
    );
  }

  if (
    !Address.is.ethereumAddress(part.address) &&
    !Address.is.substrateAddress(part.address)
  ) {
    throw new Error(
      `Address must be a valid ethereum or substrate address, got ${part.address}`,
    );
  }
};

const encodeAddress = (address: string): [boolean, string] => {
  if (Address.is.ethereumAddress(address)) {
    return [
      true,
      Address.normalize
        .ethereumAddress(address)
        .substring(2)
        .padStart(64, '0')
        .toLowerCase(),
    ];
  }

  return [false, Address.substrate.decode(address).hex.substring(2)];
};

/**
 * encodes a UniqueRoyaltyPart into a hex string
 * @param part UniqueRoyaltyPart
 * @returns hex string where first 64 characters are metadata in format:
 * VV000000000000000000000000000000000000000000RADDvvvvvvvvvvvvvvvv
 * where:
 * VV - version
 * 42 zeros
 * R - royalty type (0 - primary, 1 - secondary)
 * A - address type (0 - ethereum, 1 - substrate)
 * DD - decimals
 * vvvvvvvvvvvvvvvvvv - value (uint64)
 *
 * and the rest of the string is the address encoded as hex
 */
export const encodeRoyaltyPart = (
  part: UniqueRoyaltyPart | UniqueRoyaltyPartNoBigint,
): string => {
  validateRoyaltyPart(part);

  const version = part.version.toString(16).padStart(2, '0');
  const royaltyType = part.royaltyType === RoyaltyType.PRIMARY ? '0' : '1';
  const decimals = part.decimals.toString(16).padStart(2, '0');

  const value = part.value.toString(16).padStart(16, '0');

  const [isEthereum, address] = encodeAddress(part.address);
  const addressType = isEthereum ? '0' : '1';

  return `0x${version}${ZEROS}${royaltyType}${addressType}${decimals}${value}${address}`;
};

export const decodeRoyaltyPart = (encoded: string): UniqueRoyaltyPart => {
  const encodedMeta = encoded.slice(2, 66);
  const encodedAddress = encoded.slice(2 + 64);

  const version = parseInt(encodedMeta.slice(0, 2), 16);
  const decimals = parseInt(encodedMeta.slice(46, 46 + 2), 16);
  const value = BigInt('0x' + encodedMeta.slice(48));
  const royaltyType =
    encodedMeta[44] === '0' ? RoyaltyType.PRIMARY : RoyaltyType.SECONDARY;

  const isEthereum = encodedMeta[45] === '0';
  const address = isEthereum
    ? '0x' + encodedAddress.slice(24)
    : Address.substrate.encode(encodedAddress);

  return {
    version,
    decimals,
    value,
    royaltyType,
    address,
  };
};

export const encodeRoyalty = (
  parts: (UniqueRoyaltyPart | UniqueRoyaltyPartNoBigint)[],
): string =>
  '0x' + parts.map((part) => encodeRoyaltyPart(part).substring(2)).join('');

const splitStringEvery = (str: string, every: number): string[] => {
  const result = [];

  for (let i = 0; i < str.length; i += every) {
    result.push(str.substring(i, i + every));
  }

  return result;
};

export const decodeRoyalty = (encoded: string): UniqueRoyaltyPart[] => {
  const parts = splitStringEvery(encoded.substring(2), 128).map(
    (encoded) => '0x' + encoded,
  );

  return parts.map((part) => decodeRoyaltyPart(part));
};

type RoyaltyAmount = {
  address: string;
  amount: bigint;
};

export const calculateAmount = (
  value: bigint,
  decimals: number,
  sellPrice: bigint,
): bigint => (sellPrice * value) / 10n ** (BigInt(decimals) + 2n);

export const calculateRoyalty = (
  royalty: UniqueRoyaltyPart,
  sellPrice: bigint,
): RoyaltyAmount => ({
  address: royalty.address,
  amount: calculateAmount(royalty.value, royalty.decimals, sellPrice),
});

export const calculateRoyalties = (
  royalties: UniqueRoyaltyPart[],
  sellPrice: bigint,
): RoyaltyAmount[] => royalties.map((r) => calculateRoyalty(r, sellPrice));
