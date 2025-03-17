'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Loader2} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const router = useRouter();

  //zod implementation in form 
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{ 
      identifier:"",
      password:"",
    }
  });

  const onSubmit = async (data : z.infer<typeof signInSchema>) => {

    setIsSubmitting(true);
    const response = await signIn("credentials",{
      redirect:false,
      identifier:data.identifier,
      password:data.password,
    })

    if( !response || response?.status !== 200){
      toast(`Incorrect email or password`);
    }

    if(response?.url){
      router.replace(`/dashboard`)
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 absolute bg-gradient-to-r from-purple-600 to-pink-600 opacity-90 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username/email</FormLabel>
                <FormControl>
                  <Input placeholder="username/email" className="placeholder:text-pink-100"
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
          <Button type="submit"  className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            new User?{' '}
            <Link href="/sign-up" className="bg-purple-500/20 text-purple-950 hover:text-purple-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page;