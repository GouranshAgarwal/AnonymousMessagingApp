import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions : NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name: "Credentials",
            credentials:{
                email:{label:"Email", type:"text"},
                password:{label:"Password", type:"password"}
            },
            async authorize(credentials:any): Promise<any>{
                await dbConnect() //bcz i need to ask the database for the available info to authorize
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("no user found with this email");
                    }

                    if(!user.isVerified){
                        throw new Error("please verify your account before login");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password); //credentials.password is used instead of credentials.identifier bcz password was given this way in the credentials
                    if(isPasswordCorrect){
                        return user; //finally you need to return the user and next-auth will create the UI and do the further tasks by itself
                    }else{
                        throw new Error("Incorrect Passoword");
                    }
                } catch (err:any) {
                    throw new Error(err); // bcz next-auth automatically gives the error message or redirects the user to the error page that is why we need to always throw an error 
                }
            }

        }) 
    ],
    callbacks:{
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessage;
                token.username = user.username;
            }

            return token;
        },

        async session({session, token}) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages:{
        signIn:"/sign-in", //next-auth creates the whole page for this and handles it
    },
    session:{
        strategy:"jwt",
    },
    secret:process.env.NEXTAUTH_SECRET
}