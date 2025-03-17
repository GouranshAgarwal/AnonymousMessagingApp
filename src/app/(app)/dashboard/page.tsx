'use client'

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session, status } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      // console.log(response.data.isAcceptingMessages);
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get("/api/get-messages");
      setMessages(response.data.message || []);
      if (refresh) {
        toast("Showing latest messages");
        // console.log("response : ",response)
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, []);

  const handleSwitchChange = async () => {
    try {
      setIsSwitchLoading(true);
      const newAcceptMessages = !watch("acceptMessages"); // Get the latest value
      
      const response = await axios.post("/api/accept-messages", {
        acceptMessages: newAcceptMessages,
      });
  
      setValue("acceptMessages", newAcceptMessages, { shouldValidate: true });
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message || "Failed to update messages");
    } finally {
      setIsSwitchLoading(false);
    }
  };
  
  useEffect(() => {
    // Ensure session is fully loaded before making API calls
    if (status !== "authenticated") return;

    fetchMessages();
    fetchAcceptMessages();
  }, [status, fetchMessages, fetchAcceptMessages]);

  if (status === "loading") {
    return <div className="text-white">Loading...</div>;
  }

  if (!session) {
    return <div className="text-white">Please log in.</div>;
  }

  const user = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${user.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("Profile URL copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 py-12 px-4">
      <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-white/10 backdrop-blur-md border border-white/10 text-white">
        <div className="p-6 md:p-8">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
            User Dashboard
          </h1>

          <div className="mb-8 p-6 rounded-xl bg-white/5 backdrop-blur-sm shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-purple-200">
              Your Unique Link
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="flex-grow bg-indigo-950/50 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <Button
                className="bg-gradient-to-r my-auto from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg px-6 shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/30"
                onClick={copyToClipboard}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="mb-8 p-6 rounded-xl bg-white/5 backdrop-blur-sm shadow-md">
            <div className="flex items-center">
              <Switch
                {...register("acceptMessages")}
                checked={watch("acceptMessages")}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-gradient-to-r from-purple-500 to-pink-500"
              />
              <span className="ml-2">
                Accept Messages: {acceptMessages ? "On" : "Off"}
              </span>
            </div>
            <Separator className="bg-white/10 my-8" />

            <Button
              className="border-purple-400/30 text-white bg-white/5 hover:bg-white/10 rounded-lg px-4 py-2"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageCard
                    key={message?._id}
                    message={message}
                    className="max-w-md p-8 space-y-8 absolute bg-gradient-to-r from-purple-600 to-pink-600 opacity-90 rounded-lg shadow-md"
                    onMessageDelete={(messageId) =>
                      setMessages((prev) =>
                        prev.filter((msg) => msg._id !== messageId)
                      )
                    }
                  />
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 p-12 text-center rounded-xl bg-white/5 backdrop-blur-sm">
                  <p className="text-lg text-indigo-200">
                    No messages to display yet.
                  </p>
                  <p className="mt-2 text-purple-300">
                    Share your unique link to start receiving messages.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
