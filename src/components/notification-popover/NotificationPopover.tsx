"use client";

import { useEffect, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { IconBellFilled, IconChecks } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuthUser } from "@/providers/AuthProvider";
import { ApiClient } from "@/wrapper/ApiClient";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NotificationPopover() {
    const { user } = useAuthUser();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!user?.userId) return;
        try {
            const res = await ApiClient(() => ({
                url: `/api/notifications?userId=${user.userId}`,
                method: "GET",
            }));
            if (res.status === 200) {
                const data = res.data as any[];
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.isRead).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            const res = await ApiClient(() => ({
                url: `/api/notifications?notificationId=${id}`,
                method: "PATCH",
            }));
            if (res.status === 200) {
                setNotifications((prev) =>
                    prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const markAllAsRead = async () => {
        if (!user?.userId) return;
        try {
            const res = await ApiClient(() => ({
                url: `/api/notifications?action=readAll&userId=${user.userId}`,
                method: "PATCH",
            }));
            if (res.status === 200) {
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-full cursor-pointer hover:bg-muted"
                >
                    <IconBellFilled size={20} className="text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mr-4" align="end">
                <div className="flex items-center justify-between p-4 pb-2">
                    <h4 className="text-sm font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-primary hover:bg-primary/10 cursor-pointer"
                            onClick={markAllAsRead}
                        >
                            <IconChecks size={14} className="mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>
                <Separator />
                <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                            <IconBellFilled size={32} className="mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((n) => (
                                <div
                                    key={n._id}
                                    className={cn(
                                        "relative flex flex-col gap-1 p-4 text-sm transition-colors hover:bg-muted/50 cursor-pointer border-b last:border-0",
                                        !n.isRead && "bg-muted/30"
                                    )}
                                    onClick={() => !n.isRead && markAsRead(n._id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={cn(
                                                "font-semibold",
                                                n.type === "SUCCESS"
                                                    ? "text-green-600 dark:text-green-400"
                                                    : n.type === "ERROR"
                                                        ? "text-red-600 dark:text-red-400"
                                                        : "text-foreground"
                                            )}
                                        >
                                            {n.title}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {formatDistanceToNow(new Date(n.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {n.message}
                                    </p>
                                    {!n.isRead && (
                                        <span className="absolute top-4 right-1 h-2 w-2 rounded-full bg-primary" />
                                    )}
                                    {n.link && (
                                        <Link
                                            href={n.link}
                                            className="text-[10px] text-primary hover:underline mt-1"
                                        >
                                            View details
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
