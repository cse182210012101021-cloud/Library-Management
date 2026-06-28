import { BookService } from "@/backend/services/BookService";
import { BookGenre } from "@/shared/constant/enum/BookGenre";

export class BookController {
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
    return BookService.addBook({
      coverImage,
      title,
      author,
      isbnNo,
      genre,
      publisher,
      publishedYear,
      quantity,
      description,
    });
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
    return BookService.updateBook(id, data);
  }

  static async deleteBook(id: string) {
    return BookService.deleteBook(id);
  }
}
