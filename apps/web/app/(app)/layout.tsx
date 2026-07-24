"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Aside } from "@/components/layout/aside";
import { AppKeyboardProvider } from "@/components/layout/app-keyboard-provider";
import { AuthGuard } from "@/components/layout/auth-guard";
import { MainStage } from "@/components/layout/main-stage";
import { ProfileTile } from "@/components/layout/profile-tile";
import { ROUTES } from "@/lib/constants/navigation";
import type { User } from "@/lib/types/auth";
import { getSession, logout, persistSession } from "@/services/auth";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    void getSession().then((session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    persistSession(null);
    router.replace(ROUTES.login);
  };

  return (
    <AuthGuard>
      <AppKeyboardProvider>
        <div className="app-shell">
          <Aside footer={user ? <ProfileTile user={user} onLogout={handleLogout} /> : null} />
          <MainStage>{children}</MainStage>
        </div>
      </AppKeyboardProvider>
    </AuthGuard>
  );
}
