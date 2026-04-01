import Book from "@/model/Book";
import { sampleBooks } from "@/deafult-data/book-list";

export async function seedBooks() {
  try {
    // Quick check: If books already exist, skip seeding
    const bookCount = await Book.countDocuments();
    if (bookCount >= sampleBooks.length) {
      return;
    }

    console.log("Seeding books...");
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
    console.log("Books seeded successfully");
  } catch (error) {
    console.error("Error seeding books:", error);
  }
}
