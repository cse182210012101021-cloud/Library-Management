"use client";

import { useForm } from "react-hook-form";
import { ApiClient } from "@/wrapper/ApiClient";
import { fineRulesApi, updateFineRulesApi } from "@/constant/ApiRoutes";
import { isErrorResponse } from "@/utils/CommonUtils";
import { useToast } from "@/providers/AlertProvider";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";

export interface FineRuleFormValues {
  chargesPerDay: number;
  gracePeriod: number;
  replacementFee: number;
}

export function useFineRule(onSuccess?: () => void) {
  const router = useRouter();
  const { user } = useAuthUser();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FineRuleFormValues>({
    mode: "onChange",
  });

  useEffect(() => {
    const fetchFineRules = async () => {
      const response = await ApiClient(fineRulesApi);
      if (!isErrorResponse(response)) {
        reset(response.data);
      } else {
        showErrorToast("Error", response.error || "Failed to fetch fine rules");
      }
      setIsLoading(false);
    };

    fetchFineRules();
  }, [reset, showErrorToast]);

  const onSubmit = async (data: FineRuleFormValues) => {
    if (!user) {
      showErrorToast("Error", "You must be logged in to process this request");
      return;
    }

    const payload = {
      ...data,
      updatedBy: user.userId,
    };

    const response = await ApiClient(updateFineRulesApi, payload);

    if (isErrorResponse(response)) {
      showErrorToast("Error", response.error || "Failed to update fine rules");
      return;
    }

    showSuccessToast("Success", "Fine rules updated successfully");
    onSuccess?.();
    router.refresh();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isValid,
    isLoading,
  };
}
