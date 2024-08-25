require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: process.env.ganache_server,
      accounts: {
        mnemonic: process.env.my_smart_contract_mnemonic, // Replace with your actual mnemonic
      },
    },
  },
};
