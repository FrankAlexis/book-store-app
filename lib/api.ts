// A generic, reusable fetcher function
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Attempt to parse error details from the response body
      const errorBody = await response.json().catch(() => ({}));
      console.error("API Error Body:", errorBody);
      throw new Error(`API call failed with status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Fetcher Error:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}

// Define the structure for a book
export interface Book {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  image?: string;
  isbn: string;
}

const API_URL = "http://localhost:8080/books";

/**
 * Action to search for books using the external Google Books API.
 * @param query The search term.
 * @returns A promise that resolves to an array of books.
 */
export async function searchBooksAPI(): Promise<Book[]> {
  try {
    const data = await fetcher<Book[]>(API_URL);
    return data || [];
  } catch (error) {
    // The fetcher already logs the error, but we can add more context here if needed
    console.error(`Failed to search for books`);
    return []; // Return an empty array on error to prevent UI crashes
  }
}

/**
 * Adds a new book to the custom backend.
 * @param bookData The data for the new book.
 * @returns A promise that resolves to the newly created book data.
 */
export async function addBookAPI(bookData: Omit<Book, "id">): Promise<Book> {
  try {
    const newBook = await fetcher<Book>(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });
    console.log("[API] Book added successfully.", newBook);
    return newBook;
  } catch (error) {
    console.error("Failed to add book:", error);
    throw error; // Re-throw to be handled by the calling component
  }
}

/**
 * Updates an existing book on the custom backend.
 * @param bookId The ID of the book to update.
 * @param bookData The new data for the book.
 * @returns A promise that resolves to the updated book data.
 */
export async function updateBookAPI(
  bookId: string,
  bookData: Book
): Promise<Book> {
  try {
    const updatedBook = await fetcher<Book>(`${API_URL}/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });
    console.log(`[API] Book ${bookId} updated successfully.`, updatedBook);
    return updatedBook;
  } catch (error) {
    console.error(`Failed to update book ${bookId}:`, error);
    throw error;
  }
}

/**
 * Deletes a book from the custom backend.
 * @param bookId The ID of the book to delete.
 * @returns A promise that resolves to an object indicating success.
 */
export async function deleteBookAPI(
  bookId: string
): Promise<{success: boolean}> {
  try {
    await fetcher(`${API_URL}/${bookId}`, {
      method: "DELETE",
    });
    console.log(`[API] Book ${bookId} deleted successfully.`);
    return {success: true};
  } catch (error) {
    console.error(`Failed to delete book ${bookId}:`, error);
    return {success: false};
  }
}
