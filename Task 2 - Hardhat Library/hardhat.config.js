require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { ETHERSCAN_API_KEY, ALCHEMY_API_KEY, GOERLI_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${GOERLI_PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};

task("deploy-testnets", "Deploys contract on a provided network")
    .setAction(async () => {
        const deployLibraryContract = require("./scripts/deploy");
        await deployLibraryContract();
    });

    subtask("print", "Prints a message")
    .addParam("message", "The message to print")
    .setAction(async (taskArgs) => {
      console.log(taskArgs.message);
    });