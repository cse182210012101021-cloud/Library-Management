"use client";

import InputFile from "@/components/input-file/InputFile";
import { Separator } from "@/components/ui/separator";
import DataTable from "@/components/DataTable/DataTable";
import { TableHeaders } from "@/constant/default-values/MemberDetails";
import { BookStatusMap } from "@/constant/default-values/BookStatusOptions";
import { Badge } from "@/components/ui/badge";
import { BookStatus } from "@/constant/enum/BookStatus";
import TablePagination from "@/components/table-pagination/TablePagination";
import { useEffect, useState, useMemo } from "react";
import { useAuthUser } from "@/providers/AuthProvider";
import { ApiClient } from "@/wrapper/ApiClient";
import { ApplicationStatus } from "@/constant/enum/ApplicationStatus";
import { UserType } from "@/constant/enum/UserType";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PAGE_LIMIT } from "@/constant/ApplicationConstant";
import { useToast } from "@/providers/AlertProvider";
import { updateMeApi } from "@/constant/ApiRoutes";

export default function ProfileSection() {
  const { user } = useAuthUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [profileData, setProfileData] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccessToast, showErrorToast } = useToast();
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  const { control, reset, watch } = useForm({
    defaultValues: {
      profileImage: "",
    },
  });

  const profileImage = watch("profileImage");

  useEffect(() => {
    const updateProfileImage = async () => {
      if (
        profileImage !== undefined &&
        profileData &&
        profileImage !== (profileData.referenceId?.image || profileData.image || "") &&
        !isUpdatingImage
      ) {
        setIsUpdatingImage(true);
        try {
          const res = await ApiClient(updateMeApi, { image: profileImage });
          if (res.success) {
            showSuccessToast("Profile image updated successfully");
            setProfileData((prev: any) => ({
              ...prev,
              image: profileImage,
              ...(prev.referenceId ? { referenceId: { ...prev.referenceId, image: profileImage } } : {})
            }));
          } else {
            showErrorToast(res.error || "Failed to update profile image");
          }
        } catch (error) {
          console.error("Error updating profile image", error);
          showErrorToast("Error updating profile image");
        } finally {
          setIsUpdatingImage(false);
        }
      }
    };

    updateProfileImage();
  }, [profileImage, profileData, showSuccessToast, showErrorToast]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;

      setIsLoading(true);
      try {
        // Fetch current user details from real-time API
        const meRes = await ApiClient(() => ({
          url: `/api/me`,
          method: "GET",
        }));

        if (meRes.success) {
          const userData = meRes.data;
          const nameFallback =
            userData.userType === UserType.ADMIN ? "ADMIN" : "User";
          setProfileData({
            ...userData,
            name: userData.referenceId?.name || userData.name || nameFallback,
            email: userData.email,
            studentId: userData.referenceId?.studentId,
            session: userData.referenceId?.batch, // Map batch to session
            image: userData.referenceId?.image || userData.image,
          });

          reset({
            profileImage: userData.referenceId?.image || userData.image || "",
          });

          // Fetch borrow history based on user type
          if (userData.userType === UserType.STUDENT) {
            const appRes = await ApiClient(() => ({
              url: `/api/student/application?userId=${user.userId}`,
              method: "GET",
            }));
            if (appRes.success) {
              setApplications(appRes.data);
            }
          } else if (userData.userType === UserType.ADMIN) {
            const appRes = await ApiClient(() => ({
              url: `/api/application/history?adminId=${user.userId}`,
              method: "GET",
            }));
            if (appRes.success) {
              setApplications(appRes.data);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, reset]);

  const stats = useMemo(() => {
    if (user?.userType === UserType.ADMIN) {
      const totalApproved = applications.filter((app) => [ApplicationStatus.APPROVED, ApplicationStatus.RETURN_PENDING, ApplicationStatus.RETURNED].includes(app.status)).length;
      const totalRejected = applications.filter((app) => app.status === ApplicationStatus.REJECTED).length;
      const totalReturned = applications.filter((app) => app.status === ApplicationStatus.RETURNED).length;
      return { totalApproved, totalRejected, totalReturned };
    }

    const totalBorrowed = applications.filter((app) =>
      [
        ApplicationStatus.APPROVED,
        ApplicationStatus.RETURN_PENDING,
        ApplicationStatus.RETURNED,
      ].includes(app.status),
    ).length;

    const totalReturned = applications.filter(
      (app) => app.status === ApplicationStatus.RETURNED,
    ).length;

    return { totalBorrowed, totalReturned };
  }, [applications, user?.userType]);

  const tableData = useMemo(() => {
    return applications.map((app, index) => {
      const book = app.bookIds?.[0] || {};
      const studentName = app.userId?.referenceId?.name || "Unknown Student";

      return {
        serialNo: index + 1,
        bookId: book.isbnNo || "N/A",
        bookName: book.title || "Unknown Book",
        studentName: user?.userType === UserType.ADMIN ? studentName : undefined,
        authorName: user?.userType === UserType.STUDENT ? (book.author || "Unknown Author") : undefined,
        purchaseDate: app.appliedDate
          ? format(new Date(app.appliedDate), "dd MMM, yyyy")
          : "N/A",
        returnDate: app.returnDate
          ? format(new Date(app.returnDate), "dd MMM, yyyy")
          : "N/A",
        status: app.status,
        updatedAt: app.updatedAt ? format(new Date(app.updatedAt), "dd MMM, yyyy hh:mm a") : "N/A"
      };
    });
  }, [applications, user?.userType]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * DEFAULT_PAGE_LIMIT;
    return tableData.slice(start, start + DEFAULT_PAGE_LIMIT);
  }, [tableData, currentPage]);

  if (isLoading) {
    return <ProfileSkeleton userType={user?.userType as UserType} />;
  }

  return (
    <section className="relative">
      <div className="sticky top-[48px] bg-[var(--background)] ">
        <div className="flex justify-between items-center p-3">
          <h3 className="font-semibold text-2xl">
            {profileData?.name ||
              (user?.userType === UserType.ADMIN ? "ADMIN" : "User Name")}
          </h3>
        </div>
        <Separator />
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-5">
          <div className="h-[180px] w-[200px]">
            <InputFile
              control={control}
              name="profileImage"
              description="upload profile image"
            />
          </div>
          <div className="w-full flex flex-col gap-3">
            <p>
              <span className="font-semibold mr-3">Role:</span>
              {user?.userType}
            </p>
            {user?.userType === UserType.STUDENT ? (
              <>
                <p>
                  <span className="font-semibold mr-3">Student Id:</span>
                  {profileData?.studentId}
                </p>
                <p>
                  <span className="font-semibold mr-3">Session:</span>
                  {profileData?.session}
                </p>
                <p>
                  <span className="font-semibold mr-3">
                    Total Borrowed Books:
                  </span>
                  {stats.totalBorrowed}
                </p>
                <p>
                  <span className="font-semibold mr-3">
                    Total Returned Books:
                  </span>
                  {stats.totalReturned}
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="font-semibold mr-3">Email:</span>
                  {profileData?.email}
                </p>
                <p>
                  <span className="font-semibold mr-3">
                    Approved Applications:
                  </span>
                  {stats.totalApproved || 0}
                </p>
                <p>
                  <span className="font-semibold mr-3">
                    Rejected Applications:
                  </span>
                  {stats.totalRejected || 0}
                </p>
                <p>
                  <span className="font-semibold mr-3">
                    Returned Actions:
                  </span>
                  {stats.totalReturned || 0}
                </p>
              </>
            )}
          </div>
        </div>

        {user?.userType === UserType.STUDENT && (
          <div className="flex flex-col gap-4">
            <DataTable
              headers={TableHeaders}
              data={paginatedData}
              actionLabel="Status"
              renderAction={(data) => {
                const badge = getVariant(data?.status);
                return (
                  <Badge variant={badge.variant} className="w-[90px]">
                    {badge.label}
                  </Badge>
                );
              }}
            />
            {applications.length > DEFAULT_PAGE_LIMIT && (
              <TablePagination
                totalItems={applications.length}
                currentPage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                }}
              />
            )}
          </div>
        )}

        {user?.userType === UserType.ADMIN && (
          <div className="flex flex-col gap-4 mt-8">
            <h4 className="text-xl font-semibold mb-2">History of Actions</h4>
            <DataTable
              headers={[
                { value: "serialNo", label: "S.N" },
                { value: "bookName", label: "Book Name" },
                { value: "studentName", label: "Student Name" },
                { value: "purchaseDate", label: "Applied Date" },
                { value: "updatedAt", label: "Action Date" },
              ]}
              data={paginatedData}
              actionLabel="Action Taken"
              renderAction={(data) => {
                const badge = getVariant(data?.status);
                return (
                  <Badge variant={badge.variant} className="w-[90px]">
                    {badge.label}
                  </Badge>
                );
              }}
            />
            {applications.length > DEFAULT_PAGE_LIMIT && (
              <TablePagination
                totalItems={applications.length}
                currentPage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const getVariant = (status: string) => {
  switch (status) {
    case BookStatus.BORROWED:
      return { label: BookStatusMap[status], variant: "secondary" as const };
    case BookStatus.TIME_EXCEEDED:
      return { label: BookStatusMap[status], variant: "destructive" as const };
    default:
      return {
        label: BookStatusMap[BookStatus.RETURNED],
        variant: "default" as const,
      };
  }
};

const ProfileSkeleton = ({ userType }: { userType: UserType }) => {
  return (
    <section className="relative">
      <div className="sticky top-[48px] bg-[var(--background)]">
        <div className="p-3">
          <Skeleton className="h-8 w-64 bg-muted/20" />
        </div>
        <Separator />
      </div>

      <div className="p-5 flex flex-col gap-8">
        <div className="flex items-center gap-5">
          <Skeleton className="h-[180px] w-[200px] rounded-xl bg-muted/20" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-32 bg-muted/20" />
            <Skeleton className="h-6 w-48 bg-muted/20" />
            {userType === UserType.STUDENT && (
              <>
                <Skeleton className="h-6 w-40 bg-muted/20" />
                <Skeleton className="h-6 w-56 bg-muted/20" />
                <Skeleton className="h-6 w-52 bg-muted/20" />
              </>
            )}
          </div>
        </div>

        {userType === UserType.STUDENT && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full bg-muted/20" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-muted/20" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
