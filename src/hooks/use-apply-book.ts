"use client";

import { useForm } from "react-hook-form";
import { ApiClient } from "@/wrapper/ApiClient";
import {
  createApplicationApi,
  updateApplicationApi,
} from "@/constant/ApiRoutes";
import { isErrorResponse } from "@/utils/CommonUtils";
import { useToast } from "@/providers/AlertProvider";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/providers/AuthProvider";
import { DateRange } from "react-day-picker";

export interface ApplyBookFormValues {
  dateRange: DateRange | undefined;
}

export function useApplyBook(
  bookIds: string[],
  onSuccess?: () => void,
  defaultValues?: Partial<ApplyBookFormValues>,
  mode: "apply" | "edit" = "apply",
  applicationId?: string,
) {
  const router = useRouter();
  const { user } = useAuthUser();
  const { showSuccessToast, showErrorToast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setValue,
  } = useForm<ApplyBookFormValues>({
    mode: "onChange",
    defaultValues: {
      dateRange: defaultValues?.dateRange || {
        from: new Date(),
        to: undefined,
      },
    },
  });

  const onSubmit = async (data: ApplyBookFormValues) => {
    if (!user) {
      showErrorToast("Error", "You must be logged in to process this request");
      return;
    }

    if (!data.dateRange?.from || !data.dateRange?.to) {
      showErrorToast("Error", "Please select a complete date range");
      return;
    }

    const payload = {
      bookIds,
      userId: user.userId,
      fromDate: data.dateRange.from,
      toDate: data.dateRange.to,
      quantity: 1,
    };

    const apiRoute =
      mode === "edit" && applicationId
        ? () => updateApplicationApi(applicationId)
        : createApplicationApi;

    const response = await ApiClient(apiRoute, payload);

    if (isErrorResponse(response)) {
      showErrorToast(
        "Error",
        response?.error || `Failed to ${mode} application`,
      );
      return;
    }

    showSuccessToast(
      "Success",
      `Application ${mode === "edit" ? "updated" : "submitted"} successfully`,
    );
    reset();
    onSuccess?.();
    router.refresh();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isValid,
    control,
    watch,
    setValue,
  };
}
