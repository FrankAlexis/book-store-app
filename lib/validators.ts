import {z} from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, {message: "Title is required."}),
  author: z.string().min(1, {message: "Author is required."}),
  publicationYear: z
    .number()
    .min(1000, {message: "Published date must be a 4-digit year."})
    .max(new Date().getFullYear(), {
      message: "Published date cannot be in the future.",
    }),
  isbn: z
    .string()
    .min(10, {message: "ISBN must be at least 10 characters long."}),
});
