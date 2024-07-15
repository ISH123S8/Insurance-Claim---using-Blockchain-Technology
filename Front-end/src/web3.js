import Web3 from "web3";

// Instantiate Web3 with Remix's injected provider
const web3 = new Web3(window.ethereum);

// Enable request account function if the provider supports it (Remix does)
window.ethereum.enable();

export default web3;
