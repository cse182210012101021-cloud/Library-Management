import { VariantType } from "@/constant/enum/VariantType";
import { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";

export interface InputFileProps<T extends FieldValues = FieldValues> {
  variant?: VariantType;
  description?: string;
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;
  error?: string;
  onUploadStart?: () => void;
  onUploadComplete?: () => void;
}
