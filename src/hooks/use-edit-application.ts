import { ApiClient } from "@/wrapper/ApiClient";
import { updateApplicationApi } from "@/constant/ApiRoutes";
import { isErrorResponse } from "@/utils/CommonUtils";
import { useToast } from "@/providers/AlertProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApplyBookFormValues } from "./use-apply-book";

export function useEditApplication(onSuccess?: () => void) {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateApplication = async (id: string, data: ApplyBookFormValues) => {
    if (!data.dateRange?.from || !data.dateRange?.to) {
      showErrorToast("Error", "Please select a complete date range");
      return;
    }

    const payload = {
      quantity: data.quantity,
      fromDate: data.dateRange.from,
      toDate: data.dateRange.to,
    };

    setIsUpdating(true);
    const response = await ApiClient(() => updateApplicationApi(id), payload);
    setIsUpdating(false);

    if (isErrorResponse(response)) {
      showErrorToast(
        "Error",
        response?.error || "Failed to update application",
      );
      return;
    }

    showSuccessToast("Success", "Application updated successfully");
    onSuccess?.();
    router.refresh();
  };

  return {
    updateApplication,
    isUpdating,
  };
}
