/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TBook } from './book.interface';
import { Book } from './book.model';
import { uniqueImageNameGenerator } from '../../utils/uniqueImageNameGenerator';
import { hostImageToCloudinary } from '../../utils/hostImageToCloudinary';
import { hostPdfToR2 } from '../../utils/hostPdfToR2';

/* --------Logic For Create a Book------ */
const createBookIntoDB = async (payload: TBook, files?: any) => {
  const bookData = { ...payload };

  const bookCoverFile = files?.['bookCover']?.[0];
  const bookPdfFile = files?.['bookFile']?.[0];

  // Enforce requirement: bookLink in body OR bookPdfFile exists
  if (!bookData.bookLink && !bookPdfFile && !bookData.bookFile) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Either bookFile or bookLink is required to create a book',
    );
  }

  if (files) {
    if (bookCoverFile) {
      const { imageName } = uniqueImageNameGenerator({
        firstName: bookData.bookName,
        lastName: 'Cover',
      } as any);
      const { secure_url } = await hostImageToCloudinary(
        imageName,
        bookCoverFile.path,
      );
      bookData.bookCover = secure_url as string;
    }

    if (bookPdfFile) {
      const fileName = `books/${Date.now()}-${bookPdfFile.originalname}`;
      const pdfUrl = await hostPdfToR2(fileName, bookPdfFile.path);
      bookData.bookFile = pdfUrl;
      bookData.isOurBook = true;
    }
  }

  const result = await Book.create(bookData);
  return result;
};

/* --------Logic For Get All Books From Database------ */
const getAllBooksFromDB = async (query: Record<string, unknown>) => {
  const bookSearchableFields = ['bookName', 'writer', 'bookSlug', 'extraInfo'];
  const bookQuery = new QueryBuilder(Book.find(), query)
    .search(bookSearchableFields)
    .filter()
    .sort()
    .pagination();

  // If no fields are specified in query, default to the requested ones
  if (!query.fields) {
    bookQuery.queryModel = bookQuery.queryModel.select(
      'bookCover bookSlug isOurBook bookLink writer bookName',
    );
  } else {
    bookQuery.fieldFiltering();
  }

  const result = await bookQuery.queryModel;
  const meta = await bookQuery.countTotal();

  return {
    meta,
    result,
  };
};

/* --------Logic For Get A Single Book From Database------ */
const getSingleBookFromDB = async (slug: string) => {
  const result = await Book.findOne({ bookSlug: slug });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }
  return result;
};

/* --------Logic For Update A Book Into Database------ */
const updateBookIntoDB = async (
  id: string,
  payload: Partial<TBook>,
  files?: any,
) => {
  const bookData = { ...payload };

  if (files) {
    const bookCoverFile = files['bookCover']?.[0];
    const bookPdfFile = files['bookFile']?.[0];

    if (bookCoverFile) {
      const { imageName } = uniqueImageNameGenerator({
        firstName: bookData.bookName || 'Book',
        lastName: 'Cover',
      } as any);
      const { secure_url } = await hostImageToCloudinary(
        imageName,
        bookCoverFile.path,
      );
      bookData.bookCover = secure_url as string;
    }

    if (bookPdfFile) {
      const fileName = `books/${Date.now()}-${bookPdfFile.originalname}`;
      const pdfUrl = await hostPdfToR2(fileName, bookPdfFile.path);
      bookData.bookFile = pdfUrl;
      bookData.isOurBook = true;
    }
  }

  const result = await Book.findByIdAndUpdate(id, bookData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }
  return result;
};

/* --------Logic For Soft Delete A Book From Database------ */
const softDeleteBookFromDB = async (id: string) => {
  const result = await Book.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }
  return result;
};

/* --------Logic For Permanent Delete A Book From Database------ */
const permanentDeleteBookFromDB = async (id: string) => {
  const result = await Book.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }
  return result;
};

export const BookServices = {
  createBookIntoDB,
  getAllBooksFromDB,
  getSingleBookFromDB,
  updateBookIntoDB,
  softDeleteBookFromDB,
  permanentDeleteBookFromDB,
};
