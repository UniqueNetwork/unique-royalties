import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";

const config: HardhatUserConfig = {
  paths: {
    sources: './contracts-new',
  },
  solidity: {
    version: "0.8.18",
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
