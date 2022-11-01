const hre = require("hardhat");
const library = require('../artifacts/contracts/library.sol/Library.json')

const infuraApiKey = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const contractDeployedAddress = process.env.CONTRACT_ADDRESS;
if (!contractDeployedAddress) {
  throw new Error("Please set your contract address in a .env file");
}

const goerliPrivateKey  = process.env.GOERLI_PRIVATE_KEY;
if (!goerliPrivateKey) {
  throw new Error("Please set your GOERLI API key in a .env file");
}

const run = async function() {
    const provider = new hre.ethers.providers.InfuraProvider("goerli", infuraApiKey)
    const wallet = new hre.ethers.Wallet(goerliPrivateKey, provider);
    const contractAddress = contractDeployedAddress
    const libraryContract = new hre.ethers.Contract(contractAddress, library.abi, wallet)

    const addTx = await libraryContract.addBook("Everest", 4)
    await addTx.wait()
    const newBooks = await libraryContract.getAvailableBooks()
    console.log(newBooks)

    const borrowTx = await libraryContract.borrowBook(1)
    await borrowTx.wait()

    console.log(await libraryContract.getAllBorrowers())

    const returnTx = await libraryContract.returnBorrowedBook()
    await returnTx.wait()
}

run()