// import { resend } from "@/lib/resend"; 
// import VerificationEmail from "../../emails/verificationEmail";
// import React from "react";
import { sendEmail } from "@/lib/sendEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await sendEmail(
      email,
      "Mystry Message | Verification Code",
      `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hello ${username},</h2>
          <p>Your verification code is:</p>
          <h1 style="color: purple;">${verifyCode}</h1>
          <p>This code will expire soon.</p>
        </div>
      `
    );

    return {
      success: true,
      message: "Successfully sent verification email",
    };
  } catch (error) {
    console.error("error sending verification email", error);
    return {
      success: false,
      message: "failed to send verification email",
    };
  }
}


// export async function sendVerificationEmail(
//     email:string,
//     username:string,
//     verifyCode:string,
// ): Promise<ApiResponse>{
//     try {
//         await resend.emails.send({
//             from: 'onboarding@resend.dev',
//             to: email,
//             subject: 'Mystry Message | Verification Code',
//             react: React.createElement(VerificationEmail, { username, otp: verifyCode }),

//           });

//         return {
//             success:true,
//             message:"Successfully sent verification email",
//         }
//     } catch (error) {
//         console.error("error sending verification email", error);
//         return {
//             success:false,
//             message:"failed to send verification email",
//         }
//     }
// } 

