import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request:Request, {params}:{params:Promise<{id:string}>}) {
    
    await dbConnect();
    const session = await getServerSession(authOptions);

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401})
    }

    const user:User = session?.user as User; 
    const {id} = await params;
    const userId = new mongoose.Types.ObjectId(user._id);
    try {

        const deletedUser = await UserModel.updateOne(
            {_id:user._id},
            {
                $pull:{message:{_id:id}}
            }
        )

        if(deletedUser.modifiedCount == 0){
            return Response.json({
                success:false,
                message:"Message not found or already deleted"
            },{status:404})
        }

        return Response.json({
            success:true,
            message:"Message Deleted"
        },{status:200})

    } catch (error) {
        console.error("delete-message::error::", error)
        return Response.json({
            success:false,
            message:"Error Deleting the message"
        }, {status:500})
    }
}