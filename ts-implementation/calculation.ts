import { RoyaltyAmount, UniqueRoyaltyPart } from './types';

export const calculateAmount = (
  value: bigint,
  decimals: number,
  sellPrice: bigint,
): bigint => (sellPrice * value) / 10n ** BigInt(decimals);

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
