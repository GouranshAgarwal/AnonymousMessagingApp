'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { RefreshCw, Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardContent, Card, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import * as z from 'zod';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

export default function Page() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestedMessages = async () => {
    setIsSuggestionLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/suggest-messages');
      if (res.data.message) {
        setSuggestedMessages(parseStringMessages(res.data.message));
      } else {
        setError('No suggestions available.');
      }
    } catch (err) {
      setError('Failed to fetch suggestions. Please try again.');
    } finally {
      setIsSuggestionLoading(false);
    }
  };

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/send-message', {
        ...data,
        username,
      });
      toast(response.data.message);
      form.reset({ content: '' });
    } catch (error) {
      const axiosError = error as AxiosError;
      toast(axiosError.response?.data.message ?? 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto space-y-8 min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 py-12 px-4 sm:px-6">
      <Card className="bg-gradient-to-br from-indigo-950 to-purple-900 border-purple-500/30 shadow-2xl max-w-2xl mx-auto">
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
      <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-md border border-purple-500/20 shadow-xl text-white max-w-2xl mx-auto">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-xl font-semibold text-pink-100">Need Inspiration?</CardTitle>
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestionLoading}
              variant="outline"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white text-sm px-4 py-2 rounded-lg shadow-md shadow-purple-500/20 transition-all hover:shadow-purple-500/30 flex items-center gap-2"
            >
              {isSuggestionLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {isSuggestionLoading ? "Loading..." : "Get Ideas"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {error ? (
            <div className="text-center py-6 text-purple-300">
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestedMessages.map((message, index) => (
                <div key={index} className="flex items-start px-2 py-2">
                  <Sparkle className="h-5 w-5 text-purple-300 mr-2 mt-2 flex-shrink-0 group-hover:text-purple-200" />
                  <div className="min-w-0 flex-1">
                    <Button
                      variant="outline"
                      onClick={() => handleMessageClick(message)}
                      className="w-full justify-start py-3 px-4 rounded-lg border border-purple-500/20 bg-indigo-800/40 hover:bg-indigo-700/50 text-purple-100 transition-all hover:border-purple-500/40 text-left h-auto whitespace-normal"
                    >
                      {message}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}