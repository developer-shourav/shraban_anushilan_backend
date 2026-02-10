import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

const logInUser = async (payload: TLoginUser) => {
  // ----------Check if the user is exist
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // --------- checking if the user already deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }

  // --------- checking if the user is Blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked!');
  }

  // ----------Checking if the password Match or Not

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
  }

  // ----------Create token and send to the client
  const jwtPayload = {
    userId: user?._id,
    role: user?.role,
  };
  // --- Create AccessToken
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  // --- Create RefreshToken
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needPasswordChange,
  };
};

const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // ----------Check if the user is exist
  const user = await User.findById(userData?.userId).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // --------- checking if the user already deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }

  // --------- checking if the user is Blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked!');
  }

  // ----------Checking if the password Match or Not

  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong Old Password!');
  }

  // ----------Checking if the Old Password and the New update password are same

  if (payload?.oldPassword === payload?.newPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'Create Unique New Password');
  }

  // ----------Hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findByIdAndUpdate(
    userData.userId,
    {
      password: newHashedPassword,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (TOKEN: string) => {
  /* -------Checking the token validity */
  const decoded = verifyToken(TOKEN, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;

  // ----------Check if the user is exist
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // --------- checking if the user already deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }

  // --------- checking if the user is Blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked!');
  }

  // ------- checking if the token issued before password change
  if (
    user.passwordChangedAt &&
    User.isJwtTokenIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Unauthorized!! Your are not permitted💀',
    );
  }

  // ----------Create token and send to the client
  const jwtPayload = {
    userId: user?._id,
    role: user?.role,
  };
  // --- Create AccessToken
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPasswordIntoDB = async (userId: string) => {
  // ----------Check if the user is exist
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // --------- checking if the user already deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }

  // --------- checking if the user is Blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked!');
  }

  // ----------Create token
  const jwtPayload = {
    userId: user?._id,
    role: user?.role,
  };
  // --- Create AccessToken
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const restUILink = `${config.reset_password_ui_link}/userId=${user?._id}&token=${resetToken}`;

  /* ---------Send Password Reset Link to the user email address-------- */
  await sendEmail(user?.email, restUILink);
};

const resetPasswordIntoDB = async (
  payload: { userId: string; newPassword: string },
  TOKEN: string,
) => {
  // ----------Check if the user is exist
  const user = await User.findById(payload?.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // --------- checking if the user already deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is deleted!');
  }

  // --------- checking if the user is Blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked!');
  }

  /* -------Checking the token validity */
  const decoded = verifyToken(TOKEN, config.jwt_access_secret as string);

  // -------- checking the user is permitted to reset the password
  if (decoded.userId !== payload.userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Unauthorized!! Your are not permitted💀',
    );
  }

  // ----------Hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findByIdAndUpdate(
    decoded.userId,
    {
      password: newHashedPassword,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return {};
};
export const AuthServices = {
  logInUser,
  changePasswordIntoDB,
  refreshToken,
  forgetPasswordIntoDB,
  resetPasswordIntoDB,
};
