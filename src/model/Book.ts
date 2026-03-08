import mongoose, { Schema, Document } from "mongoose";
import { BookGenre } from "@/constant/enum/BookGenre";

interface IBook extends Document {
  coverImage?: string;
  title: string;
  author: string;
  isbnNo: string;
  genre: BookGenre;
  publisher?: string;
  publishedYear?: number;
  quantity: number;
  totalAvailable: number;
  description?: string;
}

const BookSchema = new Schema<IBook>(
  {
    coverImage: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    isbnNo: {
      type: String,
      required: [true, "ISBN number is required"],
      unique: true,
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: {
        values: Object.values(BookGenre),
        message: "Invalid genre",
      },
    },
    publisher: {
      type: String,
      default: null,
    },
    publishedYear: {
      type: Number,
      default: null,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity cannot be less than 1"],
    },
    totalAvailable: {
      type: Number,
      required: [true, "Total available is required"],
      min: [0, "Total available cannot be less than 0"],
    },
    description: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

BookSchema.pre("save", function (next) {
  if (this.totalAvailable === undefined || this.totalAvailable === null) {
    this.totalAvailable = this.quantity;
  }
  next();
});

// Clear the model in development to pick up schema changes
if (mongoose.models.books) {
  delete mongoose.models.books;
}

const Book = mongoose.model<IBook>("books", BookSchema);

export default Book;
