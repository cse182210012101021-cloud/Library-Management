import { connectDB } from "@/shared/config/db";
import { BookService } from "@/backend/services/BookService";
import { jsonObject } from "@/shared/utils/CommonUtils";
import { notFound } from "next/navigation";
import BookDetailsSection from "@/frontend/section/book-details-section/BookDetailsSection";

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
