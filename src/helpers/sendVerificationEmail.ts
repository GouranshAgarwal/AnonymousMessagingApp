import { resend } from "@/lib/resend"; 
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import React from "react";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry Message | Verification Code',
            react: React.createElement(VerificationEmail, { username, otp: verifyCode }),

          });

        return {
            success:true,
            message:"Successfully sent verification email",
        }
    } catch (error) {
        console.error("error sending verification email", error);
        return {
            success:false,
            message:"failed to send verification email",
        }
    }
} 

