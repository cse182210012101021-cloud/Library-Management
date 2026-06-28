import { BookStatus } from "../enum/BookStatus";

export const BookStatusMap = {
  [BookStatus.BORROWED]: "Borrowed",
  [BookStatus.RETURNED]: "Returned",
  [BookStatus.TIME_EXCEEDED]: "Time Exceed",
};

export const BookStatusOptions = Object.entries(BookStatusMap).map(
  ([value, label]) => ({
    label,
    value,
  })
);
