const solc = require("solc");
const fs = require("fs");
const { Web3 } = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
const file = fs.readFileSync("PaymentGateway.sol").toString();

var input = {
  language: "Solidity",
  sources: {
    "PaymentGateway.sol": {
      content: file,
    },
  },

  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output);
const ABI = output.contracts["PaymentGateway.sol"]["PaymentGateway"].abi;
const bytecode =
  output.contracts["PaymentGateway.sol"]["PaymentGateway"].evm.bytecode.object;
const contract = new web3.eth.Contract(ABI);
web3.eth.getAccounts().then((accounts) => {
  console.log("Accounts:", accounts);

  mainAccount = accounts[0];

  console.log("Default Account:", mainAccount);
  contract
    .deploy({ data: bytecode })
    .send({ from: mainAccount, gas: 470000 })
    .on("receipt", (receipt) => {
      console.log("Contract Address:", receipt.contractAddress);
    });
  // .then((initialContract) => {
  //   initialContract.methods.message().call((err, data) => {
  //     console.log("Initial Data:", data);
  //   });
  // });
});
