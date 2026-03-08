import DropdownField from "@/components/dropdown-field/DropdownField";
import InputField from "@/components/input-field/InputField";
import InputFile from "@/components/input-file/InputFile";
import { bookGenres } from "@/constant/default-values/BookGenres";
import { Button } from "@/components/ui/button";
import { useEditBook } from "@/hooks/use-edit-book";
import { getBookValidationRules } from "@/validator/client-validate/BookFormValidator";
import { BookFormField } from "@/constant/form-field/BookFormField";
import { BookFormValues } from "@/hooks/use-add-book";

interface EditBookFormProps {
  bookId: string;
  defaultValues: BookFormValues;
  onSuccess?: () => void;
}

export default function EditBookForm({
  bookId,
  defaultValues,
  onSuccess,
}: EditBookFormProps) {
  const {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isValid,
    isUploading,
    handleUploadStart,
    handleUploadComplete,
  } = useEditBook({ bookId, defaultValues, onSuccess });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="h-[200px]">
        <InputFile
          control={control}
          name={BookFormField.COVER_IMAGE}
          rules={getBookValidationRules(BookFormField.COVER_IMAGE)}
          error={errors[BookFormField.COVER_IMAGE]?.message}
          description="Upload Book Cover"
          onUploadStart={handleUploadStart}
          onUploadComplete={handleUploadComplete}
        />
      </div>

      <div className="flex items-center gap-2">
        <InputField
          label="Title"
          placeholder="Book Name"
          required
          {...register(
            BookFormField.TITLE,
            getBookValidationRules(BookFormField.TITLE),
          )}
          error={errors[BookFormField.TITLE]?.message}
        />
        <InputField
          label="Author"
          placeholder="Author Name"
          required
          {...register(
            BookFormField.AUTHOR,
            getBookValidationRules(BookFormField.AUTHOR),
          )}
          error={errors[BookFormField.AUTHOR]?.message}
        />
      </div>

      <div className="flex gap-2">
        <InputField
          label="ISBN"
          placeholder="ISBN No."
          required
          {...register(
            BookFormField.ISBN,
            getBookValidationRules(BookFormField.ISBN),
          )}
          error={errors[BookFormField.ISBN]?.message}
        />
        <DropdownField
          label="Genre"
          placeholder="Select Genre"
          required
          options={bookGenres}
          control={control}
          name={BookFormField.GENRE}
          error={errors[BookFormField.GENRE]?.message}
        />
      </div>

      <div className="flex gap-2">
        <InputField
          label="Publisher"
          placeholder="Publisher name"
          {...register(BookFormField.PUBLISHER)}
          error={errors[BookFormField.PUBLISHER]?.message}
        />
        <InputField
          label="Published Year"
          placeholder="Year"
          type="number"
          {...register(
            BookFormField.PUBLISHED_YEAR,
            getBookValidationRules(BookFormField.PUBLISHED_YEAR),
          )}
          error={errors[BookFormField.PUBLISHED_YEAR]?.message}
        />
        <InputField
          label="Quantity"
          placeholder="Quantity"
          required
          type="number"
          {...register(
            BookFormField.QUANTITY,
            getBookValidationRules(BookFormField.QUANTITY),
          )}
          error={errors[BookFormField.QUANTITY]?.message}
        />
      </div>

      <InputField
        label="Description"
        inputType="textarea"
        placeholder="Description"
        {...register(BookFormField.DESCRIPTION)}
        error={errors[BookFormField.DESCRIPTION]?.message}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isValid || isUploading}
          loading={isSubmitting}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
