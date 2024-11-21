"use client";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ThemeProvider } from "next-themes";
import { Children, useEffect } from "react";
import { io } from "socket.io-client";
import { Toaster } from "../ui/sonner";

// Initializer Socket.io
export const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL as string)

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Set locale to pt-br
    dayjs.locale("pt-br");
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

      {children}
      <ProgressBar height="4px" color="#493cdd" shallowRouting />
      <Toaster />
      
    </ThemeProvider>
  )
}