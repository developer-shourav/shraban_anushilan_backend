import { z } from 'zod';
import { UserStatus } from './user.constant';

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
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: guardianValidationSchema.optional(),
      localGuardian: localGuardianValidationSchema.optional(),
      designation: z.string().optional(),
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
      designation: z.string().optional(),
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
