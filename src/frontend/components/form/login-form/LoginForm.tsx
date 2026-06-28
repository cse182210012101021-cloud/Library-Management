"use client";

import { Button } from "@/frontend/components/ui/button";
import { Separator } from "@/frontend/components/ui/separator";
import { AuthState } from "@/shared/constant/enum/AuthState";
import Link from "next/link";
import { useLoginForm } from "@/frontend/hooks/use-login-form";
import { AuthField } from "@/shared/constant/form-field/AuthField";
import { getValidationRules } from "@/backend/validator/client-validate/AuthFieldValidate";
import InputField from "@/frontend/components/input-field/InputField";
import { Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/frontend/components/ui/spinner";

export default function LoginForm() {
  const {
    register,
    errors,
    isValid,
    handleSubmit,
    showPassword,
    triggerShowPassword,
    isSubmitting,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
      <h3 className="text-3xl font-bold">Welcome Back!</h3>
      <p className="text-[14px]">
        Enter your email and password to login to your account
      </p>
      <InputField
        type="email"
        placeholder="Email"
        error={errors[AuthField.EMAIL]?.message as string}
        {...register(AuthField.EMAIL, getValidationRules(AuthField.EMAIL))}
      />
      <InputField
        {...register(
          AuthField.PASSWORD,
          getValidationRules(AuthField.PASSWORD)
        )}
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        error={errors[AuthField.PASSWORD]?.message as string}
        rightIcon={
          <button
            type="button"
            onClick={triggerShowPassword}
            className="cursor-pointer"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        }
      />
      <Button disabled={!isValid} className="w-full cursor-pointer">
        {isSubmitting && <Spinner />} Login
      </Button>
      <Separator />
      <p>
        Don&apos;t have an account?{" "}
        <Link href={`?authState=${AuthState.REGISTER}`} className="underline">
          Register
        </Link>
      </p>
    </form>
  );
}
