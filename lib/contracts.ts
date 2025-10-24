export const REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`

export const REGISTRY_ABI = [
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "users",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint256", name: "points", type: "uint256" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const


