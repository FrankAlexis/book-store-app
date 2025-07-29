"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { formatISBN } from "../../lib/utils";
import { Eye } from "lucide-react";

interface ViewBookDialogProps {
  book: any;
}

export function ViewBookDialog({ book }: ViewBookDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-1" />View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">{book.volumeInfo.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex justify-center">
            <Image
              src={book.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg"}
              alt={book.volumeInfo.title}
              width={200}
              height={300}
              className="rounded-md object-cover shadow-lg"
            />
          </div>
          <div className="grid gap-2 text-center">
            {book.volumeInfo.authors && book.volumeInfo.authors.length > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Authors:</span> {book.volumeInfo.authors.join(", ")}
              </p>
            )}
            {book.volumeInfo.publishedDate && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Published Date:</span> {book.volumeInfo.publishedDate}
              </p>
            )}
            {book.volumeInfo.industryIdentifiers && book.volumeInfo.industryIdentifiers.length > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">ISBN:</span>
                {formatISBN(book.volumeInfo.industryIdentifiers.find((id: any) => id.type === "ISBN_13")?.identifier ||
                           book.volumeInfo.industryIdentifiers.find((id: any) => id.type === "ISBN_10")?.identifier)}
              </p>
            )}
          </div>
          {book.volumeInfo.description && (
            <div className="mt-4 w-full max-h-48 overflow-y-auto text-sm text-muted-foreground p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold mb-2">Description</h3>
              <p>{book.volumeInfo.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
