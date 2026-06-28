import { Control, FieldValues } from "react-hook-form";

interface OptionType {
  label: string;
  value: string;
}

export interface DropdownProps {
  placeholder: string;
  options: OptionType[];
  defaultValue?: string;
  disabled?: boolean;
}

export interface DropdownFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  description?: string;
  error?: string;
  options: OptionType[];
  placeholder: string;
  control: Control<FieldValues>;
  name: string;
}
