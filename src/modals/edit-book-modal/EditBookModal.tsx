"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import EditBookForm from "@/components/form/edit-book-form/EditBookForm";
import { BookFormValues } from "@/hooks/use-add-book";

interface EditBookModalProps {
  book: {
    _id: string;
    title: string;
    author: string;
    isbnNo: string;
    genre: string;
    publisher?: string;
    publishedYear?: number;
    quantity: number;
    description?: string;
    coverImage?: string;
  };
}

export default function EditBookModal({ book }: EditBookModalProps) {
  const [open, setOpen] = useState(false);

  const defaultValues: BookFormValues = {
    title: book.title,
    author: book.author,
    isbnNo: book.isbnNo,
    genre: book.genre as BookFormValues["genre"],
    publisher: book.publisher ?? "",
    publishedYear: book.publishedYear,
    quantity: book.quantity,
    description: book.description ?? "",
    coverImage: book.coverImage ?? "",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-bold uppercase tracking-widest text-[10px] cursor-pointer"
        >
          <IconEdit size={16} />
          Edit Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-black uppercase tracking-widest">
            Edit Book
          </DialogTitle>
        </DialogHeader>
        <EditBookForm
          bookId={book._id}
          defaultValues={defaultValues}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
