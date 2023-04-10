import { ethers } from 'hardhat';

async function main() {
  const UniqueRoyaltyHelper = await ethers.getContractFactory(
    'UniqueRoyaltyHelper',
  );

  const uniqueRoyaltyHelper = await UniqueRoyaltyHelper.deploy();

  console.log('UniqueRoyaltyHelper deployed to:', uniqueRoyaltyHelper.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
