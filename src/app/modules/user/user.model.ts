import { model, Schema } from 'mongoose';
import {
  TUser,
  UserModel,
  TUserName,
  TGuardian,
  TLocalGuardian,
} from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import {
  Course,
  MarriagePlaning,
  Occupation,
  PresentCondition,
  UserStatus,
  YourGroup,
} from './user.constant';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is required'],
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father name is required.'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation is required.'],
    trim: true,
  },
  fathersContactNo: {
    type: String,
    required: [true, "Father's contact number is required."],
  },
  motherName: {
    type: String,
    required: [true, 'Mother name is required.'],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required.'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, "Mother's contact number is required."],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local guardian name is required.'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'Local guardian occupation is required.'],
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian contact number is required.'],
  },
  address: {
    type: String,
    required: [true, 'Local guardian address is required.'],
    trim: true,
  },
});

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender.',
      },
      trim: true,
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String },
    emergencyContactNo: {
      type: String,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
    },
    permanentAddress: {
      type: String,
    },
    guardian: {
      type: guardianSchema,
    },
    localGuardian: {
      type: localGuardianSchema,
    },
    profileImage: { type: String, default: '' },
    designation: {
      type: String,
    },
    firstCome: { type: Date },
    lastAttend: { type: Date },
    attachedWith: { type: String },
    firstComeWith: { type: String },
    yourGroup: {
      type: String,
      enum: YourGroup,
    },
    friendList: [{ type: String }],
    firstPrasadamPrapti: { type: Schema.Types.Mixed },
    presentCondition: {
      type: String,
      enum: PresentCondition,
    },
    presentStatus: { type: String },
    presentCourse: {
      type: String,
      enum: Course,
    },
    courseCompleted: {
      type: String,
      enum: Course,
    },
    isStudentOfGitaClass: { type: Boolean },
    eventParticipated: [{ type: String }],
    completed_IDC: { type: Boolean },
    isDikkhshaTaken: { type: Boolean },
    dikkhshaDate: { type: Date },
    guruMaharajName: { type: String },
    occupation: {
      type: String,
      enum: Occupation,
    },
    isAcademicEducationCompleted: { type: Boolean },
    isMarried: { type: Boolean },
    maritalPlanning: {
      type: String,
      enum: MarriagePlaning,
    },
    futureCareerPlaning: { type: String },
    lifeGoal: { type: String },
    expertIn: { type: String },
    teamService: { type: String },
    additionalInformation: { type: String },
    badHabits: [{ type: String }],
    wantToDonateBlood: { type: Boolean },
    lastBloodDonateAt: { type: Date },
    totalBloodDonationCount: { type: Number },
    isRegularlyDonateBlood: { type: Boolean },
    lastOnline: { type: Date },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'student'],
      default: 'student',
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// generating full name
userSchema.virtual('fullName').get(function () {
  const firstName = this?.name?.firstName;
  const middleName = this?.name?.middleName;
  const lastName = this?.name?.lastName;
  if (firstName && middleName && lastName) {
    return `${firstName} ${middleName} ${lastName}`;
  } else if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else {
    return '';
  }
});

/* --------------- Document Middleware ------------------------- */

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// ---------Set Empty sting after setting password
userSchema.post('save', function (doc, next) {
  doc.password = '';

  next();
});

// ----------Check if the password match with the actual password
userSchema.statics.isPasswordMatched = async function (
  userInputPassword,
  storedHashedPassword,
) {
  return await bcrypt.compare(userInputPassword, storedHashedPassword);
};

// ----------Check if the Token issued before password changed
userSchema.statics.isJwtTokenIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTimeInSeconds =
    new Date(passwordChangedTimestamp).getTime() / 1000;

  return passwordChangedTimeInSeconds > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('user', userSchema);
