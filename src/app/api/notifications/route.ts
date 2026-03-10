import { apiHandler } from "@/wrapper/ApiHandler";
import { NotificationService } from "@/services/NotificationService";
import { ApiError } from "@/wrapper/ApiError";

export const GET = apiHandler(async (req) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        throw new ApiError("UserId is required", 400);
    }

    const notifications = await NotificationService.getNotificationsByUser(userId);
    return notifications;
});

export const PATCH = apiHandler(async (req) => {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const notificationId = searchParams.get("notificationId");

    if (action === "readAll" && userId) {
        await NotificationService.markAllAsRead(userId);
        return { message: "All notifications marked as read" };
    }

    if (notificationId) {
        await NotificationService.markAsRead(notificationId);
        return { message: "Notification marked as read" };
    }

    throw new ApiError("Invalid action", 400);
});
