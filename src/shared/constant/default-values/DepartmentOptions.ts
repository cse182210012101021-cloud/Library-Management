import { DepartmentMap } from "../enum/Department";

export const DepartmentOptions = Object.entries(DepartmentMap).map(
  ([key, value]) => ({
    value: key,
    label: value,
  })
);
