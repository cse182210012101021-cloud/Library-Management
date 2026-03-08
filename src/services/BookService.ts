import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import Book from "@/model/Book";
import { ApiError } from "@/wrapper/ApiError";
import { BookGenre } from "@/constant/enum/BookGenre";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
} from "@/constant/ApplicationConstant";

export class BookService {
  static async getAllBooks({
    genre,
    search,
    all = false,
    page = DEFAULT_PAGE,
    limit = DEFAULT_PAGE_LIMIT,
  }: {
    genre?: BookGenre;
    search?: string;
    all?: boolean;
    page?: number;
    limit?: number;
  } = {}) {
    const filter: any = {};
    if (genre && genre !== ("all" as any)) {
      filter.genre = genre;
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    const skip = all ? 0 : (page - 1) * limit;
    const findQuery = Book.find(filter).sort({ createdAt: -1 });

    if (!all) {
      findQuery.skip(skip).limit(limit);
    }

    const [books, totalCount] = await Promise.all([
      findQuery,
      Book.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      books,
      totalCount,
      totalPages,
    };
  }
  static async addBook({
    coverImage,
    title,
    author,
    isbnNo,
    genre,
    publisher,
    publishedYear,
    quantity,
    description,
  }: {
    coverImage?: string;
    title: string;
    author: string;
    isbnNo: string;
    genre: BookGenre;
    publisher?: string;
    publishedYear?: number;
    quantity: number;
    description?: string;
  }) {
    const existingBook = await Book.findOne({ isbnNo });

    if (existingBook) {
      throw new ApiError(
        "Book with this ISBN already exists",
        HttpStatusCode.CONFLICT,
      );
    }

    const newBook = await Book.create({
      coverImage,
      title,
      author,
      isbnNo,
      genre,
      publisher,
      publishedYear,
      quantity,
      totalAvailable: quantity,
      description,
    });

    return newBook;
  }

  static async getBookById(id: string) {
    const book = await Book.findById(id);

    if (!book) {
      throw new ApiError("Book not found", HttpStatusCode.NOT_FOUND);
    }

    return book;
  }

  static async updateBook(
    id: string,
    data: {
      coverImage?: string;
      title?: string;
      author?: string;
      isbnNo?: string;
      genre?: BookGenre;
      publisher?: string;
      publishedYear?: number;
      quantity?: number;
      description?: string;
    },
  ) {
    const book = await Book.findById(id);

    if (!book) {
      throw new ApiError("Book not found", HttpStatusCode.NOT_FOUND);
    }

    // If ISBN is being updated, check for conflicts
    if (data.isbnNo && data.isbnNo !== book.isbnNo) {
      const existingBook = await Book.findOne({ isbnNo: data.isbnNo });
      if (existingBook) {
        throw new ApiError(
          "Book with this ISBN already exists",
          HttpStatusCode.CONFLICT,
        );
      }
    }

    if (data.quantity !== undefined && data.quantity !== book.quantity) {
      const diff = data.quantity - book.quantity;
      (data as any).totalAvailable = Math.max(0, book.totalAvailable + diff);
    }

    const updatedBook = await Book.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return updatedBook;
  }

  static async deleteBook(id: string) {
    const book = await Book.findById(id);

    if (!book) {
      throw new ApiError("Book not found", HttpStatusCode.NOT_FOUND);
    }

    await Book.findByIdAndDelete(id);

    return { id };
  }
}
