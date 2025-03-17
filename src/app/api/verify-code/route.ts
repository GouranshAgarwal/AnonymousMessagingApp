import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, code} = await request.json();
        // console.log("username recieved in the post request: ", username);
        const decodedUsername = decodeURIComponent(username) //since the username might be encoded if taken from url [by GET method] (not applicable in this case)
        // console.log("decodedUsername: ", decodedUsername)
        const user = await UserModel.findOne({
            username:decodedUsername,
        });

        if(!user){
            return Response.json({
                success:false,
                message:"user not found",
            },{status:400});
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success:true,
                message:"Account verified successfully"
            },{status:200})
        }else if(!isCodeValid){
            return Response.json({
                success:false,
                message:"Invalid OTP"
            },{status:400})
        }else{
            return Response.json({
                success:false,
                message:"Account Expired, Please sign-up again" //bcz this application is working this way, in normal application this will not be needed
            },{status:400})
        }
    } catch (error) {
        console.error("error verifying user", error);
        return Response.json({
            success:false,
            message:"error verifying user",
        },{status:500})
    }
}