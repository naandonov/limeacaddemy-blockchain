pragma solidity ^0.8.0;
import "./ownable.sol";

contract Library is Ownable {
    Book[] private books;
    mapping (address => uint16) userBorrowedBook;
    address[] private borrowingLog;

    struct Book {
        uint16 id;
        string title;
        uint8 inventoryCount;
    }

    modifier userHasNoBorrowedBook() {
        require(userBorrowedBook[msg.sender] == 0, "You have already borrowed a book");
        _;
    }

    modifier userHasBorrowedBook() {
        require(userBorrowedBook[msg.sender] != 0, "You have no borrowed books");
        _;
    }

    modifier bookHasAvailableCopies(uint16 _bookId) {
        // The indices in the books array are starting from 0
        // while the books'ids start from 1, hence the subtraction
        require(_bookId <= books.length, "Invalid book entered");
        require(books[_bookId - 1].inventoryCount > 0, "No available coppies");
        _;
    }

    function addBook(string memory _title, uint8 _inventoryCount) public onlyOwner {
        books.push(Book(uint16(books.length) + 1, _title, _inventoryCount));
    }

    function getAvailableBooks() external view returns(Book[] memory) {
        Book[] memory result = new Book[](books.length);
        uint counter = 0;
        for (uint i=0; i < books.length; i++) {
            if (books[i].inventoryCount > 0) {
                result[counter] = books[i];
                counter++;
            }
        }
        return result;
    }

    function borrowBook(uint16 _bookId) external userHasNoBorrowedBook bookHasAvailableCopies(_bookId) {
        userBorrowedBook[msg.sender] = _bookId;
        books[_bookId - 1].inventoryCount--;
        borrowingLog.push(msg.sender);
    }

    function returnBorrowedBook() external userHasBorrowedBook {
        books[userBorrowedBook[msg.sender] - 1].inventoryCount++;
        userBorrowedBook[msg.sender] = 0;
    }

    function getAllBorrowers() external view returns(address[] memory) {
        return borrowingLog;
    }
}
