import { AuthField } from "@/constant/form-field/AuthField";
import { REGEX_PATTERNS } from "@/lib/regex";

const validateEmail = {
  required: "Email is required",
  pattern: {
    value: REGEX_PATTERNS.EMAIL,
    message: "Invalid email format",
  },
  validate: {
    validFormat: (value: string) => {
      if (REGEX_PATTERNS.STUDENT_EMAIL.test(value)) {
        return true;
      }
      if (REGEX_PATTERNS.ADMIN_EMAIL.test(value)) {
        return true;
      }
      return "Invalid email format";
    },
  },
};

const validateName = {
  required: "Name is required",
};

const validateStudentId = {
  required: "Student Id is required",
};

const validateDeparment = {
  required: "Department is required",
};

const validatePassword = {
  required: "Password is required",
  pattern: {
    value: REGEX_PATTERNS.PASSWORD,
    message:
      "Password must be at least 8 characters and include letters, numbers, and a special character",
  },
};

const validateConfirmPassword = {
  required: "Please confirm your password",
  validate: (value: string, formValues: any) => {
    return value === formValues[AuthField.PASSWORD] || "Passwords do not match";
  },
};

const validationRules = {
  [AuthField.EMAIL]: validateEmail,
  [AuthField.NAME]: validateName,
  [AuthField.STUDENT_ID]: validateStudentId,
  [AuthField.DEPARTMENT]: validateDeparment,
  [AuthField.PASSWORD]: validatePassword,
  [AuthField.CONFIRM_PASSWORD]: validateConfirmPassword,
};

export const getValidationRules = (field: string) => {
  return validationRules[field] || {};
};
