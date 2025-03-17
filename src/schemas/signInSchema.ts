import { z } from "zod";    

export const signInSchema = z.object({
    identifier:z.string(), //this is for email
    password:z.string(),
})