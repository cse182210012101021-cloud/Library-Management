export interface SummaryCardProps {
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  description: string;
  footer: string;
}
