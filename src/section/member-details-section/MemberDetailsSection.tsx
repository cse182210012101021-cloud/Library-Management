"use client";

import { Separator } from "@/components/ui/separator";
import { TableHeaders } from "@/constant/default-values/MemberDetails";
import DataTable from "@/components/DataTable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useCallback, useEffect, useState } from "react";
import { ApiClient } from "@/wrapper/ApiClient";
import { memberDetailsApi } from "@/constant/ApiRoutes";
import { isErrorResponse } from "@/utils/CommonUtils";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/providers/AlertProvider";

interface MemberDetailsSectionProps {
  memberId: string;
}

export default function MemberDetailsSection({
  memberId,
}: MemberDetailsSectionProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showErrorToast } = useToast();

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    const response = await ApiClient(() => memberDetailsApi(memberId));
    if (!isErrorResponse(response)) {
      setData(response.data);
    } else {
      showErrorToast(
        "Error",
        response.error || "Failed to fetch member details",
      );
    }
    setIsLoading(false);
  }, [memberId, showErrorToast]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center border rounded-lg bg-muted/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const historyData = data.history
    .flatMap((app: any) =>
      app.bookIds.map((book: any) => ({
        _id: app._id,
        bookId: book._id.slice(-6).toUpperCase(),
        bookName: book.title,
        authorName: book.author,
        purchaseDate: format(new Date(app.appliedDate), "PPP"),
        returnDate: app.returnDate
          ? format(new Date(app.returnDate), "PPP")
          : "N/A",
        status: app.status,
      })),
    )
    .map((item: any, index: number) => ({
      ...item,
      serialNo: index + 1,
    }));

  return (
    <section className="h-full relative">
      <div className="sticky top-[48px] bg-[var(--background)] z-10">
        <div className="flex justify-between items-center p-3">
          <h3 className="font-semibold text-2xl">
            {data.referenceId?.name || data.name}
          </h3>
        </div>
        <Separator />
      </div>
      <div className="p-5 flex flex-col gap-4">
        <BasicInfo
          regNo={data.referenceId?.studentId || "N/A"}
          department={data.referenceId?.department || "N/A"}
          session={data.referenceId?.batch || "N/A"}
          charges={data.stats.charges}
          totalBorrowed={data.stats.totalBorrowed}
          totalReturned={data.stats.totalReturned}
        />
        <DataTable
          headers={TableHeaders}
          data={historyData}
          actionLabel="Status"
          renderAction={(row) => (
            <div className="flex justify-end mr-4">
              <Badge
                variant={
                  row.status === "APPROVED"
                    ? "default"
                    : row.status === "REJECTED"
                      ? "destructive"
                      : row.status === "RETURNED"
                        ? "outline"
                        : "secondary"
                }
                className={
                  row.status === "RETURN_PENDING"
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent"
                    : ""
                }
              >
                {row.status.replace("_", " ")}
              </Badge>
            </div>
          )}
        />
      </div>
    </section>
  );
}

const BasicInfo = ({
  regNo,
  department,
  session,
  charges,
  totalBorrowed,
  totalReturned,
}: any) => (
  <div className="flex justify-between items-start bg-muted/30 p-4 rounded-lg border border-border">
    <div className="flex flex-col gap-2">
      <p className="text-sm">
        <span className="font-black uppercase tracking-widest text-[10px] text-muted-foreground mr-2">
          Registration No:
        </span>
        <span className="font-bold">{regNo}</span>
      </p>
      <p className="text-sm">
        <span className="font-black uppercase tracking-widest text-[10px] text-muted-foreground mr-2">
          Department:
        </span>
        <span className="font-bold">{department}</span>
      </p>
      <p className="text-sm">
        <span className="font-black uppercase tracking-widest text-[10px] text-muted-foreground mr-2">
          Session:
        </span>
        <span className="font-bold">{session}</span>
      </p>
    </div>
    <div className="flex flex-col items-end gap-2 text-right">
      <p className="text-sm">
        <span className="font-black uppercase tracking-widest text-[10px] text-muted-foreground ml-2">
          Due Charges:
        </span>
        <span className="font-bold text-red-500 ml-2">{charges} BDT</span>
      </p>
      <p className="text-sm">
        <span className="font-black uppercase tracking-widest text-[10px] text-muted-foreground ml-2">
          Total Borrowed:
        </span>
        <span className="font-bold ml-2">{totalBorrowed}</span>
      </p>
      <p className="text-sm">
        <span className="font-black uppercase tracking-widest text-[10px] text-muted-foreground ml-2">
          Total Returned:
        </span>
        <span className="font-bold ml-2">{totalReturned}</span>
      </p>
    </div>
  </div>
);
