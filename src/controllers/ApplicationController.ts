import { NextRequest } from "next/server";
import { ApplicationService } from "@/services/ApplicationService";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/lib/message";

export class ApplicationController {
  static async createApplication(req: NextRequest) {
    const { bookIds, userId, fromDate, toDate, quantity } = await req.json();

    if (!bookIds || !userId || !fromDate || !toDate || !quantity) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Missing required fields",
      };
    }

    const applications = await ApplicationService.createApplications({
      bookIds,
      userId,
      fromDate,
      toDate,
      quantity,
    });

    return {
      status: HttpStatusCode.CREATED,
      data: applications,
      message: MESSAGE.API.APPLICATION_CREATED,
    };
  }

  static async getApplicationsByUser(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "User ID is required",
      };
    }

    const applications = await ApplicationService.getApplicationsByUser(userId);

    return {
      status: HttpStatusCode.OK,
      data: applications,
      message: MESSAGE.API.GET_APPLICATIONS,
    };
  }

  static async getAllApplications() {
    const applications = await ApplicationService.getAllApplications();

    return {
      status: HttpStatusCode.OK,
      data: applications,
      message: MESSAGE.API.GET_APPLICATIONS,
    };
  }

  static async updateApplicationStatus(
    req: NextRequest,
    context: { params: { id: string } },
  ) {
    const { id } = await context.params;
    const { status, adminId } = await req.json();

    if (!status || !adminId) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Status and Admin ID are required",
      };
    }

    const updatedApplication = await ApplicationService.updateApplicationStatus(
      {
        applicationId: id,
        status,
        adminId,
      },
    );

    return {
      status: HttpStatusCode.OK,
      data: updatedApplication,
      message: MESSAGE.API.APPLICATION_UPDATED,
    };
  }

  static async deleteApplication(
    req: NextRequest,
    context: { params?: { id: string } },
  ) {
    const { id } = (await context.params) as { id: string };

    if (!id) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Application ID is required",
      };
    }

    const result = await ApplicationService.deleteApplication(id);

    return {
      status: HttpStatusCode.OK,
      data: result,
      message: "Application cancelled successfully",
    };
  }

  static async updateApplication(
    req: NextRequest,
    context: { params?: { id: string } },
  ) {
    const { id } = (await context.params) as { id: string };
    const { quantity, fromDate, toDate } = await req.json();

    if (!id || !quantity || !fromDate || !toDate) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Missing required fields",
      };
    }

    const result = await ApplicationService.updateApplication({
      applicationId: id,
      quantity,
      fromDate,
      toDate,
    });

    return {
      status: HttpStatusCode.OK,
      data: result,
      message: "Application updated successfully",
    };
  }

  static async requestReturn(
    req: NextRequest,
    context: { params?: { id: string } },
  ) {
    const { id } = (await context.params) as { id: string };

    if (!id) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Application ID is required",
      };
    }

    const result = await ApplicationService.requestReturn(id);

    return {
      status: HttpStatusCode.OK,
      data: result,
      message: "Return request submitted successfully",
    };
  }

  static async getApplicationsByAdmin(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Admin ID is required",
      };
    }

    const applications = await ApplicationService.getApplicationsByAdmin(adminId);

    return {
      status: HttpStatusCode.OK,
      data: applications,
      message: MESSAGE.API.GET_APPLICATIONS,
    };
  }
}
