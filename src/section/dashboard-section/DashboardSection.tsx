"use client";

import SummaryCard from "@/components/summary-card/SummaryCard";
import ChartArea from "@/components/chart-area/ChartArea";
import DataTable from "@/components/DataTable/DataTable";
import {
  BookTableHeaders,
  UserTableHeaders,
} from "@/constant/default-values/DashboardTables";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ApiClient } from "@/wrapper/ApiClient";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useAuthUser } from "@/providers/AuthProvider";
import { UserType } from "@/constant/enum/UserType";

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
      <CardSection stats={data?.stats || {}} userType={user?.userType} />
      <ChartArea chartData={data?.chartData || []} userType={user?.userType} />
      <TableSection books={data?.recentBooks || []} members={data?.recentMembers || []} userType={user?.userType} />
    </section>
  );
}

const CardSection = ({ stats, userType }: { stats: any, userType: any }) => (
  <div className="flex justify-center gap-5 overflow-x-auto pb-2">
    <SummaryCard
      label="Total Books"
      value={stats.totalBooks?.toString() || "0"}
      change=""
      trend="up"
      description="Books in the system"
      footer="Overall Collection"
    />
    {userType !== UserType.STUDENT && (
      <SummaryCard
        label="Total Members"
        value={stats.totalMembers?.toString() || "0"}
        change=""
        trend="up"
        description="Registered Students"
        footer="System Users"
      />
    )}
    <SummaryCard
      label="Total Requests"
      value={stats.totalApplications?.toString() || "0"}
      change=""
      trend="up"
      description="All time applications"
      footer="Borrow & Return requests"
    />
    <SummaryCard
      label="Pending Actions"
      value={stats.pendingApplications?.toString() || "0"}
      change=""
      trend="up"
      description="Requires admin attention"
      footer="Pending applications"
    />
  </div>
);

const TableSection = ({ books, members, userType }: { books: any[], members: any[], userType: any }) => (
  <div className="flex items-start gap-5">
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
    {userType !== UserType.STUDENT && (
      <DataTable
        headers={UserTableHeaders}
        data={members}
        actionLabel="Details"
        renderAction={(data) => (
          <Link href={`/members/${data?.memberId}`}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
        )}
      />
    )}
  </div>
);
