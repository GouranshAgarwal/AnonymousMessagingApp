import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function POST(request:Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401})
    }

    const user : User = session?.user as User;
    const user_id = user._id;

    try {
        const {acceptMessages} = await request.json();
        const updatedUser = await UserModel.findByIdAndUpdate(
            user_id,
            {
                isAcceptingMessage:acceptMessages
            },
            {
                new:true
            }
        )

        if(!updatedUser){
            return Response.json({
                success:false,
                message:"failed to update user status to accept messages",
            },{status:400})
        }

        return Response.json({
            success:true,
            message:`Messages are ${acceptMessages?"now accepted":"not accepted now"}`,
            updatedUser,
        },{status:200})
    
    } catch (error) {
        console.error("failed to update user status to accept messages", error);
        return Response.json({
            success:false,
            message:"failed to update user status to accept messages",
        },{status:500})
    }
}


export async function GET(request:Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401})
    }

    const user : User = session?.user as User;
    const user_id = user?._id;
    // console.log(user_id)
    try {
        const found_user = await UserModel.findById(user_id);
        // console.log(user_id);
        if(!found_user){
            return Response.json({
                success:false,
                message:"user not found",
            },{status:404})
        }

        return Response.json({
            success:true,
            isAcceptingMessages:found_user.isAcceptingMessage,
        },{status:200})

    } catch (error) {
        console.error("error getting user status for accepting messages");
        return Response.json({
            success:false,
            message:"failed to get user status for accepting messages",
        },{status:500})
    }
}