import {
  IconLayoutDashboardFilled,
  IconBookFilled,
  IconUsersGroup,
  IconCoinTakaFilled,
  IconSettings,
  IconHelpCircleFilled,
  IconFilesFilled,
} from "@tabler/icons-react";
import { UserType } from "../enum/UserType";

export const getNavItems = (userType: string | undefined) => {
  const primaryItems =
    userType === UserType.ADMIN
      ? [...basePrimaryItems, ...adminPrimaryItems]
      : [...basePrimaryItems];

  return { primaryItems, secondaryItems };
};

const basePrimaryItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconLayoutDashboardFilled,
  },
  {
    title: "Books",
    url: "/books",
    icon: IconBookFilled,
  },
  {
    title: "Applications",
    url: "/applications",
    icon: IconFilesFilled,
  },
];

const adminPrimaryItems = [
  {
    title: "Members",
    url: "/members",
    icon: IconUsersGroup,
  },
  {
    title: "Fine Rules",
    url: "/fine-rules",
    icon: IconCoinTakaFilled,
  },
];

const secondaryItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
  },
  {
    title: "Help & Support",
    url: "/help-and-support",
    icon: IconHelpCircleFilled,
  },
];
