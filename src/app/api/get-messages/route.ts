import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";
import { toast } from "sonner";

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
    const userId = new mongoose.Types.ObjectId(user._id); //bcz we converted user to string and it causes problem in aggregation pipeline
    // console.log("UserId: ",userId)
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } }, // Ensure ObjectId type
            { $unwind: { path: "$message", preserveNullAndEmptyArrays: true } }, // Avoids empty array issue
            { $sort: { "message.createdAt": -1 } }, // Sort messages
            {
              $group: {
                _id: "$_id",
                messages: { $push: "$message" } // Re-group messages
              }
            }
          ]);
          

        // console.log("user: ",user);
        // console.log(user.length===0);

        

        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:404})
        }

        if(user.length===0){
            return Response.json({
                success:true,
                message:"No Messages Found"
            },{status:200})
        }

        return Response.json({
            success:true,
            message:user[0].messages,
        },{status:200})

    } catch (error) {
        console.error("error::get-messages: ",error)
        return Response.json({
            success:false,
            message:"error getting messages"
        },{status:401})
    }
}