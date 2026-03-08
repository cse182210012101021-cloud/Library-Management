"use client";

import { ApiClient } from "@/wrapper/ApiClient";
import { returnBookApi } from "@/constant/ApiRoutes";
import { isErrorResponse } from "@/utils/CommonUtils";
import { useToast } from "@/providers/AlertProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useReturnBook(onSuccess?: () => void) {
  const [isReturning, setIsReturning] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const router = useRouter();

  const returnBook = async (applicationId: string) => {
    setIsReturning(true);
    const response = await ApiClient(() => returnBookApi(applicationId));

    if (isErrorResponse(response)) {
      showErrorToast(
        "Error",
        response.error || "Failed to submit return request",
      );
      setIsReturning(false);
      return false;
    }

    showSuccessToast(
      "Success",
      "Return request submitted successfully. Please visit the library to return the physical books.",
    );
    setIsReturning(false);
    onSuccess?.();
    router.refresh();
    return true;
  };

  return {
    returnBook,
    isReturning,
  };
}
