import { Model, Types } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fathersContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  userId: Types.ObjectId;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  email: string;
  avatar?: string;
  contactNumber: string;
  emergencyContactNo?: string;
  bloodGroup?: TBloodGroup;
  presentAddress?: string;
  permanentAddress?: string;
  guardian?: TGuardian;
  localGuardian?: TLocalGuardian;
  profileImage?: string;
  isDeleted: boolean;
};

// -------------- For crating Static instance

export interface StudentModel extends Model<TStudent> {
  isUserExists(userId: string): Promise<TStudent | null>;
}
