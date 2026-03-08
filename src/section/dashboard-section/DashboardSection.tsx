import SummaryCard from "@/components/summary-card/SummaryCard";
import ChartArea from "@/components/chart-area/ChartArea";
import DataTable from "@/components/DataTable/DataTable";
import {
  BookTableHeaders,
  demoBooksData,
  demoUserData,
  UserTableHeaders,
} from "@/constant/default-values/DashboardTables";
import { Button } from "@/components/ui/button";

export default function DashboardSection() {
  return (
    <section className="h-full p-5 flex flex-col gap-5">
      <CardSection />
      <ChartArea />
      <TableSection />
    </section>
  );
}

const CardSection = () => (
  <div className="flex justify-center gap-5 overflow-x-auto pb-2">
    <SummaryCard
      label="Total Revenue"
      value="$1,250.00"
      change="+12.5%"
      trend="up"
      description="Trending up this month"
      footer="Visitors for the last 6 months"
    />
    <SummaryCard
      label="New Customers"
      value="1,234"
      change="-20%"
      trend="down"
      description="Down 20% this period"
      footer="Acquisition needs attention"
    />
    <SummaryCard
      label="Active Accounts"
      value="45,678"
      change="+12.5%"
      trend="up"
      description="Strong user retention"
      footer="Engagement exceed targets"
    />
    <SummaryCard
      label="Growth Rate"
      value="4.5%"
      change="+4.5%"
      trend="up"
      description="Steady performance Increase"
      footer="Meets growth projections"
    />
  </div>
);

const TableSection = () => (
  <div className="flex items-start gap-5">
    <DataTable
      headers={BookTableHeaders}
      data={demoBooksData}
      actionLabel="Details"
      renderAction={(data) => <Button>View Details</Button>}
    />
    <DataTable
      headers={UserTableHeaders}
      data={demoUserData}
      actionLabel="Details"
      renderAction={(data) => <Button>View Details</Button>}
    />
  </div>
);
