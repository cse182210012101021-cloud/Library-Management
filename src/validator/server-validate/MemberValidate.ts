import Validator from "validatorjs";
import { UserType } from "@/constant/enum/UserType";

export const validateMember = async (data: any) => {
  const rules = {
    email: "required|email",
    password: "required|string", //validation of strong logic should be implement
    userType: `in:${Object.values(UserType).join(",")}`,
  };

  const validation = new Validator(data, rules);

  if (validation.fails()) {
    throw new Error(JSON.stringify(validation.errors.all()));
  }
};
