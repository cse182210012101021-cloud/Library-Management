import { apiHandler } from "@/frontend/wrapper/ApiHandler";
import { MemberController } from "@/backend/controllers/MemberController";

export const GET = apiHandler(async () => {
  return await MemberController.getAllMembers();
});
