import { z } from "zod";    

export const messageSchema = z.object({
    content:z
    .string()
    .min(5, {message:"content must be atlease 5 characters"})
    .max(300, {message:"content must be no longer 300 characters"})
})