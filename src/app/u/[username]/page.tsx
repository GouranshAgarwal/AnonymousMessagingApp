'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, RefreshCw, SparkleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card, CardTitle } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// import { Textarea } from '@/components/ui/textarea';
// import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function Page() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message ?? 'Failed to sent message');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };

  
  return (
    <div className="mx-auto space-y-8 min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 py-12 px-4">
      <Card className="bg-gradient-to-br from-indigo-950 to-purple-900 border-purple-500/30 shadow-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-100">
            Anonymous Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-white">
                      Send to <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">@{username}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write your anonymous message here..."
                        className="bg-white/10 border-purple-400/30 placeholder:text-gray-400 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-400/50 rounded-lg py-6"
                        {...field}
                        // value={message || field.value}
                        // onChange={(e) => {
                        //   field.onChange(e);
                        //   setMessage(e.target.value);
                        // }}
                      />
                    </FormControl>
                    <FormMessage className="text-pink-300" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg py-6 text-lg font-medium shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Suggestions Card */}
      <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-md border border-purple-500/20 shadow-xl text-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-pink-100">
              Need Inspiration?
            </CardTitle>
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestionLoading}
              variant="outline"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white text-sm px-4 py-2 rounded-lg shadow-md shadow-purple-500/20 transition-all hover:shadow-purple-500/30 flex items-center gap-2"
            >
              {(isSuggestionLoading) ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {(isSuggestionLoading) ? "Loading..." : "Get Ideas"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {!error ? (
            <div className="space-y-3">
              {parseStringMessages(completion).map((message, index) => (
                <Button
                key={index}
                variant="outline"
                onClick={() => handleMessageClick(message)}
                className="flex items-start gap-3 rounded-lg border border-purple-500/20 bg-indigo-800/40 hover:bg-indigo-700/50 p-4 text-purple-100 transition-all hover:border-purple-500/40 cursor-pointer group"
                >
                  <SparkleIcon className="h-5 w-5 text-purple-300 mt-0.5 flex-shrink-0 group-hover:text-purple-200" />
                  <p className="text-sm group-hover:text-white transition-colors">{message}</p>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-purple-300">
              <p>Click "Get Ideas" to see message suggestions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
