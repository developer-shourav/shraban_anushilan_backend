import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';

/* ----------------------Create A User----------------- */
const createUser = catchAsync(async (req, res) => {
  const { password, user: userData } = req.body;

  // will call service function to send this data
  const result = await UserServices.createUserIntoDB(
    password,
    userData,
  );

  sendResponse(res, {
    message: 'User is created successfully',
    data: result,
  });
});

/* ----------------------Get All Users----------------- */
const getAllUsers = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await UserServices.getAllUsersFromDB(query);

  sendResponse(res, {
    message: 'All users are retrieved successfully',
    data: result,
  });
});

/* ----------------------Get Single User----------------- */
const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    message: 'User retrieved successfully',
    data: result,
  });
});

/* ----------------------Update User----------------- */
const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const imageFileDetails = req.file;

  const result = await UserServices.updateUserIntoDB(id, user, imageFileDetails);

  sendResponse(res, {
    message: 'User updated successfully',
    data: result,
  });
});

/* ----------------------Delete User----------------- */
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.deleteUserFromDB(id);

  sendResponse(res, {
    message: 'User deleted successfully',
    data: result,
  });
});

/* ----------------------Change User Status by Admin----------------- */
const changeStatus = catchAsync(async (req, res) => {
  const payload = req.body;
  const id = req.params.id;

  // will call service function to send this data
  const result = await UserServices.changeUserStatusIntoDB(id, payload);

  sendResponse(res, {
    message: 'User status is changed successfully',
    data: result,
  });
});

/* ----------------------Get Me (Controller for getting present user info)----------------- */
const getMe = catchAsync(async (req, res) => {
  const { role, userId } = req.user;

  // will call service function to send this data
  const result = await UserServices.getMe(role, userId);
  const userRole = role.charAt(0).toUpperCase() + role.slice(1);

  sendResponse(res, {
    message: `${userRole} data is fetched successfully`,
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  changeStatus,
  getMe,
};
