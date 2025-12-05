'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
//   const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast(response.data.message,);
      onMessageDelete(message?._id);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message ?? 'Failed to delete message');
    } 
  };

  return (<>
    <Card className="bg-gradient-to-br from-indigo-950 to-purple-900 border-purple-500/30 shadow-2xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
            {message.content}
          </CardTitle>

          <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm" 
              className="bg-purple-900/50 hover:bg-purple-800/70 text-pink-300 hover:text-pink-200 border border-purple-600/30 rounded-full p-1 flex items-center justify-center min-h-0 h-8 w-8 shadow-md shadow-purple-900/20 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="flex justify-center items-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white border-0 rounded-xl shadow-xl">
            <div className="relative w-full max-w-md overflow-hidden rounded-xl">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"></div>
              
              <div className="relative z-10 p-6">
                <AlertDialogHeader className="space-y-3">
                  <AlertDialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                    Delete this message?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-purple-100/80 text-base">
                    This action cannot be undone. This message will be permanently removed from your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex items-center justify-end gap-3 mt-6">
                  <AlertDialogCancel className="bg-indigo-950/70 hover:bg-indigo-900 text-purple-200 border border-purple-700/30 font-medium rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteConfirm} 
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium border-0 rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
          
        </div>
        <div className="text-pink-300">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent className="pt-0"></CardContent>
    </Card>
</>
  );
}