"use client";

import { InputFileProps } from "@/types/InputFileProps";
import { Input } from "../ui/input";
import { IconPhotoPlus, IconX, IconLoader2, IconEdit } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { VariantType } from "@/constant/enum/VariantType";
import { Controller, FieldValues } from "react-hook-form";
import Image from "next/image";

export default function InputFile<T extends FieldValues>({
  variant = VariantType.PRIMARY,
  description = "Upload Image",
  control,
  name,
  rules,
  error,
  onUploadStart,
  onUploadComplete,
}: InputFileProps<T>) {
  const ref = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleUpload = () => {
    if (!isUploading) {
      ref.current?.click();
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (
    file: File | undefined,
    onChange: (value: string) => void
  ) => {
    if (!file) return;

    setIsUploading(true);
    setImageLoading(true);
    onUploadStart?.();

    try {
      const base64String = await convertToBase64(file);
      onChange(base64String);
    } catch (error) {
      console.error("Error converting file to base64:", error);
      onChange(""); // Clear value on error
    } finally {
      setIsUploading(false);
      onUploadComplete?.();
    }
  };

  const handleRemove = (
    e: React.MouseEvent,
    onChange: (value: string) => void
  ) => {
    e.stopPropagation();
    onChange("");
    setImageLoading(false);
    if (ref.current) {
      ref.current.value = "";
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <div className="w-full h-full">
          <div
            onClick={handleUpload}
            className={`relative w-full h-full border-1 border-dashed ${
              error ? "border-red-500" : "border-gray-300 hover:border-gray-400"
            } ${
              variant === VariantType.PRIMARY ? "rounded-lg" : "rounded-[50%]"
            } flex items-center justify-center cursor-pointer transition-colors overflow-hidden bg-gray-50 dark:bg-gray-900`}
          >
            {/* Loading State */}
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
                <IconLoader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Processing image...
                </p>
              </div>
            )}

            {/* Preview Image */}
            {value && !isUploading && (
              <>
                <div className="relative w-full h-full">
                  <Image
                    src={value}
                    alt="Preview"
                    fill
                    className={`object-cover ${
                      variant === VariantType.PRIMARY
                        ? "rounded-lg"
                        : "rounded-[50%]"
                    }`}
                    onLoadingComplete={() => setImageLoading(false)}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                  />
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
                      <IconLoader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    </div>
                  )}
                </div>
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, onChange)}
                  className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-[50%] transition-colors z-20"
                  aria-label="Remove image"
                >
                  <IconX className="w-4 h-4" />
                </button>
                {/* Edit Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    ref.current?.click();
                  }}
                  className="absolute top-2 right-9 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-[50%] transition-colors z-20"
                  aria-label="Edit image"
                >
                  <IconEdit className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Upload Placeholder */}
            {!value && !isUploading && (
              <div className="flex flex-col items-center gap-1">
                <IconPhotoPlus className="text-gray-300" />
                <p className="text-sm text-gray-300">{description}</p>
              </div>
            )}

            <Input
              className="hidden"
              type="file"
              ref={ref}
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => handleFileChange(e.target.files?.[0], onChange)}
              disabled={isUploading}
            />
          </div>

          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      )}
    />
  );
}
