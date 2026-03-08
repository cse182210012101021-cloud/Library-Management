import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableProps } from "@/types/DataTableProps";
import { cn } from "@/lib/utils";

export default function DataTable({
  headers,
  data,
  renderAction,
  actionLabel,
}: DataTableProps) {
  return (
    <Table className="rounded-lg overflow-hidden border">
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => {
            const alignment =
              index === 0
                ? "text-left"
                : index === headers.length - 1 && !actionLabel
                  ? "text-right"
                  : "text-center";
            return (
              <TableHead
                key={`${header?.value}-${index}`}
                className={cn(
                  alignment,
                  index === 0 && "pl-6",
                  index === headers.length - 1 && !actionLabel && "pr-6",
                )}
              >
                {header.label}
              </TableHead>
            );
          })}
          {actionLabel && (
            <TableHead className="text-right pr-6">{actionLabel}</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow
            key={rowIndex}
            className="bg-gray-900/50 hover:bg-gray-800/50"
          >
            {headers.map((header, colIndex) => {
              const alignment =
                colIndex === 0
                  ? "text-left"
                  : colIndex === headers.length - 1 && !actionLabel
                    ? "text-right"
                    : "text-center";

              return (
                <TableCell
                  key={`${header.value}-${colIndex}`}
                  className={cn(
                    colIndex === 0 && "font-medium pl-6",
                    alignment,
                    colIndex === headers.length - 1 && !actionLabel && "pr-6",
                  )}
                >
                  {row[header.value]}
                </TableCell>
              );
            })}
            {renderAction && (
              <TableCell className="text-right pr-6">
                {renderAction(row)}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
