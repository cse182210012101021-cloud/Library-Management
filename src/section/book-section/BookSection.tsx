"use client";

import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import Dropdown from "@/components/dropdown/Dropdown";
import { bookGenres } from "@/constant/default-values/BookGenres";
import CardItem from "@/components/card-Item/CardItem";
import AddBookSection from "../add-book-section/AddBookSection";
import { useForm, Control, FieldValues } from "react-hook-form";
import { useAuthUser } from "@/providers/AuthProvider";
import Link from "next/link";
import { UserType } from "@/constant/enum/UserType";
import { useMemo, useState, useEffect } from "react";
import { getGenreLabel } from "@/utils/BookUtils";
import { Button } from "@/components/ui/button";
import { IconClipboardCheck } from "@tabler/icons-react";
import ApplyBookModal from "@/modals/apply-book-modal/ApplyBookModal";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { DEFAULT_PAGE_LIMIT } from "@/constant/ApplicationConstant";

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

interface BookSectionProps {
  books: Book[];
  initialPage: number;
  initialSearch: string;
  initialGenre: string;
}

export default function BookSection({
  books,
  initialPage,
  initialSearch,
  initialGenre,
}: BookSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const { control, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      genre: initialGenre,
    },
  });
  const { user } = useAuthUser();
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedGenre = watch("genre");

  // Client-side filtering
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = book.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGenre =
        !selectedGenre ||
        selectedGenre === "all" ||
        book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre]);

  // Client-side pagination logic
  const totalCount = filteredBooks.length;
  const totalPages = Math.ceil(totalCount / DEFAULT_PAGE_LIMIT);
  const currentPage = Math.min(initialPage, totalPages || 1);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * DEFAULT_PAGE_LIMIT;
    return filteredBooks.slice(start, start + DEFAULT_PAGE_LIMIT);
  }, [filteredBooks, currentPage]);

  // Sync state to URL for shareability (optional but recommended)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) params.set("search", searchQuery);
    else params.delete("search");

    if (selectedGenre && selectedGenre !== "all")
      params.set("genre", selectedGenre);
    else params.delete("genre");

    // Reset to page 1 if search/genre changes, otherwise keep current
    if (searchQuery !== initialSearch || selectedGenre !== initialGenre) {
      params.set("page", "1");
    } else {
      params.set("page", currentPage.toString());
    }

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (newQuery !== currentQuery) {
      router.replace(`${pathname}?${newQuery}`, { scroll: false });
    }
  }, [
    searchQuery,
    selectedGenre,
    currentPage,
    pathname,
    router,
    searchParams,
    initialSearch,
    initialGenre,
  ]);

  const toggleBookSelection = (book: Book) => {
    setSelectedBooks((prev) => {
      const isSelected = prev.find((b) => b._id === book._id);
      if (isSelected) {
        return prev.filter((b) => b._id !== book._id);
      } else {
        return [...prev, book];
      }
    });
  };

  const genreOptions = useMemo(() => {
    return [{ label: "All Genres", value: "all" }, ...bookGenres];
  }, []);

  return (
    <section className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="sticky top-0 bg-[var(--background)] z-10">
        <div className="flex justify-between items-center p-3">
          <h3 className="font-semibold text-2xl">Book List</h3>
          <div className="flex justify-end items-center gap-2 w-1/2 ">
            <InputGroup className="w-1/2 ">
              <InputGroupInput
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon>
                <IconSearch />
              </InputGroupAddon>
            </InputGroup>

            <div className="w-1/4 flex gap-2">
              <Dropdown
                name="genre"
                control={control as unknown as Control<FieldValues>}
                placeholder="Select Genre"
                options={genreOptions}
              />
            </div>
            {selectedBooks.length > 0 &&
              user?.userType === UserType.STUDENT && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="font-bold uppercase tracking-widest text-[10px] animate-in slide-in-from-right-5 duration-300"
                >
                  <IconClipboardCheck size={16} />
                  Apply ({selectedBooks.length})
                </Button>
              )}
            {user?.userType === UserType.ADMIN && <AddBookSection />}
          </div>
        </div>
        <Separator />
      </div>

      <ApplyBookModal
        books={selectedBooks.map((b) => ({ _id: b._id, title: b.title }))}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <div className="flex-1 p-[20px] grid grid-cols-4 gap-5 content-start">
        {paginatedBooks.map((book) => {
          const isSelected = selectedBooks.some((b) => b._id === book._id);
          return (
            <div key={book._id} className="relative group">
              <CardItem
                coverImage={book.coverImage}
                title={book.title}
                author={book.author}
                genre={getGenreLabel(book.genre)}
                total={book.quantity}
                available={book.totalAvailable ?? book.quantity}
                description={book.description}
                isSelected={isSelected}
                onSelect={
                  user?.userType === UserType.STUDENT
                    ? () => toggleBookSelection(book)
                    : undefined
                }
              />
              <Link
                href={`/books/${book._id}`}
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background p-2 rounded-full border border-border text-[10px] font-bold uppercase tracking-widest z-20"
              >
                Details
              </Link>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center p-5 bg-[var(--background)] sticky bottom-0 border-t border-border z-10">
        <p className="text-sm text-muted-foreground font-medium w-1/4">
          Showing {paginatedBooks.length} of {totalCount} books
        </p>

        <Pagination className="w-1/2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${Math.max(1, currentPage - 1)}${searchQuery ? `&search=${searchQuery}` : ""}${selectedGenre !== "all" ? `&genre=${selectedGenre}` : ""}`}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={`?page=${page}${searchQuery ? `&search=${searchQuery}` : ""}${selectedGenre !== "all" ? `&genre=${selectedGenre}` : ""}`}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                href={`?page=${Math.min(totalPages, currentPage + 1)}${searchQuery ? `&search=${searchQuery}` : ""}${selectedGenre !== "all" ? `&genre=${selectedGenre}` : ""}`}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="w-1/4" />
      </div>
    </section>
  );
}
