import { UniqueRoyaltyPart } from '../unique-royalties';

type Sample = {
  decoded: UniqueRoyaltyPart;
  encoded: string;
};

export const ETH_SECONDARY: Sample = {
  decoded: {
    version: 1,
    decimals: 6,
    value: 15n,
    royaltyType: 'SECONDARY',
    address: '0x1234a38988dd5ecc93dd9ce90a44a00e5fb91e4c',
  },
  encoded:
    '0x' +
    '010000000000000000000000000000000000000000001006000000000000000f' +
    '0000000000000000000000001234a38988dd5ecc93dd9ce90a44a00e5fb91e4c',
};

export const SUB_PRIMARY: Sample = {
  decoded: {
    version: 1,
    decimals: 4,
    value: 255n,
    royaltyType: 'PRIMARY',
    address: '5D7WxWqqUYNm962RUNdf1UTCcuasXCigHFMGG4hWX6hkp7zU',
  },
  encoded:
    '0x' +
    // 'VV000000000000000000000000000000000000000000RAddvvvvvvvvvvvvvvvv'
    '01000000000000000000000000000000000000000000010400000000000000ff' +
    '2e61479a581f023808aaa5f2ec90be6c2b250102d99d788bde3c8d4153a0ed08',
};
