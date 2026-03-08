import Book from "@/model/Book";
import { sampleBooks } from "@/deafult-data/book-list";

export async function seedBooks() {
  try {
    for (const bookData of sampleBooks) {
      // Use findOneAndUpdate with upsert: true to avoid duplicates
      await Book.findOneAndUpdate(
        { isbnNo: bookData.isbnNo },
        {
          $set: {
            ...bookData,
            totalAvailable: bookData.quantity, // Initialize totalAvailable
          },
        },
        { upsert: true, new: true },
      );
    }
    console.log("Books seeded successfully (no duplicates created)");
  } catch (error) {
    console.error("Error seeding books:", error);
  }
}
