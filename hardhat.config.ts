import { HardhatUserConfig, task } from 'hardhat/config';
import { HttpNetworkUserConfig } from 'hardhat/types/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-gas-reporter';
import { config as dotenvConfig } from 'dotenv';

const { PRIVATE_KEY, PRIVATE_KEY_2 } = dotenvConfig().parsed;

const accounts = [PRIVATE_KEY, PRIVATE_KEY_2];

export const opalDev: HttpNetworkUserConfig = {
  url: 'https://rpc-o.unq.uniq.su',
  chainId: 8882,
  accounts,
};

export const opal: HttpNetworkUserConfig = {
  url: 'https://rpc-opal.unique.network',
  chainId: 8882,
  accounts,
};

const config: HardhatUserConfig = {
  paths: {
    tests: './tests',
  },
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  gasReporter: {
    // enabled: true,
    currency: 'USD',
    gasPrice: 1017,
  },
  networks: {
    opal,
    opalDev,
    hardhat: {
      accounts: accounts.map((privateKey) => ({
        privateKey,
        balance: '10000000000000000000000',
      })),
    },
  },
};

task('check_accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const networks = Object.keys(hre.userConfig.networks);

  for (const network of networks) {
    console.log(`Network: ${network}`);
  }
});

export default config;
