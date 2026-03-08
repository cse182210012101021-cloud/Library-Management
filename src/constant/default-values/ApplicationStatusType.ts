import { ApplicationStatus } from "../enum/ApplicationStatus";

export const ApplicationStatusOptions = [
  {
    label: "Pending",
    value: ApplicationStatus.PENDING,
  },
  {
    label: "Approved",
    value: ApplicationStatus.APPROVED,
  },
  {
    label: "Rejected",
    value: ApplicationStatus.REJECTED,
  },
  {
    label: "Return Pending",
    value: ApplicationStatus.RETURN_PENDING,
  },
  {
    label: "Returned",
    value: ApplicationStatus.RETURNED,
  },
];
