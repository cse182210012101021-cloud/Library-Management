import { ApiClient } from "@/wrapper/ApiClient";
import { deleteApplicationApi } from "@/constant/ApiRoutes";
import { isErrorResponse } from "@/utils/CommonUtils";
import { useToast } from "@/providers/AlertProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useDeleteApplication(onSuccess?: () => void) {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteApplication = async (id: string) => {
    setIsDeleting(true);
    const response = await ApiClient(() => deleteApplicationApi(id));
    setIsDeleting(false);

    if (isErrorResponse(response)) {
      showErrorToast(
        "Error",
        response?.error || "Failed to cancel application",
      );
      return;
    }

    showSuccessToast("Success", "Application cancelled successfully");
    onSuccess?.();
    router.refresh();
  };

  return {
    deleteApplication,
    isDeleting,
  };
}
