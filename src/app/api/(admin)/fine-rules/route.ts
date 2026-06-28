import { NextRequest } from "next/server";
import { apiHandler } from "@/frontend/wrapper/ApiHandler";
import { FineRuleController } from "@/backend/controllers/FineRuleController";

export const GET = apiHandler(async () => {
  return await FineRuleController.getFineRule();
});

export const POST = apiHandler(async (req: NextRequest) => {
  return await FineRuleController.updateFineRule(req);
});
