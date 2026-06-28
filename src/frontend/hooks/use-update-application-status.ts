import { ApiClient } from "@/frontend/wrapper/ApiClient";
import { updateApplicationStatusApi } from "@/shared/constant/ApiRoutes";
import { isErrorResponse } from "@/shared/utils/CommonUtils";
import { useToast } from "@/shared/providers/AlertProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApplicationStatus } from "@/shared/constant/enum/ApplicationStatus";

export function useUpdateApplicationStatus(onSuccess?: () => void) {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (
    id: string,
    status: ApplicationStatus,
    adminId: string,
  ) => {
    setIsUpdating(true);
    const response = await ApiClient(() => updateApplicationStatusApi(id), {
      status,
      adminId,
    });
    setIsUpdating(false);

    if (isErrorResponse(response)) {
      showErrorToast(
        "Error",
        response?.error || "Failed to update application status",
      );
      return false;
    }

    showSuccessToast("Success", "Application status updated successfully");
    onSuccess?.();
    router.refresh();
    return true;
  };

  return {
    updateStatus,
    isUpdating,
  };
}
