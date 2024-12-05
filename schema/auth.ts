import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
export type loginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),    
    username: z.string().min(3),
  })  
export type registerSchemaType = z.infer<typeof registerSchema>;
