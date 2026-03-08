"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApplyBookForm from "@/components/form/apply-book-form/ApplyBookForm";

interface ApplyBookModalProps {
  books: { _id: string; title: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApplyBookModal({
  books,
  open,
  onOpenChange,
}: ApplyBookModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-black uppercase tracking-widest">
            Request Book Archive
          </DialogTitle>
        </DialogHeader>
        <ApplyBookForm books={books} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
