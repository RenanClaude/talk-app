"use client";

import { userAuthSotre } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { User } from "@/types/User";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { PulseLoader } from "react-spinners";
import { LeftSide } from "./leftSide";
import {
  Sheet,
  SheetContent
} from "@/components/ui/sheet";

type PropsMainLayout = {
  user: User | null;
  children: React.ReactNode;
};

export const MainLayout = ({ user, children }: PropsMainLayout) => {
  const auth = userAuthSotre();
  const { showChatsList, setShowChatsList } = useChatStore();

  const [loading, setLoading] = useState<boolean>(true);

  const pathname = usePathname();

  useEffect(() => {
    if (user) auth.setUser(user);
    setLoading(false);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-200 dark:bg-slate-950">
      <Header />
      {loading && (
        <div className="items-center justify-center h-full">
          <PulseLoader color="#493cdd" />
        </div>
      )}

      {!loading && auth.user && !pathname.includes("auth") ? (
        <div>
          <div className="hidden lg:block">
            <LeftSide />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      ) : (
        <div className="flex-1">{children}</div>
      )}

      <Sheet open={showChatsList} onOpenChange={setShowChatsList}>
        <SheetContent className="p-0 bg-slate-100 dark:bg-slate-900">
          <LeftSide variant="mobile" />
        </SheetContent>
      </Sheet>
    </div>
  );
};
