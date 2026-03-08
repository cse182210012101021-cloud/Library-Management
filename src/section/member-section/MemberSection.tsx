"use client";

import DataTable from "@/components/DataTable/DataTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { TableHeaders } from "@/constant/default-values/MemberTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppRouterUtils } from "@/utils/AppRouterUtils";
import { useState } from "react";

interface IStudentReference {
  studentId: string;
  name: string;
  department: string;
  batch: number;
}

interface IMemberItem {
  _id: string;
  referenceId: IStudentReference | null;
  totalBorrowed: number;
  totalReturned: number;
  charges: number;
}

interface MemberProps {
  members: IMemberItem[];
}

export default function MemberSection({ members }: MemberProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const tableData = members.map((member) => ({
    _id: member._id,
    registrationNo: member.referenceId?.studentId || "N/A",
    name: member.referenceId?.name || "N/A",
    department: member.referenceId?.department || "N/A",
    session: member.referenceId?.batch?.toString() || "N/A",
    totalBorrowed: member.totalBorrowed || 0,
    totalReturned: member.totalReturned || 0,
    charges: member.charges || 0,
  }));

  const filteredData = tableData.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.registrationNo.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.department.toLowerCase().includes(query)
    );
  });

  return (
    <section className="h-full">
      <div className="sticky top-[48px] bg-[var(--background)] ">
        <div className="flex justify-between items-center p-3">
          <h3 className="font-semibold text-2xl">Member List</h3>
          <div className="flex justify-end items-center gap-2 w-1/2 ">
            <InputGroup className="w-1/2 ">
              <InputGroupInput
                placeholder="Search by id or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
        <Separator />
      </div>

      <div className="p-4">
        <DataTable
          headers={TableHeaders}
          data={filteredData}
          actionLabel="View Details"
          renderAction={(row) => (
            <Button
              asChild
              className="h-8 uppercase font-black tracking-widest text-[10px]"
            >
              <Link href={AppRouterUtils.MEMBER_DETAILS(row.registrationNo)}>
                View
              </Link>
            </Button>
          )}
        />
      </div>
    </section>
  );
}
