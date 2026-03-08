"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconBook,
  IconCalendar,
  IconUser,
  IconCoin,
  IconClockRestore,
} from "@tabler/icons-react";
import { format } from "date-fns";

interface ViewApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
}

export default function ViewApplicationDetailsModal({
  isOpen,
  onClose,
  application,
}: ViewApplicationDetailsModalProps) {
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-widest">
            Application Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconUser size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Applicant
                </span>
              </div>
              <p className="font-bold">{application.applicant}</p>
              <p className="text-xs text-muted-foreground">
                Reg No: {application.registrationNo}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconCalendar size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Dates
                </span>
              </div>
              <p className="text-sm">
                <span className="font-semibold">Start:</span>{" "}
                {application.startDate}
              </p>
              <p className="text-sm">
                <span className="font-semibold">End:</span>{" "}
                {application.endDate}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconBook size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Requested Books ({application.bookIds?.length || 0})
              </span>
            </div>
            <div className="grid gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {application.bookIds?.map((book: any) => (
                <div
                  key={book._id}
                  className="p-3 rounded-lg border border-border bg-muted/30 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-sm">{book.title}</p>
                    <p className="text-xs text-muted-foreground">
                      By {book.author}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {book.genre}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-start pt-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Status
              </span>
              <div className="pt-1">{application.status}</div>
            </div>

            {application.fineAmount > 0 && (
              <div className="space-y-1 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
                  Late Fine
                </span>
                <p className="text-sm font-black text-red-500 flex items-center justify-center gap-1">
                  <IconCoin size={14} />
                  {application.fineAmount} Taka
                </p>
              </div>
            )}

            {application.returnDate && (
              <div className="space-y-1 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Returned On
                </span>
                <p className="text-xs font-semibold">
                  {format(new Date(application.returnDate), "PPP")}
                </p>
              </div>
            )}

            <div className="text-right space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Applied On
              </span>
              <p className="text-xs font-semibold pt-1">
                {application.applicationDate}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
