import FineRule from "@/model/FineRule";
import { NotificationService } from "./NotificationService";
import { NotificationType } from "@/model/Notification";
import { MemberService } from "./MemberService";

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

    // Notify all students about the rule change
    const studentIds = await MemberService.getStudentIds();
    for (const studentId of studentIds) {
      await NotificationService.createNotification({
        userId: studentId,
        title: "Fine Policy Updated",
        message: `Library fine rules have been updated. New rate: ${data.chargesPerDay}/day after ${data.gracePeriod} days.`,
        type: NotificationType.WARNING,
        link: "/profile",
      });
    }

    return fineRule;
  }
}
