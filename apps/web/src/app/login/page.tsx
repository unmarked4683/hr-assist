"use client";
import { apiRequest } from "@/services/api-request";
import { UserProfile, useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Mail, User } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { useState, type SyntheticEvent } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const [emailTouched, setEmailTouched] = useState<boolean>(false);
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false);

  const isEmailValid: boolean = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailError = emailTouched && (email.length === 0 || !isEmailValid);
  const showPasswordError: boolean = passwordTouched && password.length === 0;

  const loginFn = async () => {
    const data = await apiRequest<UserProfile>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return data;
  };

  const loginMutation = useMutation({
    mutationFn: loginFn,
    onSuccess: (user) => {
      setUser(user as UserProfile);
      router.replace("/employees" as Route);
    },
    onError: ({ message }: Error) => {
      toast.error(message);
    },
  });

  const handleLogin = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password || !isEmailValid) {
      toast.error("Wprowadź dane logowania");
      return;
    }

    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full bg-background">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl shadow-xl shadow-foreground/5 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full border border-border bg-muted flex items-center justify-center mb-4">
              <User size={36} className="text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              HR Assist
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Zaloguj się do swojego konta
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className={`w-full h-11 pl-10 pr-4 rounded-lg border bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:ring-2 transition ${
                  showEmailError
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-input hover:border-muted-foreground/40 focus:border-primary focus:ring-ring/20"
                }`}
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                className={`w-full h-11 pl-4 pr-11 rounded-lg border bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:ring-2 transition ${
                  showPasswordError
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-input hover:border-muted-foreground/40 focus:border-primary focus:ring-ring/20"
                }`}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Pokaż hasło"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={
                !email || !password || !isEmailValid || loginMutation.isPending
              }
              className="mt-2 h-11 w-full rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Zaloguj</span>
              {loginMutation.isPending && (
                <Loader2 size={16} className="animate-spin" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
