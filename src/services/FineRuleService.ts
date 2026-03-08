import FineRule from "@/model/FineRule";

export class FineRuleService {
  static async getFineRule() {
    let fineRule = await FineRule.findOne();
    if (!fineRule) {
      // Create a default one if none exists
      fineRule = await FineRule.create({
        chargesPerDay: 0,
        gracePeriod: 0,
        replacementFee: 0,
      });
    }
    return fineRule;
  }

  static async updateFineRule(data: {
    chargesPerDay: number;
    gracePeriod: number;
    replacementFee: number;
    updatedBy: string;
  }) {
    let fineRule = await FineRule.findOne();
    if (!fineRule) {
      fineRule = new FineRule(data);
    } else {
      fineRule.chargesPerDay = data.chargesPerDay;
      fineRule.gracePeriod = data.gracePeriod;
      fineRule.replacementFee = data.replacementFee;
      fineRule.updatedBy = data.updatedBy;
    }

    await fineRule.save();
    return fineRule;
  }
}
