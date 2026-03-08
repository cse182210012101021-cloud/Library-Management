"use client";

import { BookFormField } from "@/constant/form-field/BookFormField";
import { useForm } from "react-hook-form";
import { ApiClient } from "@/wrapper/ApiClient";
import { addBookApi } from "@/constant/ApiRoutes";
import { isErrorResponse } from "@/utils/CommonUtils";
import { useToast } from "@/providers/AlertProvider";
import { BookGenre } from "@/constant/enum/BookGenre";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface BookFormValues {
  [BookFormField.TITLE]: string;
  [BookFormField.AUTHOR]: string;
  [BookFormField.ISBN]: string;
  [BookFormField.GENRE]: BookGenre;
  [BookFormField.PUBLISHED_YEAR]?: number;
  [BookFormField.QUANTITY]: number;
  [BookFormField.PUBLISHER]?: string;
  [BookFormField.DESCRIPTION]?: string;
  [BookFormField.COVER_IMAGE]?: string;
}

export function useAddBook(onSuccess?: () => void) {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<BookFormValues>({
    mode: "onChange",
    defaultValues: {
      [BookFormField.TITLE]: "",
      [BookFormField.AUTHOR]: "",
      [BookFormField.ISBN]: "",
      [BookFormField.GENRE]: "" as BookGenre,
      [BookFormField.PUBLISHED_YEAR]: undefined,
      [BookFormField.QUANTITY]: 1,
      [BookFormField.PUBLISHER]: "",
      [BookFormField.DESCRIPTION]: "",
      [BookFormField.COVER_IMAGE]: "",
    },
  });

  const onSubmit = async (data: BookFormValues) => {
    const response = await ApiClient(addBookApi, data);

    if (isErrorResponse(response)) {
      showErrorToast("Error", response?.error || "Failed to add book");
      return;
    }

    showSuccessToast("Success", "Book added successfully");
    reset();
    onSuccess?.();
    router.refresh();
  };

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleUploadComplete = () => {
    setIsUploading(false);
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isValid,
    isUploading,
    handleUploadStart,
    handleUploadComplete,
  };
}
