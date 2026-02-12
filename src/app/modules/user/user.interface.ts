/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

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

export type TGender = 'male' | 'female' | 'other';
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type YourGroup = 
  | "child"
  | "high school pupil"
  | "college pupil"
  | "university pupil"
  | "senior"
  | "old";

export type PresentCondition =
  | "come and go"
  | "sometimes come"
  | "sometimes prasadam"
  | "starts satvic vojan"
  | "starts prasadam vojan"
  | "started prasadam vojan and no progress"
  | "preparation for dikkhsha"
  | "waiting for dikkhsha"
  | "after dikkhsha no progress"
  | "preparation for brahmana dikkhsha"
  | "after brahmana dikkhsha working on progress";



export type Course =
  | "ISKCON Disciple Course (IDC)"
  | "Bhakti-Sastri"
  | "Bhakti-Vaibhava"
  | "Bhakti-Vedanta"
  | "Bhakti-Sarvabhauma"
  | "TTC-1"
  | "TTC-2"
  | "BS-TTCF"
  | "Leadership and Management"
  | "Archana";

export type Occupation = 'student' | 'businessman' | 'job' | 'privet service' | 'govt service' | 'untempted' | 'shop assistant' | 'chef' | 'driver' | 'firmer' | 'teacher' | 'house wife' | 'content creator' | 'blogging';

export type MarriagePlaning = "depends on councillor" | "confused" | "brahmachari" | "grahastha" | "in a relation";

export interface TUser {
  _id: string;
  name: TUserName;
  gender?: TGender;
  dateOfBirth?: string;
  email: string;
  contactNo?: string;
  emergencyContactNo?: string;
  bloodGroup?: TBloodGroup;
  presentAddress?: string;
  permanentAddress?: string;
  guardian?: TGuardian;
  localGuardian?: TLocalGuardian;
  profileImage?: string;
  designation?: string;
  // New Fields
  firstCome?: Date;
  lastAttend?: Date;
  attachedWith?: string;
  firstComeWith?: string;
  yourGroup?: YourGroup;
  friendList?: string[];
  firstPrasadamPrapti?: Date | string;
  presentCondition?: PresentCondition;
  presentStatus?: string;
  presentCourse?: Course;
  courseCompleted?: Course;
  isStudentOfGitaClass?: boolean;
  eventParticipated: string[];
  completed_IDC?: boolean;
  isDikkhshaTaken?: boolean;
  dikkhshaDate?: Date;
  guruMaharajName?: string;
  occupation?: Occupation;
  isAcademicEducationCompleted?: boolean;
  isMarried?: boolean;
  maritalPlanning?: MarriagePlaning;
  futureCareerPlaning?: string;
  lifeGoal?: string;
  expertIn?: string;
  teamService?: string;
  additionalInformation?: string;
  badHabits?: string[];
  wantToDonateBlood?: boolean;
  lastBloodDonateAt?: Date;
  totalBloodDonationCount?: number;
  isRegularlyDonateBlood?: boolean;
  lastOnline?: Date;
  //--------------New End
  password: string;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'superAdmin' | 'admin' | 'student';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isPasswordMatched(
    userInputPassword: string,
    storedHashedPassword: string,
  ): Promise<boolean>;
  isJwtTokenIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
