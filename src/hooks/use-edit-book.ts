"use client";

import { useForm } from "react-hook-form";
import { ApiClient } from "@/wrapper/ApiClient";
import { updateBookApi } from "@/constant/ApiRoutes";
import { isErrorResponse } from "@/utils/CommonUtils";
import { useToast } from "@/providers/AlertProvider";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookFormValues } from "./use-add-book";

interface UseEditBookOptions {
  bookId: string;
  defaultValues: BookFormValues;
  onSuccess?: () => void;
}

export function useEditBook({
  bookId,
  defaultValues,
  onSuccess,
}: UseEditBookOptions) {
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
    defaultValues,
  });

  const onSubmit = async (data: BookFormValues) => {
    const response = await ApiClient(() => updateBookApi(bookId), data);

    if (isErrorResponse(response)) {
      showErrorToast("Error", response?.error || "Failed to update book");
      return;
    }

    showSuccessToast("Success", "Book updated successfully");
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
    reset,
  };
}
