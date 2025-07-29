"use client";

import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {bookSchema} from "../../lib/validators";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {toast} from "sonner";
import {updateBookAPI, Book} from "@/lib/api";

interface EditBookDialogProps {
  book: Book | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBookUpdated: (book: Book) => void;
}

export function EditBookDialog({
  book,
  isOpen,
  onOpenChange,
  onBookUpdated,
}: EditBookDialogProps) {
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    getValues,
    setValue,
    trigger,
  } = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    if (book) {
      reset(book);
    }
  }, [book, reset]);

  const onSubmit = async (data: z.infer<typeof bookSchema>) => {
    if (!book) return;

    try {
      const updatedBook = await updateBookAPI(book.isbn, {...book, ...data});
      onBookUpdated(updatedBook);
      onOpenChange(false);
      toast.success("Book updated successfully!");
    } catch (error) {
      toast.error("Failed to update book. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <div className="col-span-3">
                <Input id="edit-title" {...register("title")} />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-author" className="text-right">
                Author
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-author"
                  placeholder="Book author"
                  {...register("author")}
                />
                {errors.author && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.author.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-publicationYear" className="text-right">
                Published Year
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-publicationYear"
                  type="number"
                  placeholder="e.g., 2023"
                  {...register("publicationYear", {valueAsNumber: true})}
                />
                {errors.publicationYear && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.publicationYear.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isbn" className="text-right">
                ISBN
              </Label>
              <div className="col-span-3">
                <Input id="edit-isbn" {...register("isbn")} />
                {errors.isbn && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.isbn.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
