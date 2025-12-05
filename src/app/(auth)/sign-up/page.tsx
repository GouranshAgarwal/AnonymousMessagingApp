'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from "next/link"
import { useEffect, useState } from "react"
import {useDebounceCallback, useDebounceValue} from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Loader2} from "lucide-react"
import { Button } from "@/components/ui/button"

const page = () => {

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState(""); //isUsernameAvailable
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500); //to delay the request to server as we write the username, we do not want to send request every time user types a letter, right? 
  const router = useRouter();

  //zod implementation in form 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:"",
      email:"",
      password:"",
    }
  });

  useEffect(()=>{
    const checkUsernameUnique = async () =>{
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        }finally{
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  },[username])

  const onSubmit = async (data : z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast(response.data.message)
      router.replace(`/verify/${username}`); 
      setIsSubmitting(false); // we have submitted the form  
    } catch (error) {
      console.error("error while signing up the user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast(errorMessage); 
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 absolute bg-gradient-to-r from-purple-600 to-pink-600 opacity-90 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" className="placeholder:text-pink-100"
                  {...field}
                  onChange={(e)=>{
                    field.onChange(e);
                    debounced(e.target.value);
                  }} 
                  />
                </FormControl>
                {
                    isCheckingUsername && <Loader2 className="animate-spin"/>
                }
                <p className={`text-sm ${usernameMessage === "username is unique" ? "text-green-300" : "text-red-100"}`}> {usernameMessage} </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input placeholder="email" className="placeholder:text-pink-100"
                  {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" className="placeholder:text-pink-100"
                  {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="bg-purple-500/20 text-purple-950 hover:text-purple-300">
              Sign in 
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page