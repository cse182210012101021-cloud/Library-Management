import { ApplyBookFormValues, useApplyBook } from "@/hooks/use-apply-book";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Controller } from "react-hook-form";

interface ApplyBookFormProps {
  books: { _id: string; title: string }[];
  onSuccess?: () => void;
  defaultValues?: Partial<ApplyBookFormValues>;
  mode?: "apply" | "edit";
  applicationId?: string;
}

export default function ApplyBookForm({
  books,
  onSuccess,
  defaultValues,
  mode = "apply",
  applicationId,
}: ApplyBookFormProps) {
  const bookIds = books.map((b) => b._id);
  const { handleSubmit, errors, isSubmitting, isValid, control } = useApplyBook(
    bookIds,
    onSuccess,
    defaultValues,
    mode,
    applicationId,
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Applying for:
        </h3>
        <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
          {books.map((book) => (
            <div
              key={book._id}
              className="p-2 rounded-md bg-muted/50 border border-border"
            >
              <p className="text-sm font-bold tracking-tight">{book.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Select Date Archive Window
        </label>
        <Controller
          control={control}
          name="dateRange"
          render={({ field }) => (
            <DateRangePicker
              date={field.value}
              setDate={field.onChange}
              className="w-full"
            />
          )}
        />
        {errors.dateRange && (
          <p className="text-sm text-red-500 font-medium">
            {errors.dateRange.message as string}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          variant="outline"
          className="w-full md:w-auto font-bold uppercase tracking-widest text-[11px]"
        >
          Dispatch Request
        </Button>
      </div>
    </form>
  );
}
