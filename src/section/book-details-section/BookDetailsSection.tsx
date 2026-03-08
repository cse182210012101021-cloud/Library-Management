"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconBook,
  IconBarcode,
  IconBuildingCommunity,
  IconCalendar,
  IconPackage,
  IconArrowLeft,
  IconClipboardCheck,
} from "@tabler/icons-react";
import Image from "next/image";
import { ReactNode, useState } from "react";
import Link from "next/link";
import DeleteBookModal from "@/modals/delete-book-modal/DeleteBookModal";
import EditBookModal from "@/modals/edit-book-modal/EditBookModal";
import ApplyBookModal from "@/modals/apply-book-modal/ApplyBookModal";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/providers/AuthProvider";
import { UserType } from "@/constant/enum/UserType";
import { getGenreLabel } from "@/utils/BookUtils";

interface Book {
  _id: string;
  coverImage?: string;
  title: string;
  author: string;
  isbnNo: string;
  genre: string;
  publisher?: string;
  publishedYear?: number;
  quantity: number;
  totalAvailable: number;
  description?: string;
}

interface BookDetailsSectionProps {
  book: Book;
}

export default function BookDetailsSection({ book }: BookDetailsSectionProps) {
  const { user } = useAuthUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isStudent = user?.userType === UserType.STUDENT;

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden p-6 md:p-10">
      {book.coverImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={book.coverImage}
            alt="background blur"
            fill
            className="object-cover opacity-10 blur-[120px] scale-150"
          />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-10">
        <div className="w-full flex items-center justify-between">
          <Link
            href="/books"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="p-2 rounded-full border border-border group-hover:bg-accent transition-all">
              <IconArrowLeft size={20} />
            </div>
            Back to Library
          </Link>

          <div className="flex items-center gap-2">
            {!isStudent && (
              <>
                {book.quantity > 0 && <EditBookModal book={book} />}
                <DeleteBookModal bookId={book._id} bookTitle={book.title} />
              </>
            )}
            {isStudent && (
              <Button
                variant="outline"
                size="sm"
                className="font-bold uppercase tracking-widest text-[10px] cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <IconClipboardCheck size={16} />
                Apply for the Book
              </Button>
            )}
          </div>
        </div>

        <ApplyBookModal
          books={[{ _id: book._id, title: book.title }]}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />

        <div className="w-full flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-[250px] flex-shrink-0">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.01] duration-500">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 text-muted-foreground gap-4">
                  <IconBook size={80} stroke={0.5} />
                  <p className="text-xs font-bold uppercase tracking-widest">
                    No Visual Archive
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge
                  variant="default"
                  className="font-bold uppercase tracking-[0.1em] text-[10px] h-6 rounded-full px-4 shadow-sm flex items-center justify-center"
                >
                  <span className="leading-none">
                    {getGenreLabel(book.genre)}
                  </span>
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest">
                  Archive ID: {book._id.slice(-6)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                {book.title}
              </h1>
              <p className="text-lg font-semibold text-muted-foreground uppercase tracking-wide">
                Author: <span className="text-foreground">{book.author}</span>
              </p>
            </div>

            <Separator className="bg-border/50" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <DetailBox
                icon={<IconBarcode />}
                label="ISBN"
                value={book.isbnNo}
              />
              <DetailBox
                icon={<IconPackage />}
                label="Stock"
                value={`${book.totalAvailable ?? book.quantity} / ${book.quantity} AVAILABLE`}
              />
              <DetailBox
                icon={<IconBuildingCommunity />}
                label="Publisher"
                value={book.publisher || "Global"}
              />
              <DetailBox
                icon={<IconCalendar />}
                label="Year"
                value={book.publishedYear?.toString() || "2024"}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/40">
                The Premise
              </h3>
              <p className="text-xl leading-relaxed text-muted-foreground font-serif">
                {book.description ||
                  "The digital archive currently lacks a detailed narrative for this entry. Exploratory reading is highly encouraged."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBox({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2 group">
      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-[var(--primary)] transition-colors">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-sm font-bold truncate">{value}</p>
    </div>
  );
}
