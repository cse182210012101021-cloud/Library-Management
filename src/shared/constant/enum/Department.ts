export enum Department {
  BUSINESS_ADMINISTRATION = "BUSINESS_ADMINISTRATION",
  CSE = "CSE",
  ENGLISH = "ENGLISH",
  EEE = "EEE",
  CIVIL_ENGINEERING = "CIVIL_ENGINEERING",
  ARCHITECTURE = "ARCHITECTURE",
  LAW = "LAW",
  ISLAMIC_STUDIES = "ISLAMIC_STUDIES",
  PUBLIC_HEALTH = "PUBLIC_HEALTH",
  TOURISM_AND_HOSPITALITY_MANAGEMENT = "TOURISM_AND_HOSPITALITY_MANAGEMENT",
  BANGLA = "BANGLA",
}

export const DepartmentMap: Record<Department, string> = {
  [Department.BUSINESS_ADMINISTRATION]: "Department of Business Administration",
  [Department.CSE]: "Department of CSE",
  [Department.ENGLISH]: "Department of English",
  [Department.EEE]: "Department of EEE",
  [Department.CIVIL_ENGINEERING]: "Department of Civil Engineering",
  [Department.ARCHITECTURE]: "Department of Architecture",
  [Department.LAW]: "Department of Law",
  [Department.ISLAMIC_STUDIES]: "Department of Islamic Studies",
  [Department.PUBLIC_HEALTH]: "Department of Public Health",
  [Department.TOURISM_AND_HOSPITALITY_MANAGEMENT]:
    "Department of Tourism and Hospitality Management",
  [Department.BANGLA]: "Department of Bangla",
};
