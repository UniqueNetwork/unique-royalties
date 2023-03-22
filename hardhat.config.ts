import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    // settings: {
    //   metadata: {
    //     // Not including the metadata hash
    //     // https://github.com/paulrberg/solidity-template/issues/31
    //     bytecodeHash: "none",
    //   },
    //   optimizer: {
    //     enabled: true,
    //     runs: 800,
    //   },
    //   viaIR : true,
    // },
  },
  networks: {
    hardhat: {},
  },
};

export default config;
