import { apiHandler } from "@/wrapper/ApiHandler";
import { MemberController } from "@/controllers/MemberController";

export const GET = apiHandler(async () => {
  return await MemberController.getAllMembers();
});
