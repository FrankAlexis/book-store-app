"use client";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import {formatISBN} from "../../lib/utils";
import {Eye} from "lucide-react";

import {Book} from "@/lib/api";

interface ViewBookDialogProps {
  book: Book;
}

export function ViewBookDialog({book}: ViewBookDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">{book.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex justify-center">
            <Image
              src={book.image || "/placeholder.svg"}
              alt={book.title}
              width={200}
              height={300}
              className="rounded-md object-cover shadow-lg"
            />
          </div>
          <div className="grid gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Author:</span> {book.author}
            </p>
            {book.publicationYear && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Published Date:</span>{" "}
                {book.publicationYear}
              </p>
            )}
            {book.isbn && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">ISBN:</span>
                {formatISBN(book.isbn)}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
