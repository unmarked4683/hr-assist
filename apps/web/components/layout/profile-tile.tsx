"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ChevronRight, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDismissable } from "@/lib/hooks/use-dismissable";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types/auth";

interface ProfileTileProps {
  user: User;
  onLogout: () => void | Promise<void>;
}

type MenuAlign = "center" | "bottom";

function getInitials(user: User): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}

export function ProfileTile({ user, onLogout }: ProfileTileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuAlign, setMenuAlign] = useState<MenuAlign>("center");
  const menuRef = useRef<HTMLDivElement>(null);

  const { containerRef, handleTriggerClick } = useDismissable({
    isOpen,
    onClose: () => setIsOpen(false),
    onToggle: () => setIsOpen((prev) => !prev),
  });

  const updateMenuAlign = useCallback(() => {
    const container = containerRef.current;
    const menu = menuRef.current;
    if (!container || !menu) return;

    const containerRect = container.getBoundingClientRect();
    const menuHeight = menu.offsetHeight;
    const viewportHeight = window.innerHeight;
    const containerCenterY = containerRect.top + containerRect.height / 2;
    const overflowsBottom = containerCenterY + menuHeight / 2 > viewportHeight;

    setMenuAlign(overflowsBottom ? "bottom" : "center");
  }, [containerRef]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuAlign("center");
      return;
    }

    updateMenuAlign();

    const menu = menuRef.current;
    const resizeObserver =
      menu &&
      new ResizeObserver(() => {
        updateMenuAlign();
      });
    resizeObserver?.observe(menu);

    window.addEventListener("resize", updateMenuAlign);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateMenuAlign);
    };
  }, [isOpen, updateMenuAlign]);

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} className="relative">
      <button
        type="button"
        onClick={handleTriggerClick}
        className={cn(
          "flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left transition-colors",
          isOpen ? "bg-muted" : "bg-card hover:bg-muted/60",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {getInitials(user)}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {user.firstName} {user.lastName}
        </span>
        <ChevronRight
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div
          ref={menuRef}
          className={cn(
            "absolute left-full z-50 ml-2 w-max min-w-40 rounded-md border bg-popover p-1 shadow-md",
            menuAlign === "center"
              ? "top-1/2 -translate-y-1/2"
              : "bottom-0",
          )}
        >
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => void onLogout()}
          >
            <LogOut className="size-4" />
            Wyloguj się
          </Button>
        </div>
      ) : null}
    </div>
  );
}
