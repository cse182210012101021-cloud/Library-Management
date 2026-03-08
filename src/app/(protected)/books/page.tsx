import { connectDB } from "@/config/db";
import BookSection from "@/section/book-section/BookSection";
import { BookService } from "@/services/BookService";
import { jsonObject } from "@/utils/CommonUtils";
import { notFound } from "next/navigation";

const loadBooks = async () => {
  try {
    await connectDB();
    const { books } = await BookService.getAllBooks({ all: true });
    return {
      data: {
        books: jsonObject(books),
      },
      error: null,
    };
  } catch (error: Error | unknown) {
    return {
      data: null,
      error,
    };
  }
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; genre?: string }>;
}) {
  const { page: pageParam, search, genre } = await searchParams;
  const initialPage = Number(pageParam) || 1;
  const { data, error } = await loadBooks();

  if (error || !data) {
    return notFound();
  }

  return (
    <BookSection
      books={data.books}
      initialPage={initialPage}
      initialSearch={search || ""}
      initialGenre={genre || "all"}
    />
  );
}
