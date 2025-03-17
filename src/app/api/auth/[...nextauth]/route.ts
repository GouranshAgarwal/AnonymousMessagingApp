import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST} //Instead of writing separate handlers, we reuse handler for both GET and POST by aliasing it.
/*
long version of this code: 

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions); 
*/
