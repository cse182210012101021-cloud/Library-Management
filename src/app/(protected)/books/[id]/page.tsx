import { connectDB } from "@/config/db";
import { BookService } from "@/services/BookService";
import { jsonObject } from "@/utils/CommonUtils";
import { notFound } from "next/navigation";
import BookDetailsSection from "@/section/book-details-section/BookDetailsSection";

const loadBook = async (id: string) => {
  try {
    await connectDB();
    const book = await BookService.getBookById(id);
    return {
      data: jsonObject(book) || {},
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
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data, error } = await loadBook(id);

  if (error) {
    return notFound();
  }

  return <BookDetailsSection book={data} />;
}
