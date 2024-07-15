import web3 from "./web3";

const address = " your key address";

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_labAdmin",
        type: "address",
      },
      {
        internalType: "address",
        name: "_insuranceAdmin",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "ID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "claimProcessed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "ID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "patient",
        type: "address",
      },
    ],
    name: "claimSubmitted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_date",
        type: "string",
      },
      {
        internalType: "string",
        name: "hName",
        type: "string",
      },
    ],
    name: "newRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ID",
        type: "uint256",
      },
    ],
    name: "processClaim",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "ID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "testName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "date",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "hospitalName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "recordCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "ID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "testName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "date",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "hospitalName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "recordSigned",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ID",
        type: "uint256",
      },
    ],
    name: "signRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ID",
        type: "uint256",
      },
    ],
    name: "submitClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "_records",
    outputs: [
      {
        internalType: "uint256",
        name: "ID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "signatureCount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "testName",
        type: "string",
      },
      {
        internalType: "string",
        name: "date",
        type: "string",
      },
      {
        internalType: "string",
        name: "hospitalName",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isValue",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "hospitalApproved",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "labApproved",
        type: "bool",
      },
      {
        internalType: "address",
        name: "pAddr",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hospitalAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "insuranceAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "labAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "recordsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default new web3.eth.Contract(abi, address);
