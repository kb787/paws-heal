const dotenv = require("dotenv");
dotenv.config();
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

module.exports = PaymentGateway;
