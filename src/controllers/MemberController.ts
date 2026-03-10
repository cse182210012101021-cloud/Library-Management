import { NextRequest } from "next/server";
import { MemberService } from "@/services/MemberService";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/lib/message";

export class MemberController {
  static async getAllMembers() {
    const members = await MemberService.getAllMembers();

    return {
      status: HttpStatusCode.OK,
      data: members,
      message: MESSAGE.API.GET_MEMBERS || "Members fetched successfully",
    };
  }

  static async getMemberDetails(
    req: NextRequest,
    context: { params: { id: string } },
  ) {
    const { id } = await context.params;

    if (!id) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Member Registration Number is required",
      };
    }

    const memberDetails = await MemberService.getMemberByRegNo(id);

    if (!memberDetails) {
      return {
        status: HttpStatusCode.NOT_FOUND,
        message: "Member not found",
      };
    }

    const history = await MemberService.getMemberHistory(memberDetails._id);

    return {
      status: HttpStatusCode.OK,
      data: {
        ...memberDetails,
        history,
      },
      message: "Member details fetched successfully",
    };
  }

  static async getMe(req: NextRequest) {
    const { searchParams } = new URL(req.url); // Though we'll likely use server-side auth
    const userId = searchParams.get("userId");

    if (!userId) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "User ID is required",
      };
    }

    const member = await MemberService.getMe(userId);

    if (!member) {
      return {
        status: HttpStatusCode.NOT_FOUND,
        message: "User not found",
      };
    }

    return {
      status: HttpStatusCode.OK,
      data: member,
      message: "User profile fetched successfully",
    };
  }

  static async updateMe(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "User ID is required",
      };
    }

    try {
      const body = await req.json();

      const updatedMember = await MemberService.updateMe(userId, {
        image: body.image,
      });

      if (!updatedMember) {
        return {
          status: HttpStatusCode.NOT_FOUND,
          message: "User not found",
        };
      }

      return {
        status: HttpStatusCode.OK,
        data: updatedMember,
        message: "User profile updated successfully",
      };
    } catch (error: any) {
      return {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error.message || "Failed to update profile",
      };
    }
  }

  static async changePassword(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      const body = await req.json();
      const { userId: bodyUserId, currentPassword, newPassword } = body;

      if (!bodyUserId || !currentPassword || !newPassword) {
        return {
          status: HttpStatusCode.BAD_REQUEST,
          message: "userId, currentPassword, and newPassword are required",
        };
      }

      const result = await MemberService.changePassword(
        bodyUserId,
        currentPassword,
        newPassword
      );

      return {
        status: result.success ? HttpStatusCode.OK : HttpStatusCode.BAD_REQUEST,
        message: result.message,
      };
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "currentPassword and newPassword are required",
      };
    }

    const result = await MemberService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    return {
      status: result.success ? HttpStatusCode.OK : HttpStatusCode.BAD_REQUEST,
      message: result.message,
    };
  }
}
