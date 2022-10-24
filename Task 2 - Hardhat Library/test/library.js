const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("library", function() {
  before(async() => {
    libraryFactory = await ethers.getContractFactory("Library");
    library = await libraryFactory.deploy();
  });

  it("No books and launch", async function () {
    expect(await library.getAvailableBooks()).to.deep.equal([]);
  });

  it("Owner adds a book", async function () {
    const [owner] = await ethers.getSigners();
    const addTx = await library.connect(owner).addBook("Test book", 6);
    await addTx;
    expect(await library.getAvailableBooks()).to.eql([[1, "Test book", 6]]);
  });

  it("Non-owner tries to add a book, results in a revert", async function () {
    const [owner, addr1] = await ethers.getSigners();
    await expect(library.connect(addr1).addBook("Test book", 6)).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("Non-owner successfully adds a book after ownership transfer", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const transferOwnershipTx = await library.connect(owner).transferOwnership(addr1.address);
    await transferOwnershipTx;
    const addTransaction = await library.connect(addr1).addBook("Prod book", 1);
    await addTransaction;
    expect(await library.getAvailableBooks()).to.eql([[1, "Test book", 6], [2, "Prod book", 1]]);

    const resetTransferOwnershipTx = await library.connect(addr1).transferOwnership(owner.address);
    await resetTransferOwnershipTx;
  });

  it("Borrow available book", async function () {
    const [owner] = await ethers.getSigners();
    const borrowBookTx = await library.connect(owner).borrowBook(2);
    await borrowBookTx;
    expect(await library.getAvailableBooks()).to.eql([[1, "Test book", 6], [0, "", 0]]);
  });

  it("Borrow after already borrowing, results in a revert", async function () {
    const [owner] = await ethers.getSigners();
    await expect(library.connect(owner).borrowBook(1)).to.be.revertedWith("You have already borrowed a book");
  });

  it("Return borrowed book", async function () {
    const [owner] = await ethers.getSigners();
    const borrowBookTx = await library.connect(owner).returnBorrowedBook();
    await borrowBookTx;
    expect(await library.getAvailableBooks()).to.eql([[1, "Test book", 6], [2, "Prod book", 1]]);
  });

  it("Borrow unavailable book, results in a revert", async function () {
    const [owner] = await ethers.getSigners();
    await expect(library.connect(owner).borrowBook(3)).to.be.revertedWith("Invalid book entered");
  });

  it("Return non-borrowed book, results in a revert", async function () {
    const [owner] = await ethers.getSigners();
    await expect(library.connect(owner).returnBorrowedBook()).to.be.revertedWith("You have no borrowed books");
  });

  it("Try to borrow a book not in inventory, results in a revert", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const addTx = await library.connect(owner).addBook("Missing book", 0);
    await addTx;
    await expect(library.connect(addr1).borrowBook(3)).to.be.revertedWith("No available coppies");
  });

  it("All borrowers are recorded", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const borrowBookTx = await library.connect(addr1).borrowBook(1);
    await borrowBookTx;
    expect(await library.getAllBorrowers()).to.be.eql([owner.address, addr1.address]);
  });
});