import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { InputFieldProps } from "@/types/InputFieldProps";

export default function InputField({
  label,
  inputType = "input",
  required = false,
  description,
  error,
  leftIcon,
  rightIcon,
  textareaProps,
  className,
  id,
  ...props
}: InputFieldProps) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {label && (
        <Label htmlFor={fieldId} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 flex">
            {leftIcon}
          </div>
        )}

        {inputType === "textarea" ? (
          <Textarea
            id={fieldId}
            className={`${
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
            {...(textareaProps as any)}
            {...(props as any)}
          />
        ) : (
          <Input
            id={fieldId}
            className={`${leftIcon ? "pl-10" : ""} ${
              rightIcon ? "pr-10" : ""
            } ${error ? "border-red-500 focus-visible:ring-red-500" : ""} `}
            {...(props as any)}
          />
        )}

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 flex">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : description ? (
        <p className="text-sm text-gray-500">{description}</p>
      ) : null}
    </div>
  );
}
