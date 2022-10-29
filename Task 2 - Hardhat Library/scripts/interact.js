const hre = require("hardhat");
const library = require('../artifacts/contracts/library.sol/Library.json')

const run = async function() {
    const provider = new hre.ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/EIqsJpHyDxs4sbun8eXa_WD9RX2Fp9Fb")
    const wallet = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const contractAddress = "0x3D1bf2A5EFE4be1D0EFeD337eda3a90B925Ab163"
    const libraryContract = new hre.ethers.Contract(contractAddress, library.abi, wallet)

    const addTx = await libraryContract.addBook("Everest", 4, {gasLimit: 100000})
    await tx.wait()
    const newBooks = await libraryContract.getAvailableBooks({gasLimit: 100000})
    console.log(newBooks)

    const borrowTx = await libraryContract.borrowBook(1, {gasLimit: 100000})
    await borrowTx.wait()

    console.log(await libraryContract.getAllBorrowers({gasLimit: 10000}))

    const returnTx = await libraryContract.returnBorrowedBook({gasLimit: 100000})
    await returnTx.wait()


}

run()