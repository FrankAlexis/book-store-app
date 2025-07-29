"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookSchema } from "../../lib/validators";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditBookDialogProps {
  book: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBookUpdated: (book: any) => void;
}

export function EditBookDialog({ book, isOpen, onOpenChange, onBookUpdated }: EditBookDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    trigger,
  } = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    if (book) {
      reset(book.volumeInfo);
    }
  }, [book, reset]);

  const onSubmit = (data: z.infer<typeof bookSchema>) => {
    const updatedBook = {
      ...book,
      volumeInfo: {
        ...book.volumeInfo,
        ...data,
      },
    };
    onBookUpdated(updatedBook);
    onOpenChange(false);
    toast.success("Book updated successfully!");
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
              <Label htmlFor="edit-title" className="text-right">Title</Label>
              <div className="col-span-3">
                <Input id="edit-title" {...register("title")} />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-authors" className="text-right">Authors</Label>
              <div className="col-span-3">
                <Input id="edit-authors" placeholder="Separate authors with commas" {...register("authors")} />
                {errors.authors && <p className="text-red-500 text-sm mt-1">{errors.authors.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-publishedDate" className="text-right">Published Date</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !getValues("publishedDate") && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {getValues("publishedDate") ? format(new Date(getValues("publishedDate")), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={getValues("publishedDate") ? new Date(getValues("publishedDate")) : undefined}
                        onSelect={(date) => {
                          setValue("publishedDate", date ? format(date, "yyyy-MM-dd") : "");
                          trigger("publishedDate"); // Trigger validation
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.publishedDate && <p className="text-red-500 text-sm mt-1">{errors.publishedDate.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isbn" className="text-right">ISBN</Label>
                <div className="col-span-3">
                  <Input id="edit-isbn" {...register("isbn")} />
                  {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn.message}</p>}
                </div>
              </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
