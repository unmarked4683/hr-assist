"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ROUTES } from "@/lib/constants/navigation";
import type { Session } from "@/lib/types/auth";
import { getSession } from "@/services/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    void getSession().then((value) => {
      if (!value) {
        router.replace(ROUTES.login);
        return;
      }
      setSession(value);
    });
  }, [router]);

  if (session === undefined) {
    return <LoadingSpinner className="h-screen" />;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
