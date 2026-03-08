import { ApplicationStatus } from "../enum/ApplicationStatus";

export const TableHeaders = [
  {
    label: "Application ID",
    value: "appId",
  },
  {
    label: "Reg No.",
    value: "registrationNo",
  },
  {
    label: "Applicant",
    value: "applicant",
  },
  {
    label: "App Date",
    value: "applicationDate",
  },
  {
    label: "Start Date",
    value: "startDate",
  },
  {
    label: "End Date",
    value: "endDate",
  },
  {
    label: "Status",
    value: "status",
  },
];

export const demoData = [
  {
    registrationNo: "20202745929",
    bookId: "book930",
    bookName: "Paradoxical Sajid",
    applicant: "Demo User Name",
    applicationDate: "20th May, 2024",
    status: ApplicationStatus.PENDING,
  },
  {
    registrationNo: "20202745929",
    bookId: "book930",
    bookName: "Paradoxical Sajid",
    applicant: "Demo User Name",
    applicationDate: "20th May, 2024",
    status: ApplicationStatus.APPROVED,
  },
  {
    registrationNo: "20202745929",
    bookId: "book930",
    bookName: "Paradoxical Sajid",
    applicant: "Demo User Name",
    applicationDate: "20th May, 2024",
    status: ApplicationStatus.REJECTED,
  },
];
