import { apiHandler } from "@/wrapper/ApiHandler";
import { NotificationService } from "@/services/NotificationService";
import { NextResponse } from "next/server";

export const GET = apiHandler(async (req) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ success: false, message: "UserId is required" }, { status: 400 });
    }

    const notifications = await NotificationService.getNotificationsByUser(userId);
    return { success: true, data: notifications };
});

export const PATCH = apiHandler(async (req) => {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const userId = searchParams.get("userId");
    const notificationId = searchParams.get("notificationId");

    if (action === "readAll" && userId) {
        await NotificationService.markAllAsRead(userId);
        return { success: true, message: "All notifications marked as read" };
    }

    if (notificationId) {
        await NotificationService.markAsRead(notificationId);
        return { success: true, message: "Notification marked as read" };
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
});
