export const crossAddressTypes = [
    {
        name: "eth",
        type: "address",
    },
    {
        name: "sub",
        type: "uint256",
    },
];

export const uniqueRoyaltyPartTypes = [
    {
        components: crossAddressTypes,
        name: "crossAddress",
        type: "tuple",
    },
    {
        name: "value",
        type: "uint32",
    },
];

export const uniqueRoyaltyTypes = [
    {
        name: "version",
        type: "uint16",
    },
    {
        name: "decimals",
        type: "uint8",
    },
    {
        components: uniqueRoyaltyPartTypes,
        name: "primary",
        type: "tuple[]",
    },
    {
        components: uniqueRoyaltyPartTypes,
        name: "secondary",
        type: "tuple[]",
    },
];
