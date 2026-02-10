/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { TUser } from './user.interface';
import { User } from './user.model';

import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { hostImageToCloudinary } from '../../utils/hostImageToCloudinary';
import { uniqueImageNameGenerator } from '../../utils/uniqueImageNameGenerator';
import QueryBuilder from '../../builder/QueryBuilder';

/* --------Logic For Create an User------ */
const createUserIntoDB = async (
  password: string,
  imageFileDetails: any,
  payload: TUser,
) => {
  // Create an user object
  const userData: Partial<TUser> = { ...payload };

  // ----------If Password is not given , use default password----------
  userData.password = password || (config.default_password as string);

  // ----------Set default role to student if not provided----------
  userData.role = payload.role || 'student';
  
  // Set custom id as email for uniqueness (since we don't have a specific generator)
  userData.id = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ----------send Image to the cloudinary----------
    if (imageFileDetails) {
      const imagePath = imageFileDetails?.path;
      const { imageName } = uniqueImageNameGenerator(payload.name);
      const { secure_url } = await hostImageToCloudinary(imageName, imagePath);

      userData.profileImage = secure_url as string;
    }

    // ----------Create an user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    await session.commitTransaction();
    await session.endSession();

    return newUser[0];
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `${err}`);
  }
};

/* --------Logic For Get All Users From Database------ */
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userSearchFields = [
    'email',
    'id',
    'contactNo',
    'name.firstName',
    'name.lastName',
    'name.middleName',
  ];

  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchFields)
    .filter()
    .sort()
    .pagination()
    .fieldFiltering();

  const result = await userQuery.queryModel;
  const meta = await userQuery.countTotal();
  return { meta, result };
};

/* --------Logic For Get A Single User From Database------ */
const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

/* --------Logic For Update An User From Database------ */
const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
  const { name, guardian, localGuardian, ...remainingUserData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingUserData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await User.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

/* --------Logic For Delete An User------ */
const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
  }
  return result;
};

/* --------Logic For Change Status ------ */
const changeUserStatusIntoDB = async (
  id: string,
  payload: { status: string },
) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to change user status');
  }
  return result;
};

/* --------Logic For getting present loggedIn user's info ------ */
const getMe = async (role: string, userId: string) => {
  const result = await User.findOne({ id: userId });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  changeUserStatusIntoDB,
  getMe,
};
