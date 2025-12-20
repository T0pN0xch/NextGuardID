require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28", // Change from 0.8.19 to 0.8.28
  networks: {
    hardhat: {},
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80002,
    }
  }
};