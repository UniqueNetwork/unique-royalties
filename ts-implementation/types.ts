export enum RoyaltyType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export interface UniqueRoyaltyPart {
  version: number;
  decimals: number;
  value: bigint;
  royaltyType: RoyaltyType | `${RoyaltyType}`;
  address: string;
}

type UniqueRoyalty = Array<UniqueRoyaltyPart>;

export type UniqueRoyaltyPartNoBigint = Omit<UniqueRoyaltyPart, 'value'> & {
  value: number;
};

export type RoyaltyAmount = {
  address: string;
  amount: bigint;
};

export type LibPart = {
  account: string;
  value: bigint;
};
