import { z } from 'zod';
import {
  Course,
  MarriagePlaning,
  Occupation,
  PresentCondition,
  UserStatus,
  YourGroup,
} from './user.constant';

const userNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  middleName: z.string().max(20).optional(),
  lastName: z.string().max(20),
});

const guardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fathersContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

const localGuardianValidationSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

const createUserValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    user: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: guardianValidationSchema.partial().optional(),
      localGuardian: localGuardianValidationSchema.partial().optional(),
      designation: z.string().optional(),
      firstCome: z.string().optional(),
      lastAttend: z.string().optional(),
      attachedWith: z.string().optional(),
      firstComeWith: z.string().optional(),
      yourGroup: z.enum([...YourGroup] as [string, ...string[]]).optional(),
      friendList: z.array(z.string()).optional(),
      firstPrasadamPrapti: z.string().optional(),
      presentCondition: z
        .enum([...PresentCondition] as [string, ...string[]])
        .optional(),
      presentStatus: z.string().optional(),
      presentCourse: z.enum([...Course] as [string, ...string[]]).optional(),
      courseCompleted: z.enum([...Course] as [string, ...string[]]).optional(),
      isStudentOfGitaClass: z.boolean().optional(),
      eventParticipated: z.array(z.string()).optional(),
      completed_IDC: z.boolean().optional(),
      isDikkhshaTaken: z.boolean().optional(),
      dikkhshaDate: z.string().optional(),
      guruMaharajName: z.string().optional(),
      occupation: z.enum([...Occupation] as [string, ...string[]]).optional(),
      isAcademicEducationCompleted: z.boolean().optional(),
      isMarried: z.boolean().optional(),
      maritalPlanning: z
        .enum([...MarriagePlaning] as [string, ...string[]])
        .optional(),
      futureCareerPlaning: z.string().optional(),
      lifeGoal: z.string().optional(),
      expertIn: z.string().optional(),
      teamService: z.string().optional(),
      additionalInformation: z.string().optional(),
      badHabits: z.array(z.string()).optional(),
      wantToDonateBlood: z.boolean().optional(),
      lastBloodDonateAt: z.string().optional(),
      totalBloodDonationCount: z.number().optional(),
      isRegularlyDonateBlood: z.boolean().optional(),
      lastOnline: z.string().optional(),
      role: z.enum(['admin', 'student']).optional(),
    }),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    user: z.object({
      name: userNameValidationSchema.partial().optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: guardianValidationSchema.partial().optional(),
      localGuardian: localGuardianValidationSchema.partial().optional(),
      profileImage: z.string().optional(),
      designation: z.string().optional(),
      firstCome: z.string().optional(),
      lastAttend: z.string().optional(),
      attachedWith: z.string().optional(),
      firstComeWith: z.string().optional(),
      yourGroup: z.enum([...YourGroup] as [string, ...string[]]).optional(),
      friendList: z.array(z.string()).optional(),
      firstPrasadamPrapti: z.string().optional(),
      presentCondition: z
        .enum([...PresentCondition] as [string, ...string[]])
        .optional(),
      presentStatus: z.string().optional(),
      presentCourse: z.enum([...Course] as [string, ...string[]]).optional(),
      courseCompleted: z.enum([...Course] as [string, ...string[]]).optional(),
      isStudentOfGitaClass: z.boolean().optional(),
      eventParticipated: z.array(z.string()).optional(),
      completed_IDC: z.boolean().optional(),
      isDikkhshaTaken: z.boolean().optional(),
      dikkhshaDate: z.string().optional(),
      guruMaharajName: z.string().optional(),
      occupation: z.enum([...Occupation] as [string, ...string[]]).optional(),
      isAcademicEducationCompleted: z.boolean().optional(),
      isMarried: z.boolean().optional(),
      maritalPlanning: z
        .enum([...MarriagePlaning] as [string, ...string[]])
        .optional(),
      futureCareerPlaning: z.string().optional(),
      lifeGoal: z.string().optional(),
      expertIn: z.string().optional(),
      teamService: z.string().optional(),
      additionalInformation: z.string().optional(),
      badHabits: z.array(z.string()).optional(),
      wantToDonateBlood: z.boolean().optional(),
      lastBloodDonateAt: z.string().optional(),
      totalBloodDonationCount: z.number().optional(),
      isRegularlyDonateBlood: z.boolean().optional(),
      lastOnline: z.string().optional(),
      role: z.enum(['admin', 'student']).optional(),
      status: z.enum([...UserStatus] as [string, ...string[]]).optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const userValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  changeStatusValidationSchema,
};
