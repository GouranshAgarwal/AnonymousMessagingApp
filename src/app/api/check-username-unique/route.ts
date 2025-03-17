import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username:usernameValidation,
})

export async function GET(request:Request) {
    // The code commented below is deprecated in the new versions of nextjs
    /* 
    if(request.method != 'GET'){ //if POST or any other request is made then handle it here
        return Response.json({
            success:false,
            message:"only GET request is accepted"
        },{status:405})
    }
    */

    await dbConnect();
    try {
        const {searchParams} = new URL(request.url); 
        const queryParam = {username: searchParams.get('username')}; //made object type to inject in safeparse method

        // validate t username with zod
        const result = usernameQuerySchema.safeParse(queryParam); //takes queryParam as a parameter of type object
        // console.log(result); // to check what is getting returned

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success:false,
                message: usernameErrors?.length>0?usernameErrors.join(', '):"Invalid query parameter", //If usernameErrors array is empty return the string else provide the errors separated by a comma
            },{status:400})
        }

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified:true,
        })

        if(existingVerifiedUser){
            return Response.json({
                success:false, //we were checking if the entered username does not exists in the database but it does exists that is why it is false
                message:"username is already taken",
            },{status:400})
        }else{
            return Response.json({
                success:true,
                message:"username is unique",
            },{status:200})
        }
    } catch (error) {
        console.error("error checking username", error);
        return Response.json({
            success:false,
            message:"error checking username"
        },{status:500})
    }
}