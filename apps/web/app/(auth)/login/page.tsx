"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { ROUTES } from "@/lib/constants/navigation";
import { login, persistSession } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.classList.add("allow-auth-scroll");
    return () => document.body.classList.remove("allow-auth-scroll");
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({ email, password });
      persistSession(response.session);
      router.replace(ROUTES.employees);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Logowanie nie powiodło się",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-muted/20 p-4">
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg border bg-card p-8 shadow-sm [--login-body-h:14rem] [--login-icon-size:calc(var(--login-body-h)/1.618)]"
      >
        <UserCircle
          className="size-(--login-icon-size) text-muted-foreground"
          aria-hidden
        />
        <div className="w-full space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10 px-3 py-2.5"
            required
          />
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="password">Hasło</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 px-3 py-2.5 pr-10"
              required
            />
            <div className="absolute inset-y-0 right-1 flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground active:translate-y-0!"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              >
                <span className="inline-flex size-4 items-center justify-center">
                  {showPassword ? (
                    <Eye className="size-4" aria-hidden />
                  ) : (
                    <EyeOff className="size-4" aria-hidden />
                  )}
                </span>
              </Button>
            </div>
          </div>
        </div>
        {error ? <ErrorMessage message={error} className="w-full" /> : null}
        <Button
          type="submit"
          className="h-10 w-full px-3 active:translate-y-0!"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </form>
    </div>
  );
}
