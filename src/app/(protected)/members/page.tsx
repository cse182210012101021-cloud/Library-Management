import { connectDB } from "@/shared/config/db";
import MemberSection from "@/frontend/section/member-section/MemberSection";
import { MemberService } from "@/backend/services/MemberService";
import { notFound } from "next/navigation";

const loadMembers = async () => {
  try {
    await connectDB();
    const members = await MemberService.getAllMembers();
    return {
      data: members,
      error: null,
    };
  } catch (error) {
    console.error("Error loading members:", error);
    return {
      data: null,
      error,
    };
  }
};

export default async function Page() {
  const { data, error } = await loadMembers();

  if (error || !data) {
    return notFound();
  }

  return <MemberSection members={data} />;
}
