/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { hostImageToCloudinary } from '../../utils/hostImageToCloudinary';
import { uniqueImageNameGenerator } from '../../utils/uniqueImageNameGenerator';

/* --------Logic For Create an Student------ */
const createStudentIntoDB = async (
  password: string,
  imageFileDetails: any,
  payload: TStudent,
) => {
  // Create an user object
  const userData: Partial<TUser> = {};

  // ----------If Password is not given , use default password----------
  userData.password = password || (config.default_password as string);

  // ----------Set student role and Email----------
  userData.role = 'student';
  userData.email = payload.email;



  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ----------send Image to the cloudinary----------
    if (imageFileDetails) {
      const imagePath = imageFileDetails?.path;
      const { imageName } = uniqueImageNameGenerator(payload.name);
      const { secure_url } = await hostImageToCloudinary(imageName, imagePath);

      payload.profileImage = secure_url as string;
    }

    // ----------Create an user
    const newUser = await User.create([userData], { session });

    // ----------Create a Student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id,  _id as user
    payload.userId = newUser[0]._id; // Reference Id

    const newStudent = await Student.create([payload], { session });

    if (!newStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(`${err}`);
  }
};


/* --------Logic For Create An Admin------ */
const createAdminIntoDB = async (
  password: string,
  imageFileDetails: any,
  payload: TAdmin,
) => {
  // Create an user object
  const userData: Partial<TUser> = {};

  // ----------If Password is not given , use default password----------
  userData.password = password || (config.default_password as string);

  // ----------Set Admin role and email----------
  userData.role = 'admin';
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // ----------send Image to the cloudinary----------
    if (imageFileDetails) {
      const imagePath = imageFileDetails?.path;
      const { imageName } = uniqueImageNameGenerator(payload.name);
      const { secure_url } = await hostImageToCloudinary(imageName, imagePath);
      payload.profileImage = secure_url as string;
    }

    // ----------Create an user
    const newUser = await User.create([userData], { session });

    // ----------Create a Student
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id,  _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // Reference Id

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(`${err}`);
  }
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
  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createAdminIntoDB,
  changeUserStatusIntoDB,
  getMe,
};
