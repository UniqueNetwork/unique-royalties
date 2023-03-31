## Disclaimer

This repo will be archived after v2 schemas release in [@unique-nft/unique_schemas](https://github.com/UniqueNetwork/unique_schemas)
and [@unique-nft/solidity-interfaces](https://github.com/UniqueNetwork/solidity-interfaces) respectively.


### Contracts

- [UniqueRoyalty.sol](./contracts/UniqueRoyalty.sol) - core decoding/encoding logic library
- [UniqueRoyaltyHelper.sol](./contracts/UniqueRoyaltyHelper.sol) - helper contract to decode/encode royalty data, transform, calculate royalty amount etc

### Typescript implementation of the library located - [here](./ts-implementation)

### To check everything is working

```shell
yarn

yarn test
```

### To deploy

TBD

### ToDo

- deal with deployment to all unique chains
- add [ERC-2981](https://eips.ethereum.org/EIPS/eip-2981) adapter or smth
- add to [@unique-nft/schemas](https://www.npmjs.com/package/@unique-nft/schemas)
- add to [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces)
