import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookControllers } from './book.controller';
import { BookValidations } from './book.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { upload } from '../../utils/hostImageToCloudinary';
import { formDataToJsonConvertor } from '../../middlewares/formDataToJsonConvertor';

const router = express.Router();

router.post(
  '/create-book',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.fields([
    { name: 'bookCover', maxCount: 1 },
    { name: 'bookFile', maxCount: 1 },
  ]),
  formDataToJsonConvertor,
  validateRequest(BookValidations.createBookValidationSchema),
  BookControllers.createBook,
);

router.get('/', BookControllers.getAllBooks);

router.get('/:slug', BookControllers.getSingleBook);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.fields([
    { name: 'bookCover', maxCount: 1 },
    { name: 'bookFile', maxCount: 1 },
  ]),
  formDataToJsonConvertor,
  validateRequest(BookValidations.updateBookValidationSchema),
  BookControllers.updateBook,
);

router.patch(
  '/soft-delete/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  BookControllers.softDeleteBook,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  BookControllers.permanentDeleteBook,
);

export const BookRoutes = router;
