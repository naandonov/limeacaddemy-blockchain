import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useLibraryContract from "../hooks/useLibraryContract";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { BookStructOutput } from "../contracts/types/Library";

type LibraryContract = {
  contractAddress: string;
};

const LibraryModule = ({ contractAddress }: LibraryContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const libraryContract = useLibraryContract(contractAddress);
  const [availableBooks, setAvailableBooks] = useState<BookStructOutput[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [addFormData, setAddFormData] = useState({
    bookTitle: '',
    bookQuantity: ''
  })

  useEffect(() => {
    getAvailableBooks();
  })

  const handleAddFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = {...addFormData};
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  } 

  const handleAddFormSubmit = (event) => {
    addBook(addFormData.bookTitle, addFormData.bookQuantity);
  }

  const returnBorrowedBook = async (event) => {
    setIsLoading(true);
    try {
      const tx = await libraryContract.returnBorrowedBook();
      await tx.wait();
    } catch(error) {
      window.alert(error);
    }
    setIsLoading(false);
  }

  const handleBorrowBook = async (event, book) => {
    setIsLoading(true);
    try {
      const tx = await libraryContract.borrowBook(book.id);
      await tx.wait();
    } catch(error) {
      window.alert(error);
    }
    setIsLoading(false);
  }

  const getAvailableBooks = async () => {
    try {
      const availableBooks = await libraryContract.getAvailableBooks();
      setAvailableBooks(availableBooks);
    } catch(error) {
      window.alert(error);
    }
  }

  const addBook = async (title, quantity) => {
    setIsLoading(true);
    try {
      const tx = await libraryContract.addBook(title, quantity);
      await tx.wait();
    } catch(error) {
      window.alert(error);
    }
    setIsLoading(false);
  }

  var z = 0;
  const doM = async () => {
    if (z == 0) {
      z++;
      // window.alert(await libraryContract.getAvailableBooks());
      // const tx = await libraryContract.addBook("To kill a mocking bird", 3);
      // await tx.wait();
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }


  return (
    <div>
    <div className="app-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Book Name</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {availableBooks?.map((book)=> (
          <tr>
            <td>{book.id}</td>
            <td>{book.title}</td>
            <td>{book.inventoryCount}</td>
            <td>
              <button type="button" onClick={(event)=>handleBorrowBook(event, book)}>Borrow</button>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
      <p></p>
      <table>
      <td>
      <form onSubmit={handleAddFormSubmit} className="add-form">
        <strong>Add Book</strong>
        <input type="text" name="bookTitle" onChange={handleAddFormChange} required={true} placeholder="Enter a title..."/>
        <input type="number" min="1" name="bookQuantity" onChange={handleAddFormChange} required={true} placeholder="Enter a quantity..."/>
        <button type="submit">Add</button>
      </form>
      </td>
      <td>
      <form onSubmit={returnBorrowedBook} className="add-form">
        <strong>Borrowed Book</strong>
        <label hidden={true}>None</label>
        <button type="submit">Return</button>
      </form>
      </td>
      </table>
    </div>
    <style jsx>{`

        
        `}
    </style>
    </div>
  );

  
};

export default LibraryModule;
