import mongoose, {Schema, Document} from "mongoose"

export interface Message extends Document{
    content: string,
    createdAt: Date,
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now,
    }
})

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessage:boolean,
    message:Message[],
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:true,
        trim:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "please use a valid email address"],
    },
    password:{
        type:String,
        required:true,
    },
    verifyCode:{
        type:String,
        required:true,
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:false,
    },
    message:[MessageSchema],
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;