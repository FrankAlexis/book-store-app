import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  authors: z.preprocess(
    (arg) => {
      if (typeof arg === 'string') {
        return arg.split(',').map(item => item.trim()).filter(item => item.length > 0);
      }
      // If arg is already an array, ensure its elements are strings and filter out empty ones.
      if (Array.isArray(arg)) {
        return arg.map(item => String(item).trim()).filter(item => item.length > 0);
      }
      // Fallback for other types, or if it's undefined/null
      return [];
    },
    z.array(z.string()).min(1, { message: 'At least one author is required.' })
  ),
  publishedDate: z.string().optional(),
  isbn: z.string().optional(),
});
