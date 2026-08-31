"use client";
import { AuthState, useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const isAuthorized = useAuthStore((state: AuthState) => !!state.accessToken);

  useEffect(() => {
    router.push(isAuthorized ? "/employees" : "/login");
  });
}
