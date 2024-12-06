import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(80).optional(),
});
export type createWorkflowSchemaType = z.infer<typeof createWorkflowSchema>;
