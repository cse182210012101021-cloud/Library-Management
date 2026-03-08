export const AppRouterUtils = {
  ROOT: "/",
  DASHBOARD: "/dashboard",
  BOOKS: "/books",
  FINES: "/fines",
  MEMBERS: "/members",
  MEMBER_DETAILS: (memberId: string) => `/members/${memberId}`,
  SETTINGS: "/settings",
  HELP_AND_SUPPORT: "/help-and-support",
  PROFILE: "/profile",
};
