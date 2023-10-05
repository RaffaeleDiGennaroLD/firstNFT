require("dotenv").config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
console.log(JSON.stringify(contract.abi));
const contractAddress = CONTRACT_ADDRESS;

const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI, amount) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");

  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    value: amount,
  };

  try {
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const { rawTransaction } = signedTx;
    web3.eth.sendSignedTransaction(rawTransaction, (err, hash) => {
      if (!err) {
        console.log(
          "The hash of your transaction is: ",
          hash,
          "\nCheck Alchemy's Mempool to view the status of your transaction!"
        );
      } else {
        console.log(
          "Something went wrong when submitting your transaction:",
          err
        );
      }
    });
  } catch (err) {
    console.log("Promise failed:", err);
  }
}

mintNFT("ipfs://QmUdfub2VLJFkeEtx6BgwLXu882zfZnZjTnNc1pKK8MHSn", 1);
