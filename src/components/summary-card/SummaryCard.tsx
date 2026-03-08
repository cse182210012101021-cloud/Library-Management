import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SummaryCardProps } from "@/types/SummaryCardProps";

export default function SummaryCard({
  label,
  value,
  change,
  trend,
  description,
  footer,
}: SummaryCardProps) {
  const isUp = trend === "up";

  return (
    <Card className="bg-card border-border text-card-foreground flex-1 min-w-[240px]">
      <CardContent className="p-4 flex flex-col gap-2">
        {/* Header Row */}
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            {label}
          </p>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
              "bg-muted/50 border-border",
            )}
          >
            {isUp ? (
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
            ) : (
              <TrendingDown className="w-3 h-3 text-muted-foreground" />
            )}
            <span className="text-foreground">{change}</span>
          </div>
        </div>

        {/* Value */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
        </div>

        {/* Footer info */}
        <div className="flex flex-col gap-0.5 mt-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-foreground">{description}</p>
            {isUp ? (
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
            ) : (
              <TrendingDown className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
          <p className="text-[10px] text-muted-foreground">{footer}</p>
        </div>
      </CardContent>
    </Card>
  );
}
