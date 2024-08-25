const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const contractAddress = process.env.my_contract_address;
const { PaymentGateway } = require("../helpers/payment-gateway");
async function getContractInstance() {
  return await PaymentGateway.at(contractAddress);
}

const handleDepositTransaction = async (req, res) => {
  try {
    const { account, amount } = req.body;
    if (!account || !amount) {
      return res.json({
        message: "Entering account no and amount is mandatory",
        status: 404,
      });
    }
    const contract = await getContractInstance();
    const result = await contract.deposit({
      account,
      value: web3.utils.toWei(amount, "ether"),
    });
    res.json({
      message: `Amount:${amount} has been deposited successfully for account ${account}`,
      success: true,
      transactionHash: result.tx,
      status: 201,
    });
  } catch (error) {
    return res.json({ message: "Server side error occured", status: 500 });
  }
};

const handleWithdrawTransaction = async (req, res) => {
  try {
    const { account, amount } = req.body;
    if (!account || !amount) {
      return res.json({
        message: "Entering account no and amount is mandatory",
        status: 404,
      });
    }
    const contract = await getContractInstance();
    const result = await contract.withdraw(web3.utils.toWei(amount, "ether"), {
      account,
    });
    res.json({
      message: `Amount:${amount} has been withdrawn successfully for account ${account}`,
      success: true,
      transactionHash: result.tx,
      status: 201,
    });
  } catch (error) {
    return res.json({ message: "Server side error occured", status: 500 });
  }
};

const handleViewBalance = async (req, res) => {
  try {
    const { address } = req.params;
    if (!address) {
      return res.json({
        message: "Providing address details is mandatory",
        status: 404,
      });
    }
    const contract = await getContractInstance();
    const balance = await contract.balances(address);
    res.json({ success: true, balance: web3.utils.fromWei(balance, "ether") });
  } catch (error) {
    return res.json({ message: "Server side error occured", status: 500 });
  }
};

const depositRouter = express.Router();
depositRouter.post("/deposit-transaction", handleDepositTransaction);
const withdrawRouter = express.Router();
withdrawRouter.post("/withdraw-transaction", handleWithdrawTransaction);
const balanceRouter = express.Router();
balanceRouter.get("/view-balance/:address", handleViewBalance);

module.exports = {
  depositRouter: depositRouter,
  withdrawRouter: withdrawRouter,
  balanceRouter: balanceRouter,
};
