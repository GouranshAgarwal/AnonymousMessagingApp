'use client'
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm } from 'react-hook-form';
import * as z  from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
const verifyAccount = () => {
    const router = useRouter();
    const param = useParams<{username : string}>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
    });

    const onSubmit = async (data : z.infer<typeof verifySchema>) => {
      // console.log("username: ",param.username.length);
        setIsSubmitting(true);
        try {
            const response = await axios.post(`/api/verify-code`, {
                username:param.username,
                code:data.code
            })
            // console.log("username: ",param.username);
            toast(response.data.message);

            router.replace(`/sign-in`);
        } catch (error) {
            console.error("error while signing up the user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast(errorMessage); 
        }finally{
            setIsSubmitting(false);
        }
    }
  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 absolute bg-gradient-to-r from-purple-600 to-pink-600 opacity-90 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                        <Input placeholder="XXX-XXX" {...field} className="placeholder:text-pink-100" />
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
                'Verify'
              )}
            </Button>
            </form>
        </Form>
        </div>
    </div>
    </>
  )
}

export default verifyAccount;