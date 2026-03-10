import Notification, { NotificationType } from "@/model/Notification";
import mongoose from "mongoose";

export class NotificationService {
    static async createNotification({
        userId,
        title,
        message,
        type = NotificationType.INFO,
        link,
    }: {
        userId: string;
        title: string;
        message: string;
        type?: NotificationType;
        link?: string;
    }) {
        return await Notification.create({
            userId: new mongoose.Types.ObjectId(userId),
            title,
            message,
            type,
            link,
        });
    }

    static async getNotificationsByUser(userId: string) {
        return await Notification.find({ userId: new mongoose.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .limit(50);
    }

    static async markAsRead(notificationId: string) {
        return await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );
    }

    static async markAllAsRead(userId: string) {
        return await Notification.updateMany(
            { userId: new mongoose.Types.ObjectId(userId), isRead: false },
            { isRead: true }
        );
    }

    static async deleteNotification(notificationId: string) {
        return await Notification.findByIdAndDelete(notificationId);
    }
}
