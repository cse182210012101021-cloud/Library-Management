import MemberDetailsSection from "@/section/member-details-section/MemberDetailsSection";

export default async function Page({
  params,
}: {
  params: { memberId: string };
}) {
  const { memberId } = await params;
  return <MemberDetailsSection memberId={memberId} />;
}
