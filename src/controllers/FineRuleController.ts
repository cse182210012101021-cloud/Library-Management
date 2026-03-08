import { NextRequest } from "next/server";
import { FineRuleService } from "@/services/FineRuleService";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";

export class FineRuleController {
  static async getFineRule() {
    const fineRule = await FineRuleService.getFineRule();
    return {
      status: HttpStatusCode.OK,
      data: fineRule,
      message: "Fine rule fetched successfully",
    };
  }

  static async updateFineRule(req: NextRequest) {
    const { chargesPerDay, gracePeriod, replacementFee, updatedBy } =
      await req.json();

    if (
      chargesPerDay === undefined ||
      gracePeriod === undefined ||
      replacementFee === undefined ||
      !updatedBy
    ) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "All fields are required",
      };
    }

    const fineRule = await FineRuleService.updateFineRule({
      chargesPerDay,
      gracePeriod,
      replacementFee,
      updatedBy,
    });

    return {
      status: HttpStatusCode.OK,
      data: fineRule,
      message: "Fine rule updated successfully",
    };
  }
}
