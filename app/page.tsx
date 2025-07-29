"use client";

import {useState, useEffect} from "react";
import {
  addBookAPI,
  deleteBookAPI,
  searchBooksAPI,
  updateBookAPI,
} from "../lib/api";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {AddBookDialog} from "@/components/book-actions/AddBookDialog";
import {EditBookDialog} from "@/components/book-actions/EditBookDialog";
import {ViewBookDialog} from "@/components/book-actions/ViewBookDialog";
import {toast} from "sonner";
import {Skeleton} from "@/components/ui/skeleton";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SearchX} from "lucide-react";
import {Book as BookIcon, Edit, Trash2} from "lucide-react";
import {formatISBN} from "../lib/utils";
import {Book} from "../lib/api";

export default function Page() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const defaultSearch = async () => {
      setIsLoading(true);
      const results = await searchBooksAPI(); // Default search term
      setBooks(results || []);
      setIsLoading(false);
    };
    defaultSearch();
  }, []); // Run only once on component mount

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (bookIsbn: string) => {
    try {
      await deleteBookAPI(bookIsbn);
      setBooks(books.filter((book) => book.isbn !== bookIsbn));
      toast.success("Book deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete book. Please try again.");
    }
  };

  const handleBookAdded = async (newBook: Book) => {
    setBooks((prevBooks) => [newBook, ...prevBooks]);
  };

  const handleBookUpdated = async (updatedBook: Book) => {
    await updateBookAPI(updatedBook.isbn, updatedBook);
    setBooks(
      books.map((book) => (book.isbn === updatedBook.isbn ? updatedBook : book))
    );
    toast.success("Book updated successfully!");
  };

  return (
    <main className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center space-x-2">
              <BookIcon className="w-6 h-6" />
              <span>Book Search</span>
            </span>
            <AddBookDialog onBookAdded={handleBookAdded} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-250px)] rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="w-[120px]">Published Year</TableHead>
                  <TableHead className="w-[120px]">ISBN</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-12 w-12 rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[250px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : books.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <SearchX className="h-8 w-8 text-muted-foreground" />
                        <span>
                          No books found. Try searching for something else or
                          add a new book.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  books.map((book) => (
                    <TableRow key={book.isbn} className="hover:bg-muted/50">
                      <TableCell>
                        <Image
                          src={book.image || "/placeholder.svg"}
                          alt={book.title}
                          width={50}
                          height={75}
                          className="rounded-sm object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {book.title}
                      </TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.publicationYear}</TableCell>
                      <TableCell>{formatISBN(book.isbn)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <ViewBookDialog book={book} />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(book)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the book from the current
                                  view.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(book.isbn)}
                                >
                                  Delete
                                </AlertDialogAction>
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
