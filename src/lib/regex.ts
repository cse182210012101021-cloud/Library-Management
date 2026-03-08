export const REGEX_PATTERNS = {
  STUDENT_ID: /^\d{16}$/,

  STUDENT_EMAIL: /^[a-z]+_\d{15}@lus\.ac\.bd$/,

  ADMIN_EMAIL: /^(head|dean)_[a-z]+@lus\.ac\.bd$/,

  EMAIL: /^([a-z]+_\d{15}|(head|dean)_[a-z]+)@lus\.ac\.bd$/,

  EXTRACT_DEPARTMENT: /^([a-z]+)_\d{15}@lus\.ac\.bd$/,

  EXTRACT_EMAIL_DIGITS: /\d{15}/,

  NAME: /^[a-zA-Z\s]{3,}$/,

  PASSWORD:
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
};
