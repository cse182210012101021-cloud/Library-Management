"use client";

import DataTable from "@/components/DataTable/DataTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  IconSearch,
  IconTrash,
  IconPencil,
  IconEye,
  IconRotate2,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { TableHeaders } from "@/constant/default-values/ApplicationTable";
import Dropdown from "@/components/dropdown/Dropdown";
import { ApplicationStatusOptions } from "@/constant/default-values/ApplicationStatusType";
import { useForm } from "react-hook-form";
import { useAuthUser } from "@/providers/AuthProvider";
import { UserType } from "@/constant/enum/UserType";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import DeleteApplicationModal from "@/modals/delete-application-modal/DeleteApplicationModal";
import EditApplicationModal from "@/modals/edit-application-modal/EditApplicationModal";
import { useDeleteApplication } from "@/hooks/use-delete-application";
import { Button } from "@/components/ui/button";
import { useUpdateApplicationStatus } from "@/hooks/use-update-application-status";
import { ApplicationStatus } from "@/constant/enum/ApplicationStatus";
import ViewApplicationDetailsModal from "@/modals/view-application-details-modal/ViewApplicationDetailsModal";
import { useReturnBook } from "@/hooks/use-return-book";

interface ApplicationSectionProps {
  applications: any[];
}

export default function ApplicationSection({
  applications,
}: ApplicationSectionProps) {
  const { user } = useAuthUser();
  const isAdmin = user?.userType === UserType.ADMIN;

  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { deleteApplication, isDeleting } = useDeleteApplication(() => {
    setIsDeleteModalOpen(false);
    setSelectedApp(null);
  });

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { updateStatus } = useUpdateApplicationStatus(() => {
    setLoadingId(null);
  });

  const { returnBook, isReturning } = useReturnBook();

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    if (!user?.userId) return;
    setLoadingId(id);
    const success = await updateStatus(id, status, user.userId);
    if (!success) {
      setLoadingId(null);
    }
  };

  const { control } = useForm({
    mode: "onChange",
  });

  const tableData = applications.map((app) => ({
    ...app,
    appId: app._id.slice(-6).toUpperCase(),
    registrationNo:
      app.userId?.referenceId?.studentId || app.userId?.userId || "N/A",
    applicant: app.userId?.referenceId?.name || app.userId?.name || "N/A",
    applicationDate: format(new Date(app.appliedDate), "PPP"),
    startDate: format(new Date(app.fromDate), "PPP"),
    endDate: format(new Date(app.toDate), "PPP"),
    rawStatus: app.status,
    status: (
      <div className="flex justify-center">
        {isAdmin ? (
          <Dropdown
            name={`status-${app._id}`}
            control={control}
            defaultValue={app.status}
            placeholder="Status"
            options={ApplicationStatusOptions.filter((opt) => {
              if (app.status === ApplicationStatus.RETURN_PENDING) {
                return (
                  opt.value === ApplicationStatus.RETURN_PENDING ||
                  opt.value === ApplicationStatus.RETURNED
                );
              }
              if (app.status === ApplicationStatus.RETURNED) {
                return opt.value === ApplicationStatus.RETURNED;
              }
              return (
                opt.value !== ApplicationStatus.RETURN_PENDING &&
                opt.value !== ApplicationStatus.RETURNED
              );
            })}
            onValueChange={(value) =>
              handleStatusChange(app._id, value as ApplicationStatus)
            }
            loading={loadingId === app._id}
          />
        ) : (
          <Badge
            variant={
              app.status === "APPROVED"
                ? "default"
                : app.status === "REJECTED"
                  ? "destructive"
                  : app.status === "RETURNED"
                    ? "outline"
                    : "secondary"
            }
            className={
              app.status === "RETURN_PENDING"
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : ""
            }
          >
            {app.status === "RETURN_PENDING" ? "RETURN PENDING" : app.status}
          </Badge>
        )}
      </div>
    ),
  }));

  const filteredData = tableData.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.appId.toLowerCase().includes(query) ||
      item.applicant.toLowerCase().includes(query) ||
      item.registrationNo.toLowerCase().includes(query)
    );
  });

  const studentHeaders = TableHeaders.filter(
    (header) => header.value !== "applicant",
  );

  return (
    <section className="h-full">
      <div className="sticky top-[48px] bg-[var(--background)] ">
        <div className="flex justify-between items-center p-3">
          <h3 className="font-semibold text-2xl">Applications</h3>
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
          headers={isAdmin ? TableHeaders : studentHeaders}
          data={filteredData}
          actionLabel="Action"
          renderAction={(row) => (
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="text-green-500 hover:text-green-600 hover:bg-green-500/10 h-8 w-8 cursor-pointer"
                onClick={() => {
                  setSelectedApp(row);
                  setIsDetailsModalOpen(true);
                }}
              >
                <IconEye size={18} />
              </Button>
              {!isAdmin && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 h-8 w-8 cursor-pointer"
                    disabled={row.rawStatus !== "PENDING"}
                    onClick={() => {
                      setSelectedApp(row);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <IconPencil size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8 cursor-pointer"
                    disabled={row.rawStatus !== "PENDING"}
                    onClick={() => {
                      setSelectedApp(row);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <IconTrash size={18} />
                  </Button>
                </>
              )}
              {!isAdmin && row.rawStatus === "APPROVED" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-500/10 h-8 w-8 cursor-pointer"
                  disabled={isReturning}
                  onClick={() => returnBook(row._id)}
                  title="Request Return"
                >
                  <IconRotate2 size={18} />
                </Button>
              )}
            </div>
          )}
        />
      </div>

      <DeleteApplicationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedApp && deleteApplication(selectedApp._id)}
        isDeleting={isDeleting}
      />

      <EditApplicationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        application={selectedApp}
      />

      <ViewApplicationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        application={selectedApp}
      />
    </section>
  );
}
