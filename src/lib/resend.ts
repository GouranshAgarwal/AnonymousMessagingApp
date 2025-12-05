import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API) //exporting so that whenever we need resend, the api get loaded