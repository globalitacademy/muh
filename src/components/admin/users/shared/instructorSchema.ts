
import { z } from 'zod';

export const instructorSchema = z.object({
  email: z.string().email('Վավերացված էլ-փոստ լոտկ է պահանջվում').optional(),
  name: z.string().min(2, 'Անունը պետք է բաղկացած լինի առնվազն 2 նիշից'),
  organization: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  group_number: z.string().optional(),
});

export const addInstructorSchema = instructorSchema.extend({
  email: z.string().email('Վավերացված էլ-փոստ լոտկ է պահանջվում'),
});

export type InstructorFormData = z.infer<typeof instructorSchema>;
export type AddInstructorFormData = z.infer<typeof addInstructorSchema>;
