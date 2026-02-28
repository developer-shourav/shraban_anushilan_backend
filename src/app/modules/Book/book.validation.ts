import { z } from 'zod';

const createBookValidationSchema = z.object({
  body: z.object({
    bookName: z.string({
      required_error: 'Book name is required',
    }),
    bookCover: z.string().optional(),
    bookSlug: z.string({
      required_error: 'Book slug is required',
    }),
    isOurBook: z.boolean().optional().default(false),
    bookFile: z.string().optional(),
    bookLink: z.string().optional(),
    writer: z.string().optional(),
    extraInfo: z.string().optional(),
    isActive: z.boolean().optional().default(true),
    bookLanguage: z.string().optional(),
    firstPublishedAt: z.string().optional(),
    lastPublishedAt: z.string().optional(),
  }),
});

const updateBookValidationSchema = z.object({
  body: z.object({
    bookName: z.string().optional(),
    bookCover: z.string().optional(),
    bookSlug: z.string().optional(),
    isOurBook: z.boolean().optional(),
    bookFile: z.string().optional(),
    bookLink: z.string().optional(),
    writer: z.string().optional(),
    extraInfo: z.string().optional(),
    isActive: z.boolean().optional(),
    bookLanguage: z.string().optional(),
    firstPublishedAt: z.string().optional(),
    lastPublishedAt: z.string().optional(),
  }),
});

export const BookValidations = {
  createBookValidationSchema,
  updateBookValidationSchema,
};
