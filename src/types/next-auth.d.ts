//This folder is made bcz we have made a custom user and we are also packing the token with more info and next-auth doesn't have them by default so we need to redifine the existing interfaces in next-auth

import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth"{
    interface User{
        _id?:string,
        username?:string,
        isVerified?:boolean,
        isAcceptingMessage?:boolean,
    }
    interface Session{
         user:{
            _id?:string,
            username?:string,
            isVerified?:boolean,
            isAcceptingMessage?:boolean,
         } & DefaultSession["user"] //This ensures that it doesn't thow an error in default session as we will recieve atleat "user" key (it might be empty) on querieng
    }
}

declare module "next-auth/jwt"{ //another way of doing the redefining the interfaces
    interface JWT{
        _id?:string,
        username?:string,
        isVerified?:boolean,
        isAcceptingMessage?:boolean,
    }
}