import Validator from "validatorjs";
import { BookGenre } from "@/constant/enum/BookGenre";

interface BookData {
  title?: string;
  author?: string;
  isbnNo?: string;
  genre?: BookGenre;
  quantity?: number;
  coverImage?: string;
  publisher?: string;
  publishedYear?: number;
  description?: string;
}

export const validateBook = async (data: BookData) => {
  const rules = {
    title: "required|string",
    author: "required|string",
    isbnNo: "required|string",
    genre: `required|in:${Object.values(BookGenre).join(",")}`,
    quantity: "required|numeric|min:1",
    coverImage: "string",
    publisher: "string",
    publishedYear: "numeric",
    description: "string",
  };

  const validation = new Validator(data, rules);

  if (validation.fails()) {
    throw new Error(JSON.stringify(validation.errors.all()));
  }
};

export const validateBookUpdate = async (data: BookData) => {
  const rules = {
    title: "string",
    author: "string",
    isbnNo: "string",
    genre: `in:${Object.values(BookGenre).join(",")}`,
    quantity: "numeric|min:1",
    coverImage: "string",
    publisher: "string",
    publishedYear: "numeric",
    description: "string",
  };

  const validation = new Validator(data, rules);

  if (validation.fails()) {
    throw new Error(JSON.stringify(validation.errors.all()));
  }
};
