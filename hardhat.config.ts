import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-gas-reporter';

const config: HardhatUserConfig = {
  paths: {
    tests: './tests',
  },
  solidity: {
    version: '0.8.19',
  },
  gasReporter: {
    // enabled: true,
    currency: 'USD',
    gasPrice: 1017,
  },
  networks: {
    hardhat: {},
  },
};

export default config;
