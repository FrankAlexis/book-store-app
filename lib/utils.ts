import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatISBN(isbn: string | undefined): string {
  if (!isbn) return "N/A";

  // Remove any existing hyphens or spaces
  const cleanIsbn = isbn.replace(/[-\s]/g, '');

  // Basic formatting for ISBN-13 (most common)
  if (cleanIsbn.length === 13) {
    // Common ISBN-13 patterns: 978-X-XXX-XXXXX-X or 979-X-XXX-XXXXX-X
    // This is a simplified approach and might not cover all valid ISBN-13 formats
    return `${cleanIsbn.substring(0, 3)}-${cleanIsbn.substring(3, 4)}-${cleanIsbn.substring(4, 7)}-${cleanIsbn.substring(7, 12)}-${cleanIsbn.substring(12)}`;
  }

  // For ISBN-10 or other lengths, return as is or implement more complex logic
  return isbn; // Or return cleanIsbn if you prefer no formatting for non-13 digit ones
}
