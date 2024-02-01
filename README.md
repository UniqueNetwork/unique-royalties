## Disclaimer

This repo will be archived after v2 schemas release in [@unique-nft/unique_schemas](https://github.com/UniqueNetwork/unique_schemas)
and [@unique-nft/solidity-interfaces](https://github.com/UniqueNetwork/solidity-interfaces) respectively.


### Contracts

- [UniqueRoyalty.sol](./contracts/UniqueRoyalty.sol) - core decoding/encoding logic library
- [UniqueRoyaltyHelper.sol](./contracts/UniqueRoyaltyHelper.sol) - helper contract to decode/encode royalty data, transform, calculate royalty amount etc

### Typescript implementation of the library located - [here](./src)

### To check everything is working

```shell
yarn

yarn test
```

### To deploy

```shell
yarn

echo "PRIVATE_KEY=<your_private_key>" > .env

yarn check:balances

yarn deploy:everywhere
```
### ToDo

- add to [@unique-nft/schemas](https://www.npmjs.com/package/@unique-nft/schemas)
- add to [@unique-nft/solidity-interfaces](https://www.npmjs.com/package/@unique-nft/solidity-interfaces)
