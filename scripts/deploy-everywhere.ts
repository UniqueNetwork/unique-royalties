import { ethers } from 'hardhat';
import { networks } from './_shared';

async function main() {
  const UniqueRoyaltyHelper = await ethers.getContractFactory(
    'UniqueRoyaltyHelper',
  );

  for (const [name, network] of Object.entries(networks)) {
    const provider = new ethers.providers.JsonRpcProvider(network.url);
    const wallet = new ethers.Wallet(network.accounts[0], provider);

    const uniqueRoyaltyHelper = await UniqueRoyaltyHelper.connect(
      wallet,
    ).deploy();

    console.log(
      `Deployed UniqueRoyaltyHelper to ${uniqueRoyaltyHelper.address} on ${name}`,
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
