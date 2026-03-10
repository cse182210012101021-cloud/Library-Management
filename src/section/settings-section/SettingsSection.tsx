"use client";

import { useState } from "react";
import { useAuthUser } from "@/providers/AuthProvider";
import { ApiClient } from "@/wrapper/ApiClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { KeyRound, Moon, Sun, Shield } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsSection() {
    const { user } = useAuthUser();
    const { theme, setTheme } = useTheme();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !currentPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        try {
            const res = await ApiClient(() => ({
                url: "/api/me/change-password",
                method: "POST",
                body: {
                    userId: user?.userId,
                    currentPassword,
                    newPassword,
                },
            }));

            if (res.success) {
                toast.success("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(res.message || "Failed to change password");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const isDark = theme === "dark";

    return (
        <section className="max-w-2xl mx-auto p-5 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Manage your account settings and preferences.
                </p>
            </div>

            {/* --- Change Password --- */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Security</CardTitle>
                    </div>
                    <CardDescription>Update your account password.</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-5">
                    <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* --- Appearance --- */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        {isDark ? (
                            <Moon className="h-5 w-5 text-primary" />
                        ) : (
                            <Sun className="h-5 w-5 text-primary" />
                        )}
                        <CardTitle className="text-lg">Appearance</CardTitle>
                    </div>
                    <CardDescription>Customize how the application looks.</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-muted-foreground">
                                Switch between light and dark theme.
                            </p>
                        </div>
                        <Switch
                            checked={isDark}
                            onCheckedChange={(checked) =>
                                setTheme(checked ? "dark" : "light")
                            }
                        />
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
