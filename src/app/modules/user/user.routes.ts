import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { userValidation } from './user.validation';
import { upload } from '../../utils/hostImageToCloudinary';
import { formDataToJsonConvertor } from '../../middlewares/formDataToJsonConvertor';

const router = express.Router();

// -----------Create A User
router.post(
  '/create-user',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(userValidation.createUserValidationSchema),
  UserControllers.createUser,
);

// -----------Get All Users
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.getAllUsers,
);

// -----------Get Single User
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.student),
  UserControllers.getSingleUser,
);

// -----------Update User
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.student),
  upload.single('profileImage'),
  formDataToJsonConvertor,
  validateRequest(userValidation.updateUserValidationSchema),
  UserControllers.updateUser,
);

// -----------Delete User
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserControllers.deleteUser,
);

// -----------Change User Status by Admin
router.patch(
  '/change-status/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(userValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

// -----------Route to get own data
router.get(
  '/me',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
  ),
  UserControllers.getMe,
);

export const UserRoutes = router;
