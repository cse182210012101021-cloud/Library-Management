import { BookStatus } from "../enum/BookStatus";
import { BookStatusMap } from "./BookStatusOptions";

export const TableHeaders = [
  {
    label: "Serial No.",
    value: "serialNo",
  },
  {
    label: "Book Id",
    value: "bookId",
  },
  {
    label: "Book Name",
    value: "bookName",
  },
  {
    label: "Author Name",
    value: "authorName",
  },
  {
    label: "Purchase Date",
    value: "purchaseDate",
  },
  {
    label: "Return Date",
    value: "returnDate",
  },
];

export const demoData = [
  {
    serialNo: 1,
    bookId: "askdfj90234",
    bookName: "Paradoxical Sajid",
    authorName: "Arif Azad",
    purchaseDate: "19th May, 2025",
    returnDate: "20th June, 2025",
    status: BookStatus.RETURNED,
  },
  {
    serialNo: 2,
    bookId: "askdfj90234",
    bookName: "Paradoxical Sajid",
    authorName: "Arif Azad",
    purchaseDate: "19th May, 2025",
    returnDate: "20th June, 2025",
    status: BookStatus.BORROWED,
  },
  {
    serialNo: 3,
    bookId: "askdfj90234",
    bookName: "Paradoxical Sajid",
    authorName: "Arif Azad",
    purchaseDate: "19th May, 2025",
    returnDate: "20th June, 2025",
    status: BookStatus.TIME_EXCEEDED,
  },
];
