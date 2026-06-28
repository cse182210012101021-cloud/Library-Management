export interface NavItemsProps {
  items: Array<{
    title: string;
    url: string;
    icon?: React.ComponentType;
  }>;
  pathName?: string;
  className?: string;
}
