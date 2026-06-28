import { connectDB } from "@/shared/config/db";
import ApplicationSection from "@/frontend/section/application-section/ApplicationSection";
import { ApplicationService } from "@/backend/services/ApplicationService";
import { jsonObject } from "@/shared/utils/CommonUtils";
import { getServerAuthUser } from "@/shared/utils/UserUtils";
import { notFound } from "next/navigation";
import { UserType } from "@/shared/constant/enum/UserType";

const loadApplications = async () => {
  try {
    await connectDB();
    const user = await getServerAuthUser();

    if (!user) {
      return { data: null, error: "Unauthorized" };
    }

    let applications;
    if (user.userType === UserType.ADMIN) {
      applications = await ApplicationService.getAllApplications();
    } else {
      applications = await ApplicationService.getApplicationsByUser(
        user.userId,
      );
    }

    return {
      data: jsonObject(applications),
      error: null,
    };
  } catch (error: Error | unknown) {
    return {
      data: null,
      error,
    };
  }
};

export default async function Page() {
  const { data, error } = await loadApplications();

  if (error || !data) {
    return notFound();
  }

  return <ApplicationSection applications={data} />;
}
