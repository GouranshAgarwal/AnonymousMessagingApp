import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request) {
    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        // console.log("email:  ",email);

        const isExistingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true,
        })

        if(isExistingUserVerifiedByUsername){
            return Response.json({
                 success:false,
                 message:"username is already taken",
            },{status:400,})
        }

        const ExistingUserByEmail = await UserModel.findOne({
            email,
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(ExistingUserByEmail){
            if(ExistingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exists with this email",
                },{status:400})
            }else{
                //user exists but is not verified
                const hashedPassword = await bcrypt.hash(password, 10);
                ExistingUserByEmail.username = username;
                ExistingUserByEmail.password = hashedPassword;
                ExistingUserByEmail.verifyCode = verifyCode;
                ExistingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);

                await ExistingUserByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                message:[],
            })

            await newUser.save();
        }

        //send verification email 
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        // console.log(emailResponse);


        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message,
            },{status:500})
        }

        return Response.json({
            success:true,
            message:"User Registered Successfully",
        },{status:200})

    } catch (error) {
        console.error("error registering user", error);
        return Response.json({
            success:false,
            message:"error registering user",
        },{
            status:500,
        })
    }
}