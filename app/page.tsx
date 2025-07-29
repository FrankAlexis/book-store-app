"use client";

import { useState, useEffect } from "react";
import { searchBooksAPI } from "../lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AddBookDialog } from "@/components/book-actions/AddBookDialog";
import { EditBookDialog } from "@/components/book-actions/EditBookDialog";
import { ViewBookDialog } from "@/components/book-actions/ViewBookDialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchX } from "lucide-react";
import { Book as BookIcon, Edit, Trash2 } from "lucide-react";
import { formatISBN } from "../lib/utils";

interface Book {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      publishedDate?: string;
      imageLinks?: {
        thumbnail: string;
      };
      industryIdentifiers?: Array<{ type: string; identifier: string }>;
    };
  }

export default function Page() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const defaultSearch = async () => {
      setIsLoading(true);
      const results = await searchBooksAPI("React"); // Default search term
      setBooks(results || []);
      setIsLoading(false);
    };
    defaultSearch();
  }, []); // Run only once on component mount

  const handleSearch = async () => {
    setIsLoading(true);
    const results = await searchBooksAPI(query);
    setBooks(results || []);
    setIsLoading(false);
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (bookId: string) => {
    setBooks(books.filter((book) => book.id !== bookId));
    toast.success("Book deleted successfully!");
  };

  const handleBookAdded = (newBook: Book) => {
    setBooks([newBook, ...books]);
    toast.success("Book added successfully!");
  };

  const handleBookUpdated = (updatedBook: Book) => {
    setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)));
    toast.success("Book updated successfully!");
  };

  return (
    <main className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center space-x-2"><BookIcon className="w-6 h-6" /><span>Book Search</span></span>
            <AddBookDialog onBookAdded={handleBookAdded} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-2xl items-center space-x-2 mx-auto">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search for books..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isLoading}
                className="pr-8"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-2 py-1"
                  onClick={() => setQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-250px)] rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Authors</TableHead>
                  <TableHead className="w-[120px]">Published Date</TableHead>
                  <TableHead className="w-[120px]">ISBN</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-12 w-12 rounded-sm" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    </TableRow>
                  ))
                ) : books.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <SearchX className="h-8 w-8 text-muted-foreground" />
                        <span>No books found. Try searching for something else or add a new book.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  books.map((book) => (
                    <TableRow key={book.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Image
                          src={book.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg"}
                          alt={book.volumeInfo.title}
                          width={50}
                          height={75}
                          className="rounded-sm object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{book.volumeInfo.title}</TableCell>
                      <TableCell>{book.volumeInfo.authors?.join(", ")}</TableCell>
                      <TableCell>{book.volumeInfo.publishedDate}</TableCell>
                    <TableCell>
                      {formatISBN(book.volumeInfo.industryIdentifiers?.find((id: any) => id.type === "ISBN_13")?.identifier ||
                                  book.volumeInfo.industryIdentifiers?.find((id: any) => id.type === "ISBN_10")?.identifier)}
                    </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <ViewBookDialog book={book} />
                          <Button variant="outline" size="sm" onClick={() => handleEdit(book)}>
                        <Edit className="w-4 h-4 mr-1" />Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the book from the current view.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(book.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedBook && (
        <EditBookDialog
          book={selectedBook}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onBookUpdated={handleBookUpdated}
        />
      )}
    </main>
  );
}
