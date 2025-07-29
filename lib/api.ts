
// A generic, reusable fetcher function
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Attempt to parse error details from the response body
      const errorBody = await response.json().catch(() => ({}))
      console.error("API Error Body:", errorBody);
      throw new Error(`API call failed with status: ${response.status}`);
    }

    return await response.json() as T;

  } catch (error) {
    console.error("Fetcher Error:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}

// Define the structure of the Google Books API response
interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    imageLinks?: {
      thumbnail: string;
    };
  };
}

interface GoogleBooksResponse {
  items: Book[];
}

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

/**
 * Action to search for books using the external Google Books API.
 * @param query The search term.
 * @returns A promise that resolves to an array of books.
 */
export async function searchBooksAPI(query: string): Promise<Book[]> {
  if (!query) {
    return [];
  }

  const url = `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}`;
  
  try {
    const data = await fetcher<GoogleBooksResponse>(url);
    return data.items || [];
  } catch (error) {
    // The fetcher already logs the error, but we can add more context here if needed
    console.error(`Failed to search for books with query: "${query}"`);
    return []; // Return an empty array on error to prevent UI crashes
  }
}

/**
 * Simulates updating a book on a custom backend.
 * @param bookId The ID of the book to update.
 * @param bookData The new data for the book.
 * @returns A promise that resolves to the updated book data.
 */
export async function updateBookAPI(bookId: string, bookData: Book): Promise<Book> {
  console.log(`[API Simulation] Updating book ${bookId} with:`, bookData);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real scenario, you would make a PUT/PATCH request:
  // return fetcher<Book>(`/api/books/${bookId}`, { method: 'PUT', body: JSON.stringify(bookData) });
  console.log("[API Simulation] Book updated successfully.");
  return bookData; // Return the updated data on success
}

/**
 * Simulates deleting a book on a custom backend.
 * @param bookId The ID of the book to delete.
 * @returns A promise that resolves to an object indicating success.
 */
export async function deleteBookAPI(bookId: string): Promise<{ success: boolean }> {
  console.log(`[API Simulation] Deleting book ${bookId}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real scenario, you would make a DELETE request:
  // return fetcher(`/api/books/${bookId}`, { method: 'DELETE' });
  console.log("[API Simulation] Book deleted successfully.");
  return { success: true };
}
