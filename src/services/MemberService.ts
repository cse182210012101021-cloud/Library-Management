import Member from "@/model/Member";
import Student from "@/model/Student";
import Application from "@/model/Application";
import { UserType } from "@/constant/enum/UserType";
import { jsonObject } from "@/utils/CommonUtils";
import { ApplicationStatus } from "@/constant/enum/ApplicationStatus";

export class MemberService {
  static async getAllMembers() {
    const members = await Member.find({
      userType: { $ne: UserType.ADMIN },
    }).populate({ path: "referenceId", model: Student });

    const memberData = await Promise.all(
      members.map(async (member: any) => {
        const applications = await Application.find({ userId: member._id });

        const totalBorrowed = applications.filter((app) =>
          [
            ApplicationStatus.APPROVED,
            ApplicationStatus.RETURN_PENDING,
            ApplicationStatus.RETURNED,
          ].includes(app.status),
        ).length;

        const totalReturned = applications.filter(
          (app) => app.status === ApplicationStatus.RETURNED,
        ).length;

        const charges = applications.reduce(
          (acc, app) => acc + (app.fineAmount || 0),
          0,
        );

        return {
          ...jsonObject(member),
          totalBorrowed,
          totalReturned,
          charges,
        };
      }),
    );

    return memberData;
  }

  static async getMemberByRegNo(regNo: string) {
    const student = await Student.findOne({ studentId: regNo });
    if (!student) return null;

    const member = await Member.findOne({ referenceId: student._id }).populate({
      path: "referenceId",
      model: Student,
    });

    if (!member) return null;

    const applications = await Application.find({ userId: member._id });

    const totalBorrowed = applications.filter((app) =>
      [
        ApplicationStatus.APPROVED,
        ApplicationStatus.RETURN_PENDING,
        ApplicationStatus.RETURNED,
      ].includes(app.status),
    ).length;

    const totalReturned = applications.filter(
      (app) => app.status === ApplicationStatus.RETURNED,
    ).length;

    const charges = applications.reduce(
      (acc, app) => acc + (app.fineAmount || 0),
      0,
    );

    return {
      ...jsonObject(member),
      stats: {
        totalBorrowed,
        totalReturned,
        charges,
      },
    };
  }

  static async getMemberHistory(memberId: string) {
    const history = await Application.find({ userId: memberId })
      .populate("bookIds")
      .sort({ createdAt: -1 });

    return jsonObject(history);
  }

  static async getMe(userId: string) {
    const member = await Member.findById(userId).populate({
      path: "referenceId",
      model: Student,
    });

    if (!member) return null;

    return jsonObject(member);
  }

  static async updateMe(userId: string, data: { image?: string }) {
    const member = await Member.findById(userId);
    if (!member) return null;

    if (member.userType === UserType.STUDENT && member.referenceId) {
      const student = await Student.findById(member.referenceId);
      if (student) {
        if (data.image !== undefined) student.image = data.image;
        await student.save();
      }
    } else {
      if (data.image !== undefined) member.image = data.image;
      await member.save();
    }

    return await this.getMe(userId);
  }

  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const bcryptjs = await import("bcryptjs");
    const member = await Member.findById(userId);
    if (!member) return { success: false, message: "User not found" };

    const isValid = await bcryptjs.compare(currentPassword, member.password);
    if (!isValid)
      return { success: false, message: "Current password is incorrect" };

    const salt = await bcryptjs.genSalt(10);
    member.password = await bcryptjs.hash(newPassword, salt);
    await member.save();

    return { success: true, message: "Password changed successfully" };
  }

  static async getAdminIds() {
    const admins = await Member.find({ userType: UserType.ADMIN }).select("_id");
    return admins.map((admin) => admin._id.toString());
  }

  static async getStudentIds() {
    const students = await Member.find({ userType: UserType.STUDENT }).select("_id");
    return students.map((student) => student._id.toString());
  }
}
