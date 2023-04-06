import { ethers } from 'hardhat';
import { networks, NetworksData } from './_shared';

const getDeployEstimateGas = async (): Promise<bigint> => {
  const UniqueRoyaltyHelper = await ethers.getContractFactory(
    'UniqueRoyaltyHelper',
  );

  const deployTx = await UniqueRoyaltyHelper.getDeployTransaction();

  const deployEstimateGas = await ethers.provider.estimateGas(deployTx);

  return deployEstimateGas.toBigInt();
};

async function getNetworksData(): Promise<NetworksData> {
  const [signer] = await ethers.getSigners();

  const networksData: NetworksData = {};

  for (const [name, network] of Object.entries(networks)) {
    const provider = new ethers.providers.JsonRpcProvider(network.url);

    const balance = (await provider.getBalance(signer.address)).toBigInt();
    const gasPrice = (await provider.getGasPrice()).toBigInt();
    const nonce = await provider.getTransactionCount(signer.address);
    const decimals = await provider
      .getNetwork()
      .then((network) => (network.chainId === 1 ? 18 : 6));

    networksData[name as keyof typeof networks] = {
      name,
      balance,
      gasPrice,
      nonce,
    };
  }

  return networksData;
}

const checkNoncesEqual = (networksData: NetworksData): void => {
  const nonces = Object.values(networksData)
    .filter((networkData) => networkData !== undefined)
    .map((networkData) => networkData.nonce);

  if (nonces.length > 0 && !nonces.every((nonce) => nonce === nonces[0])) {
    throw new Error(`Nonces are not equal: ${nonces.join(', ')}`);
  }
};

const checkBalancesOk = (
  networksData: NetworksData,
  deployEstimateGas: bigint,
): void => {
  Object.values(networksData).forEach((networkData) => {
    const deployPrice = networkData.gasPrice * deployEstimateGas;
    const deployPriceEth = ethers.utils.formatEther(deployPrice);

    if (networkData.balance < deployEstimateGas * networkData.gasPrice) {
      throw new Error(
        `Not enough balance on ${networkData.name}: ${deployPriceEth} min needed`,
      );
    }
  });
};

async function main() {
  const deployEstimateGas = await getDeployEstimateGas();
  const networksData = await getNetworksData();

  console.dir({ deployEstimateGas, networksData }, { depth: null });

  checkNoncesEqual(networksData);
  checkBalancesOk(networksData, deployEstimateGas);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
