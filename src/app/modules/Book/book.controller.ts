import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookServices } from './book.service';

const createBook = catchAsync(async (req, res) => {
  const result = await BookServices.createBookIntoDB(req.body, req.files);

  sendResponse(res, {
    message: 'Book created successfully',
    data: result,
  });
});

const getAllBooks = catchAsync(async (req, res) => {
  const result = await BookServices.getAllBooksFromDB(req.query);

  sendResponse(res, {
    message: 'Books fetched successfully',
    data: result,
  });
});

const getSingleBook = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await BookServices.getSingleBookFromDB(slug);

  sendResponse(res, {
    message: 'Book fetched successfully',
    data: result,
  });
});

const updateBook = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookServices.updateBookIntoDB(id, req.body, req.files);

  sendResponse(res, {
    message: 'Book updated successfully',
    data: result,
  });
});

const softDeleteBook = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookServices.softDeleteBookFromDB(id);

  sendResponse(res, {
    message: 'Book soft deleted successfully',
    data: result,
  });
});

const permanentDeleteBook = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookServices.permanentDeleteBookFromDB(id);

  sendResponse(res, {
    message: 'Book permanently deleted successfully',
    data: result,
  });
});

export const BookControllers = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  softDeleteBook,
  permanentDeleteBook,
};
