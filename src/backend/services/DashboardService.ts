import { HttpStatusCode } from "@/shared/constant/enum/HttpStatusCode";
import mongoose from "mongoose";
import Application from "@/database/model/Application";
import Book from "@/database/model/Book";
import Member from "@/database/model/Member";
import { ApplicationStatus } from "@/shared/constant/enum/ApplicationStatus";
import { UserType } from "@/shared/constant/enum/UserType";
import Student from "@/database/model/Student";

export class DashboardService {
    static async getDashboardData(userId: string | null, userType: string | null) {
        // 1. Calculate Base Stats for Books
        const totalBooks = await Book.countDocuments();

        // Conditional variables
        let totalMembers = 0;
        let totalApplications = 0;
        let pendingApplications = 0;

        let studentInfo = null;
        if (userType === UserType.STUDENT && userId) {
            // Fetch only student's application stats
            const memberIdObj = new mongoose.Types.ObjectId(userId);
            totalApplications = await Application.countDocuments({ userId: memberIdObj });
            pendingApplications = await Application.countDocuments({ userId: memberIdObj, status: ApplicationStatus.PENDING });
            
            const member = await Member.findById(userId).populate("referenceId");
            if (member && member.referenceId) {
                const student = member.referenceId as any;
                studentInfo = {
                    name: student.name,
                    studentId: student.studentId,
                    department: student.department,
                    batch: student.batch,
                    email: member.email,
                    image: member.image || student.image
                };
            }
        } else {
            // Fetch admin view
            totalMembers = await Member.countDocuments({ userType: { $ne: UserType.ADMIN } });
            totalApplications = await Application.countDocuments();
            pendingApplications = await Application.countDocuments({ status: ApplicationStatus.PENDING });
        }

        // 2. Chart Data (Last 90 days Books & Users)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        let booksByDate = [];
        if (userType === UserType.STUDENT && userId) {
            booksByDate = await Application.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: ninetyDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 },
                        pendingCount: {
                            $sum: { $cond: [{ $eq: ["$status", ApplicationStatus.PENDING] }, 1, 0] }
                        }
                    },
                },
            ]);
        } else {
            booksByDate = await Book.aggregate([
                { $match: { createdAt: { $gte: ninetyDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 },
                    },
                },
            ]);
        }

        let membersByDate: any[] = [];
        if (userType !== UserType.STUDENT) {
            membersByDate = await Member.aggregate([
                { $match: { createdAt: { $gte: ninetyDaysAgo }, userType: { $ne: UserType.ADMIN } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 },
                    },
                },
            ]);
        }

        // Map to normalized chart array
        const chartDataMap = new Map();

        // Initialize exactly 90 days with 0
        for (let i = 0; i < 90; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            chartDataMap.set(dateStr, { date: dateStr, books: 0, users: 0 });
        }

        booksByDate.forEach(item => {
            if (chartDataMap.has(item._id)) {
                const dayData = chartDataMap.get(item._id);
                dayData.books = item.count;
                if (userType === UserType.STUDENT) {
                    dayData.users = item.pendingCount || 0;
                }
            }
        });

        if (userType !== UserType.STUDENT) {
            membersByDate.forEach(item => {
                if (chartDataMap.has(item._id)) {
                    chartDataMap.get(item._id).users = item.count;
                }
            });
        }

        const chartData = Array.from(chartDataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // 3. Recent Books / Applications
        let recentBooks: any[] = [];
        let recentApplications: any[] = [];

        if (userType === UserType.STUDENT && userId) {
            const apps = await Application.find({ userId: new mongoose.Types.ObjectId(userId) })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("bookIds", "title author");
            
            recentApplications = apps.map(app => {
                const bookTitles = (app.bookIds as any[]).map(b => b.title).join(", ");
                return {
                    applicationId: (app as any)._id.toString(),
                    bookName: bookTitles || "Unknown Book",
                    status: app.status,
                    appliedDate: app.appliedDate ? app.appliedDate.toISOString().split("T")[0] : "N/A"
                };
            });
        } else {
            const rb = await Book.find().sort({ createdAt: -1 }).limit(5).select("title author coverImage _id");
            recentBooks = rb.map(b => ({
                bookName: b.title,
                author: b.author,
                bookId: (b as any)._id.toString(),
            }));
        }

        // 4. Recent Members (Admin only)
        let recentMembersData: any[] = [];
        if (userType !== UserType.STUDENT) {
            const recentMembers = await Member.find({ userType: { $ne: UserType.ADMIN } })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("referenceId", "name studentId");

            recentMembersData = recentMembers.map(m => {
                const student = m.referenceId as any;
                return {
                    user: student?.name || "Unknown User",
                    registrationNo: student?.studentId || "N/A",
                    email: m.email,
                    memberId: (m as any)._id.toString(),
                }
            });
        }

        return {
            stats: {
                totalBooks,
                totalMembers,
                totalApplications,
                pendingApplications
            },
            chartData,
            studentInfo,
            recentBooks,
            recentApplications,
            recentMembers: recentMembersData
        };
    }
}
