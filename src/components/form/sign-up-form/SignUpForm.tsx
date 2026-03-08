"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Dropdown from "@/components/dropdown/Dropdown";
import { DepartmentOptions } from "@/constant/default-values/DepartmentOptions";
import Link from "next/link";
import { AuthState } from "@/constant/enum/AuthState";
import { useSignUpForm } from "@/hooks/use-signup-form";
import { AuthField } from "@/constant/form-field/AuthField";
import { getValidationRules } from "@/validator/client-validate/AuthFieldValidate";
import InputField from "@/components/input-field/InputField";
import { Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function SignUpForm() {
  const {
    register,
    control,
    isValid,
    handleSubmit,
    errors,
    showPassword,
    showConfirmPassword,
    triggerShowPassword,
    triggerShowConfirmPassword,
    isFetching,
    handleEmailChange,
    isSubmitting,
  } = useSignUpForm();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
      <h3 className="text-3xl font-bold">Create your account</h3>
      <p className="text-[14px]">
        Provide the following information for creating your account
      </p>
      <InputField
        type="email"
        placeholder="Email"
        error={errors[AuthField.EMAIL]?.message as string}
        {...register(AuthField.EMAIL, {
          ...getValidationRules(AuthField.EMAIL),
          onChange: handleEmailChange,
        })}
      />
      <InputField
        placeholder="Name"
        {...register(AuthField.NAME, getValidationRules(AuthField.NAME))}
        disabled
        rightIcon={isFetching && <Spinner />}
      />
      <InputField
        placeholder="Student Id"
        {...register(
          AuthField.STUDENT_ID,
          getValidationRules(AuthField.STUDENT_ID)
        )}
        disabled
        rightIcon={isFetching && <Spinner />}
      />

      <Dropdown
        placeholder="Select Department"
        options={DepartmentOptions}
        name={AuthField.DEPARTMENT}
        control={control}
        rules={getValidationRules(AuthField.DEPARTMENT)}
        disabled
        loading={isFetching}
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
      <InputField
        {...register(
          AuthField.CONFIRM_PASSWORD,
          getValidationRules(AuthField.CONFIRM_PASSWORD)
        )}
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm Password"
        error={errors[AuthField.CONFIRM_PASSWORD]?.message as string}
        rightIcon={
          <button
            type="button"
            onClick={triggerShowConfirmPassword}
            className="cursor-pointer"
          >
            {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        }
      />
      <Button
        disabled={!isValid}
        type="submit"
        className="w-full cursor-pointer"
      >
        {isSubmitting && <Spinner />} Register
      </Button>
      <Separator />
      <p>
        Already have an account?{" "}
        <Link
          href={`?authState=${AuthState.LOG_IN}`}
          className="underline cursor-pointer"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
