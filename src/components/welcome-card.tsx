"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/hooks/useAuthStore";
import { PersonIcon, ChatBubbleIcon, LockClosedIcon } from "@radix-ui/react-icons";

export default function WelcomeCard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChatBubbleIcon className="w-5 h-5" />
            Welcome back, {user?.username}!
          </CardTitle>
          <CardDescription>
            Your chats are automatically saved and synced across devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Logged in and synced
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Chat history saved to your account
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Access from any device
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChatBubbleIcon className="w-5 h-5" />
          Welcome to Ollama UI
        </CardTitle>
        <CardDescription>
          Start chatting immediately or create an account to save your conversations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <ChatBubbleIcon className="w-4 h-4 mt-0.5 text-blue-500" />
            <div>
              <p className="font-medium">Start Chatting Now</p>
              <p className="text-muted-foreground text-xs">
                No account needed - start a conversation immediately
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <PersonIcon className="w-4 h-4 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium">Create Account (Optional)</p>
              <p className="text-muted-foreground text-xs">
                Save your chat history and access from any device
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <LockClosedIcon className="w-4 h-4 mt-0.5 text-purple-500" />
            <div>
              <p className="font-medium">Secure & Private</p>
              <p className="text-muted-foreground text-xs">
                Your conversations are encrypted and private
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Button 
            onClick={() => router.push('/auth')} 
            className="w-full"
          >
            Sign In / Create Account
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Or continue as guest - you can always sign up later
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
