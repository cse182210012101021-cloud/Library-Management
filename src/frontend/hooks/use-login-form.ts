"use client";

import { AuthField } from "@/shared/constant/form-field/AuthField";
import { useRouter } from "next/navigation";
import { isErrorResponse } from "@/shared/utils/CommonUtils";
import { ApiClient } from "@/frontend/wrapper/ApiClient";
import { useForm } from "react-hook-form";
import { signInApi } from "@/shared/constant/ApiRoutes";
import { AppRouterUtils } from "@/shared/utils/AppRouterUtils";
import { useState } from "react";
import { useToast } from "@/shared/providers/AlertProvider";

export function useLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      [AuthField.EMAIL]: "",
      [AuthField.PASSWORD]: "",
    },
  });

  //should improve data
  const onSubmit = async (data: any) => {
    const response = await ApiClient(signInApi, data);
    if (isErrorResponse(response)) {
      showErrorToast("Login failed", response?.error);
      return;
    }

    showSuccessToast("Successful", "Login successful");
    router.push(AppRouterUtils.DASHBOARD);
  };

  return {
    register,
    errors,
    isValid,
    handleSubmit: handleSubmit(onSubmit),
    showPassword,
    triggerShowPassword: () => setShowPassword((prev) => !prev),
    isSubmitting,
  };
}
