"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApplyBookForm from "@/components/form/apply-book-form/ApplyBookForm";

interface EditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
    _id: string;
    bookIds: {
      _id: string;
      title: string;
      quantity: number;
      totalAvailable: number;
    }[];
    quantity: number;
    fromDate: string;
    toDate: string;
  } | null;
}

export default function EditApplicationModal({
  isOpen,
  onClose,
  application,
}: EditApplicationModalProps) {
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-black uppercase tracking-widest">
            Modify Request
          </DialogTitle>
        </DialogHeader>
        <ApplyBookForm
          books={application.bookIds.map((b) => ({
            _id: b._id,
            title: b.title,
          }))}
          defaultValues={{
            dateRange: {
              from: new Date(application.fromDate),
              to: new Date(application.toDate),
            },
          }}
          onSuccess={onClose}
          mode="edit"
          applicationId={application._id}
        />
      </DialogContent>
    </Dialog>
  );
}
