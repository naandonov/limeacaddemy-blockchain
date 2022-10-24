const hre = require('hardhat')
const ethers = hre.ethers;

async function deployLibraryContract() {
    await hre.run('compile'); // We are compiling the contracts using subtask
    const [deployer] = await ethers.getSigners(); // We are getting the deployer
  
    const deployerAddress = 'Deploying contracts with the account: ' + deployer.address; 
    await hre.run('print', { message: deployerAddress });

    const accountBallance = 'Account balance: ' + (await deployer.getBalance()).toString();
    await hre.run('print', { message: accountBallance });

    const library = await ethers.getContractFactory("Library"); 
    const libraryContract = await library.deploy();
    await hre.run('print', { message: 'Waiting for Library deployment...' });

    await libraryContract.deployed();

    const contractAddress = 'Library Contract address: ' + libraryContract.address;
    await hre.run('print', { message: contractAddress });

    await hre.run('print', { message: 'Done!' });

    await hre.run("verify:verify", { address: libraryContract.address });
}
  
module.exports = deployLibraryContract;