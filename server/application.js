const solc = require("solc");
const fs = require("fs");
const { Web3 } = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
const file = fs.readFileSync("PaymentGateway.sol").toString();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const dotenv = require("dotenv");
dotenv.config();
const express_port_no = process.env.express_port;
const base_api = process.env.base_api;
app.use(express.json());
app.get("/", (req, res) => {
  return res.json("App running successfully");
});
const {
  depositRouter,
  withdrawRouter,
  balanceRouter,
} = require("./controllers/transaction-controllers");
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
app.use(base_api, depositRouter);
app.use(base_api, withdrawRouter);
app.use(base_api, balanceRouter);
var output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output);
const ABI = output.contracts["PaymentGateway.sol"]["PaymentGateway"].abi;
console.log(ABI);
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
const contractAddress = process.env.my_contract_address;
const PaymentGateway = {
  at: async function (contractAddress) {
    const contract = new web3.eth.Contract(ABI, contractAddress);

    return {
      deposit: async function ({ account, value }) {
        return await contract.methods
          .deposit()
          .send({ from: account, value: value });
      },

      withdraw: async function (amount, { account }) {
        return await contract.methods.withdraw(amount).send({ from: account });
      },

      balances: async function (contractAddress) {
        return await contract.methods.balances(contractAddress).call();
      },
    };
  },
};

server.listen(express_port_no, () => {
  console.log(`App is running successfully on port no ${express_port_no}`);
});
module.exports = {
  PaymentGateway,
};
