"use client";

import {useState} from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {toast} from "sonner";
import {Plus} from "lucide-react";
import {addBookAPI, Book} from "@/lib/api";

interface AddBookDialogProps {
  onBookAdded: (book: Book) => void;
}

export function AddBookDialog({onBookAdded}: AddBookDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    defaultValues: {
      title: "",
      author: "",
      publicationYear: new Date().getFullYear(),
      isbn: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof bookSchema>) => {
    try {
      const newBook = await addBookAPI(data);
      onBookAdded(newBook);
      setIsOpen(false);
      reset();
      toast.success("Book added successfully!");
    } catch (error) {
      toast.error("Failed to add book. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Book
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-title" className="text-right">
                Title
              </Label>
              <div className="col-span-3">
                <Input id="new-title" {...register("title")} />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-author" className="text-right">
                Author
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-author"
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
              <Label htmlFor="new-publicationYear" className="text-right">
                Published Year
              </Label>
              <div className="col-span-3">
                <Input
                  id="new-publicationYear"
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
              <Label htmlFor="new-isbn" className="text-right">
                ISBN
              </Label>
              <div className="col-span-3">
                <Input id="new-isbn" {...register("isbn")} />
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
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Book</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
