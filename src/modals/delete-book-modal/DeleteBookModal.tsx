"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { ApiClient } from "@/wrapper/ApiClient";
import { deleteBookApi } from "@/constant/ApiRoutes";
import { isErrorResponse } from "@/utils/CommonUtils";
import { useToast } from "@/providers/AlertProvider";
import { useRouter } from "next/navigation";

interface DeleteBookModalProps {
  bookId: string;
  bookTitle: string;
}

export default function DeleteBookModal({
  bookId,
  bookTitle,
}: DeleteBookModalProps) {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const response = await ApiClient(deleteBookApi, bookId);

    if (isErrorResponse(response)) {
      showErrorToast("Error", response?.error || "Failed to delete book");
      setIsDeleting(false);
      return;
    }

    showSuccessToast("Success", "Book deleted successfully");
    router.push("/books");
    router.refresh();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="font-bold uppercase tracking-widest text-[10px] cursor-pointer"
          disabled={isDeleting}
          loading={isDeleting}
        >
          <IconTrash size={16} />
          Delete Book
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the book{" "}
            <span className="font-bold text-foreground">
              &quot;{bookTitle}&quot;
            </span>{" "}
            and remove it from our archives.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
