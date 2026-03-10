import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import Application from "@/model/Application";
import Book from "@/model/Book";
import Member from "@/model/Member";
import { ApplicationStatus } from "@/constant/enum/ApplicationStatus";
import { UserType } from "@/constant/enum/UserType";
import Student from "@/model/Student";

export class DashboardService {
    static async getDashboardData() {
        // 1. Calculate Stats
        const totalBooks = await Book.countDocuments();
        const totalMembers = await Member.countDocuments({ userType: { $ne: UserType.ADMIN } });
        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: ApplicationStatus.PENDING });

        // 2. Chart Data (Last 90 days Books & Users)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const booksByDate = await Book.aggregate([
            { $match: { createdAt: { $gte: ninetyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
        ]);

        const membersByDate = await Member.aggregate([
            { $match: { createdAt: { $gte: ninetyDaysAgo }, userType: { $ne: UserType.ADMIN } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
        ]);

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
                chartDataMap.get(item._id).books = item.count;
            }
        });

        membersByDate.forEach(item => {
            if (chartDataMap.has(item._id)) {
                chartDataMap.get(item._id).users = item.count;
            }
        });

        const chartData = Array.from(chartDataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // 3. Recent Books
        const recentBooks = await Book.find().sort({ createdAt: -1 }).limit(5).select("title author coverImage isbnNo");

        // 4. Recent Members
        const recentMembers = await Member.find({ userType: { $ne: UserType.ADMIN } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("referenceId", "name studentId");

        return {
            stats: {
                totalBooks,
                totalMembers,
                totalApplications,
                pendingApplications
            },
            chartData,
            recentBooks: recentBooks.map(b => ({
                bookName: b.title,
                author: b.author,
                bookId: (b as any)._id.toString(),
            })),
            recentMembers: recentMembers.map(m => {
                const student = m.referenceId as any;
                return {
                    user: student?.name || "Unknown User",
                    registrationNo: student?.studentId || "N/A",
                    email: m.email,
                    memberId: (m as any)._id.toString(),
                }
            })
        };
    }
}
