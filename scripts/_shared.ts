import { opalRc, opal, quartz, uniqsu, unique } from '../hardhat.config';

export type BalanceData = {
  name: string;
  balance: bigint;
  gasPrice: bigint;
  nonce: number;
};

export const networks = {
  uniqsu,
  opalRc,
  opal,
  quartz,
  unique,
};

export type NetworksData = Partial<Record<keyof typeof networks, BalanceData>>;
