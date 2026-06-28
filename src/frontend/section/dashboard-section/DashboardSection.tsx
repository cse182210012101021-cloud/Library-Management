"use client";

import SummaryCard from "@/frontend/components/summary-card/SummaryCard";
import ChartArea from "@/frontend/components/chart-area/ChartArea";
import DataTable from "@/frontend/components/DataTable/DataTable";
import {
  BookTableHeaders,
  UserTableHeaders,
  StudentApplicationHeaders
} from "@/shared/constant/default-values/DashboardTables";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { useEffect, useState } from "react";
import { ApiClient } from "@/frontend/wrapper/ApiClient";
import { Skeleton } from "@/frontend/components/ui/skeleton";
import Link from "next/link";
import { useAuthUser } from "@/shared/providers/AuthProvider";
import { UserType } from "@/shared/constant/enum/UserType";

export default function DashboardSection() {
  const { user } = useAuthUser();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const res = await ApiClient(() => ({
          url: `/api/dashboard?userId=${user?.userId}&userType=${user?.userType}`,
          method: "GET",
        }));
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.userId) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <section className="h-full p-5 flex flex-col gap-5">
        <div className="flex justify-center gap-5 overflow-x-auto pb-2">
          <Skeleton className="h-[150px] w-64 rounded-xl" />
          <Skeleton className="h-[150px] w-64 rounded-xl" />
          <Skeleton className="h-[150px] w-64 rounded-xl" />
          <Skeleton className="h-[150px] w-64 rounded-xl" />
        </div>
        <Skeleton className="h-[350px] w-full rounded-xl" />
        <div className="flex gap-5">
          <Skeleton className="h-[300px] w-1/2 rounded-xl" />
          <Skeleton className="h-[300px] w-1/2 rounded-xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="h-full p-5 flex flex-col gap-5">
      {user?.userType === UserType.STUDENT && data?.studentInfo && (
        <StudentInfoCard info={data.studentInfo} />
      )}
      <CardSection stats={data?.stats || {}} userType={user?.userType} />
      <ChartArea chartData={data?.chartData || []} userType={user?.userType} />
      <TableSection 
        books={data?.recentBooks || []} 
        members={data?.recentMembers || []}
        applications={data?.recentApplications || []}
        userType={user?.userType} 
      />
    </section>
  );
}

const CardSection = ({ stats, userType }: { stats: any, userType: any }) => (
  <div className="flex justify-center gap-5 overflow-x-auto pb-2">
    <Link href="/books" className="block hover:opacity-90 transition-opacity">
      <SummaryCard
        label="Total Books"
        value={stats.totalBooks?.toString() || "0"}
        change=""
        trend="up"
        description="Books in the system"
        footer="Overall Collection"
      />
    </Link>
    {userType !== UserType.STUDENT && (
      <Link href="/members" className="block hover:opacity-90 transition-opacity">
        <SummaryCard
          label="Total Members"
          value={stats.totalMembers?.toString() || "0"}
          change=""
          trend="up"
          description="Registered Students"
          footer="System Users"
        />
      </Link>
    )}
    <Link href="/applications" className="block hover:opacity-90 transition-opacity">
      <SummaryCard
        label="Total Requests"
        value={stats.totalApplications?.toString() || "0"}
        change=""
        trend="up"
        description="All time applications"
        footer="Borrow & Return requests"
      />
    </Link>
    <Link href="/applications" className="block hover:opacity-90 transition-opacity">
      <SummaryCard
        label="Pending Actions"
        value={stats.pendingApplications?.toString() || "0"}
        change=""
        trend="up"
        description="Requires admin attention"
        footer="Pending applications"
      />
    </Link>
  </div>
);

const TableSection = ({ books, members, applications, userType }: { books: any[], members: any[], applications: any[], userType: any }) => (
  <div className="flex items-start gap-5">
    {userType === UserType.STUDENT ? (
      <DataTable
        headers={StudentApplicationHeaders}
        data={applications}
        actionLabel="Details"
        renderAction={(data) => (
          <Link href={`/applications`}>
            <Button variant="outline" size="sm">View Request</Button>
          </Link>
        )}
      />
    ) : (
      <DataTable
        headers={BookTableHeaders}
        data={books}
        actionLabel="Details"
        renderAction={(data) => (
          <Link href={`/books/${data?.bookId}`}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
        )}
      />
    )}
    
    {userType !== UserType.STUDENT && (
      <DataTable
        headers={UserTableHeaders}
        data={members}
        actionLabel="Details"
        renderAction={(data) => (
          <Link href={`/members/${data?.registrationNo}`}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
        )}
      />
    )}
  </div>
);

const StudentInfoCard = ({ info }: { info: any }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Welcome, {info.name}</CardTitle>
      <CardDescription>Student Dashboard</CardDescription>
    </CardHeader>
    <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Student ID</p>
        <p className="font-medium">{info.studentId}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Department</p>
        <p className="font-medium">{info.department}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Batch</p>
        <p className="font-medium">{info.batch}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Email</p>
        <p className="font-medium">{info.email}</p>
      </div>
    </CardContent>
  </Card>
);
