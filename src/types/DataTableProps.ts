interface HeaderType {
  label: string;
  value: string;
}

export interface DataTableProps<T = Record<string, any>> {
  headers: HeaderType[];
  data: T[];
  renderAction?: (row: T) => React.ReactNode;
  actionLabel?: string;
}
