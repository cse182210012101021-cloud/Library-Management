import { BookFormField } from "@/constant/form-field/BookFormField";
import { RegisterOptions } from "react-hook-form";

const validateTitle = {
  required: "Book Title is required",
};

const validateAuthor = {
  required: "Author name is required",
};

const validateISBN = {
  required: "ISBN number is required",
};

const validateGenre = {
  required: "Please select a genre",
};

const validateQuantity = {
  required: "Quantity is required",
  min: {
    value: 1,
    message: "Quantity must be at least 1",
  },
  valueAsNumber: true,
};

const validatePublishedYear = {
  valueAsNumber: true,
};

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const validateCoverImage = {
  validate: {
    fileType: (value: string) => {
      if (!value) return true; // Optional field

      // Check if it's a valid base64 data URL
      if (!value.startsWith("data:image/")) {
        return "Invalid image format";
      }

      // Extract MIME type from base64 string
      const mimeType = value.substring(5, value.indexOf(";"));
      if (!ALLOWED_FILE_TYPES.includes(mimeType)) {
        return "Please upload a valid image file (JPEG, PNG, WebP, or GIF)";
      }

      return true;
    },
    fileSize: (value: string) => {
      if (!value) return true; // Optional field

      // Calculate approximate file size from base64 string
      // Base64 adds ~33% overhead, so we remove the data URL prefix and calculate
      const base64Data = value.split(",")[1] || "";
      const sizeInBytes = (base64Data.length * 3) / 4;

      if (sizeInBytes > MAX_FILE_SIZE) {
        return "File size must be less than 5MB";
      }

      return true;
    },
  },
};

const validationRules: Record<string, RegisterOptions> = {
  [BookFormField.TITLE]: validateTitle,
  [BookFormField.AUTHOR]: validateAuthor,
  [BookFormField.ISBN]: validateISBN,
  [BookFormField.GENRE]: validateGenre,
  [BookFormField.QUANTITY]: validateQuantity,
  [BookFormField.PUBLISHED_YEAR]: validatePublishedYear,
  [BookFormField.COVER_IMAGE]: validateCoverImage,
};

export const getBookValidationRules = (field: string) => {
  return validationRules[field] || {};
};
