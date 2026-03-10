import mongoose from "mongoose";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import Application from "@/model/Application";
import Book from "@/model/Book";
import { ApiError } from "@/wrapper/ApiError";
import { ApplicationStatus } from "@/constant/enum/ApplicationStatus";
import { NotificationService } from "./NotificationService";
import { NotificationType } from "@/model/Notification";
import { MemberService } from "./MemberService";

export class ApplicationService {
  static async createApplications({
    bookIds,
    userId,
    fromDate,
    toDate,
    quantity,
  }: {
    bookIds: string[];
    userId: string;
    fromDate: string;
    toDate: string;
    quantity: number;
  }) {
    // Check if books exist
    for (const bookId of bookIds) {
      const book = await Book.findById(bookId);
      if (!book) {
        throw new ApiError(
          `Book with ID ${bookId} not found`,
          HttpStatusCode.NOT_FOUND,
        );
      }
    }

    const newApplication = await Application.create({
      bookIds,
      userId,
      status: ApplicationStatus.PENDING,
      appliedDate: new Date(),
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      quantity,
    });

    // Trigger Notifications
    // 1. Notify the student
    await NotificationService.createNotification({
      userId: userId,
      title: "Request Sent",
      message: `Your book application (ID: ${(newApplication as any)._id.toString().slice(-6).toUpperCase()}) has been submitted.`,
      type: NotificationType.INFO,
      link: "/applications",
    });

    // 2. Notify all admins
    const adminIds = await MemberService.getAdminIds();
    for (const adminId of adminIds) {
      await NotificationService.createNotification({
        userId: adminId,
        title: "New Request Received",
        message: `A new book application has been submitted (ID: ${(newApplication as any)._id.toString().slice(-6).toUpperCase()}).`,
        type: NotificationType.INFO,
        link: "/applications",
      });
    }

    return newApplication;
  }

  static async getApplicationsByUser(userId: string) {
    const applications = await Application.find({ userId })
      .populate("bookIds")
      .populate({
        path: "userId",
        populate: {
          path: "referenceId",
        },
      })
      .sort({ createdAt: -1 });
    return applications;
  }

  static async getAllApplications() {
    const applications = await Application.find()
      .populate("bookIds")
      .populate({
        path: "userId",
        populate: {
          path: "referenceId",
        },
      })
      .sort({ createdAt: -1 });
    return applications;
  }

  static async updateApplicationStatus({
    applicationId,
    status,
    adminId,
  }: {
    applicationId: string;
    status: ApplicationStatus;
    adminId: string;
  }) {
    const application =
      await Application.findById(applicationId).populate("bookIds");
    if (!application) {
      throw new ApiError("Application not found", HttpStatusCode.NOT_FOUND);
    }

    // Handle stock when approved
    if (status === ApplicationStatus.APPROVED) {
      for (const book of application.bookIds as any) {
        if (!book || typeof book === "string") continue;

        const qty = application.quantity || 1;
        if (book.totalAvailable < qty) {
          throw new ApiError(
            `Insufficient quantity for book: ${book.title}. Available: ${book.totalAvailable}, Requested: ${qty}`,
            HttpStatusCode.BAD_REQUEST,
          );
        }

        book.totalAvailable -= qty;
        await book.save();
      }
    }

    // Handle stock and fine when returned
    if (status === ApplicationStatus.RETURNED) {
      // Calculate fine
      const today = new Date();
      const toDate = new Date(application.toDate);

      if (today > toDate) {
        const diffTime = Math.abs(today.getTime() - toDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const fineRule = await mongoose.model("fineRules").findOne();
        if (fineRule) {
          const fineDays = Math.max(0, diffDays - fineRule.gracePeriod);
          application.fineAmount = fineDays * fineRule.chargesPerDay;
        }
      }

      application.returnDate = today;

      // Increment stock
      for (const book of application.bookIds as any) {
        if (!book || typeof book === "string") continue;
        const qty = application.quantity || 1;
        book.totalAvailable += qty;
        await book.save();
      }
    }

    application.status = status;
    application.updatedBy = adminId as unknown as mongoose.Types.ObjectId;
    await application.save();

    // Trigger Notification
    const isReturned = status === ApplicationStatus.RETURNED;
    const fineText = isReturned && application.fineAmount && application.fineAmount > 0
      ? ` with a fine of ${application.fineAmount}.`
      : ".";

    await NotificationService.createNotification({
      userId: application.userId.toString(),
      title: `Application ${status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}`,
      message: `Your book application (ID: ${(application as any)._id.toString().slice(-6).toUpperCase()}) has been ${status.toLowerCase()}${fineText}`,
      type: status === ApplicationStatus.APPROVED ? NotificationType.SUCCESS : status === ApplicationStatus.REJECTED ? NotificationType.ERROR : NotificationType.INFO,
      link: "/applications",
    });

    return application;
  }

  static async requestReturn(applicationId: string) {
    const application = await Application.findById(applicationId);
    if (!application) {
      throw new ApiError("Application not found", HttpStatusCode.NOT_FOUND);
    }

    if (application.status !== ApplicationStatus.APPROVED) {
      throw new ApiError(
        "Only approved applications can be returned",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    application.status = ApplicationStatus.RETURN_PENDING;
    await application.save();

    // Notify Admins (For now, just a generic system notification or notify all admins if needed)
    // In a real app we might fetch all admins, here we can at least notify the user that their request is sent.
    await NotificationService.createNotification({
      userId: application.userId.toString(),
      title: "Return Request Sent",
      message: "Your request to return the book has been submitted and is pending admin approval.",
      type: NotificationType.INFO,
      link: "/applications",
    });

    return application;
  }

  static async deleteApplication(applicationId: string) {
    const application = await Application.findById(applicationId);
    if (!application) {
      throw new ApiError("Application not found", HttpStatusCode.NOT_FOUND);
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new ApiError(
        "Only pending applications can be cancelled",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    await application.deleteOne();
    return { message: "Application cancelled successfully" };
  }

  static async updateApplication({
    applicationId,
    quantity,
    fromDate,
    toDate,
  }: {
    applicationId: string;
    quantity: number;
    fromDate: string;
    toDate: string;
  }) {
    const application = await Application.findById(applicationId);
    if (!application) {
      throw new ApiError("Application not found", HttpStatusCode.NOT_FOUND);
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new ApiError(
        "Only pending applications can be updated",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    application.quantity = quantity;
    application.fromDate = new Date(fromDate);
    application.toDate = new Date(toDate);

    await application.save();
    return application;
  }

  static async getApplicationsByAdmin(adminId: string) {
    const applications = await Application.find({ updatedBy: adminId })
      .populate("bookIds")
      .populate({
        path: "userId",
        populate: {
          path: "referenceId",
        },
      })
      .sort({ updatedAt: -1 });
    return applications;
  }
}

