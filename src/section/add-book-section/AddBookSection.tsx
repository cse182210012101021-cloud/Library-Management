import NewBookForm from "@/components/form/new-book-form/NewBookForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconCirclePlus } from "@tabler/icons-react";
import { useModal } from "@/hooks/use-modal";

export default function AddBookSection() {
  const { isModalOpen, onOpenChange, closeModal } = useModal();

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className="bg-white px-2 py-1 text-black flex items-center gap-1 rounded-md cursor-pointer text-sm">
        <IconCirclePlus /> New Book
      </DialogTrigger>
      <DialogContent className="w-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Fill out the details below to add new book to the library.
          </DialogDescription>
        </DialogHeader>
        <NewBookForm onSuccess={closeModal} />
      </DialogContent>
    </Dialog>
  );
}
