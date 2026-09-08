"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, ChevronRight, LogOut, Users } from "lucide-react";
import { useAuthStore, AuthState, UserProfile } from "@/store/useAuthStore";

const NAV_ITEMS = [
  { href: "/employees", label: "Pracownicy", icon: Users },
  { href: "/holidays", label: "Dni wolne", icon: CalendarDays },
] as const;

const SIDEBAR_FLYOUT_TRIGGER =
  "group w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent data-[state=open]:bg-secondary/80 data-[state=open]:text-secondary-foreground";

const SIDEBAR_FLYOUT_CHEVRON =
  "ml-auto transform text-primary transition-transform duration-200 ease-in-out data-[state=open]:-rotate-180";

const SIDEBAR_FLYOUT_PROFILE_TEXT =
  "text-sm font-semibold text-sidebar-foreground group-data-[state=open]:text-secondary-foreground truncate";

const VIEWPORT_EDGE_MARGIN = 10;
const SIDE_OFFSET = 8;

const navLinkClassName = (isActive: boolean) =>
  `relative z-10 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 ${
    isActive
      ? "text-sidebar-primary"
      : "text-sidebar-foreground hover:bg-black/[0.04] hover:text-sidebar-primary"
  }`;

const getSidebarFlyoutState = (open: boolean) => (open ? "open" : "closed");

interface FlyoutLayout {
  top: number;
  left: number;
}

const computeFlyoutLayout = (
  triggerRect: DOMRect,
  flyoutHeight: number,
  flyoutWidth: number,
  placement: "right" | "left",
): FlyoutLayout => {
  const triggerCenterY = triggerRect.top + triggerRect.height / 2;
  const maxTop = window.innerHeight - VIEWPORT_EDGE_MARGIN - flyoutHeight;
  const minTop = VIEWPORT_EDGE_MARGIN;

  const centeredTop = triggerCenterY - flyoutHeight / 2;
  const top = Math.min(maxTop, Math.max(minTop, centeredTop));
  const left =
    placement === "right"
      ? triggerRect.right + SIDE_OFFSET
      : triggerRect.left - flyoutWidth - SIDE_OFFSET;

  return { top, left };
};

interface SidebarFlyoutTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  open: boolean;
  children: ReactNode;
}

const SidebarFlyoutTrigger = forwardRef<
  HTMLButtonElement,
  SidebarFlyoutTriggerProps
>(function SidebarFlyoutTrigger({ open, children, className, ...props }, ref) {
  const flyoutState = getSidebarFlyoutState(open);

  return (
    <button
      ref={ref}
      type="button"
      data-state={flyoutState}
      aria-expanded={open}
      className={`${SIDEBAR_FLYOUT_TRIGGER} ${className ?? ""}`}
      {...props}
    >
      {children}
      <ChevronRight
        size={14}
        data-state={flyoutState}
        className={SIDEBAR_FLYOUT_CHEVRON}
      />
    </button>
  );
});

function SidebarUserProfile() {
  const user: UserProfile = useAuthStore(
    (state: AuthState) => state.user,
  ) as UserProfile;

  if (!user) return null;

  const { name, surname } = user;

  const initials = `${name[0].toUpperCase()}${surname[0].toUpperCase()}`;
  return (
    <>
      <div
        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <span className="text-xs font-bold text-primary-foreground">
          {initials}
        </span>
      </div>
      <div className="leading-tight min-w-0">
        <div className={SIDEBAR_FLYOUT_PROFILE_TEXT}>{name}</div>
        <div className={SIDEBAR_FLYOUT_PROFILE_TEXT}>{surname}</div>
      </div>
    </>
  );
}

interface AnchoredFlyoutProps {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  title: string;
  placement?: "right" | "left";
  panelClassName?: string;
  children: ReactNode;
}

function AnchoredFlyout({
  open,
  onClose,
  triggerRef,
  title,
  placement = "right",
  panelClassName = "w-52",
  children,
}: AnchoredFlyoutProps) {
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<FlyoutLayout | null>(null);

  const updateLayout = useCallback(() => {
    if (!open || !triggerRef.current || !flyoutRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const flyoutRect = flyoutRef.current.getBoundingClientRect();
    setLayout(
      computeFlyoutLayout(
        triggerRect,
        flyoutRect.height,
        flyoutRect.width,
        placement,
      ),
    );
  }, [open, placement, triggerRef]);

  useLayoutEffect(() => {
    if (!open) return;

    updateLayout();

    const flyoutElement = flyoutRef.current;
    if (!flyoutElement) return;

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(flyoutElement);

    window.addEventListener("resize", updateLayout);
    window.addEventListener("scroll", updateLayout, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", updateLayout, true);
    };
  }, [open, updateLayout]);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (flyoutRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open, triggerRef]);

  if (!open) return null;

  const fallbackTop = VIEWPORT_EDGE_MARGIN;
  const fallbackLeft = 0;

  return createPortal(
    <div
      className="fixed z-50"
      style={{
        top: layout?.top ?? fallbackTop,
        left: layout?.left ?? fallbackLeft,
        visibility: layout ? "visible" : "hidden",
      }}
      role="dialog"
      aria-label={title}
    >
      <div
        ref={flyoutRef}
        className={`rounded-xl border border-border bg-popover p-3 shadow-lg ${panelClassName}`}
      >
        <div className="mb-2 flex items-start justify-between gap-2 px-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

const isNavItemActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [indicator, setIndicator] = useState({
    top: 0,
    height: 0,
    ready: false,
  });

  const logout = useAuthStore((state: AuthState) => state.logout);

  const userTriggerRef = useRef<HTMLButtonElement>(null);
  const navListRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const closeUserMenu = useCallback(() => setUserMenuOpen(false), []);

  const handleUserTriggerClick = () => {
    setUserMenuOpen((current) => !current);
  };

  const handleLogout = () => {
    logout();
    closeUserMenu();
    router.replace("/login");
  };

  const updateIndicator = useCallback(() => {
    const activeIndex = NAV_ITEMS.findIndex((item) =>
      isNavItemActive(pathname, item.href),
    );
    const activeItem = navItemRefs.current[activeIndex];
    const navList = navListRef.current;

    if (!activeItem || !navList) {
      setIndicator((current) => ({ ...current, ready: false }));
      return;
    }

    setIndicator({
      top: activeItem.offsetTop,
      height: activeItem.offsetHeight,
      ready: true,
    });
  }, [pathname]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    const navList = navListRef.current;
    if (!navList) return;

    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(navList);

    return () => resizeObserver.disconnect();
  }, [updateIndicator]);

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col bg-sidebar border-r border-sidebar-border overflow-visible">
      <div className="px-5 pt-6 pb-4 flex justify-center bg-green-500">
        <span className="text-lg font-bold text-destructive-foreground tracking-tight">
          HR Assist
        </span>
      </div>

      <nav className="flex-1 px-3 py-2">
        <div ref={navListRef} className="relative space-y-1">
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 rounded-lg bg-sidebar-accent ${
              indicator.ready
                ? "opacity-100 transition-[transform,height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                : "opacity-0"
            }`}
            style={{
              height: indicator.height,
              transform: `translateY(${indicator.top}px)`,
            }}
          />
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(node) => {
                  navItemRefs.current[index] = node;
                }}
                aria-current={isActive ? "page" : undefined}
                className={navLinkClassName(isActive)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-3 pb-4 overflow-visible">
        <div className="rounded-xl border border-primary">
          <SidebarFlyoutTrigger
            ref={userTriggerRef}
            open={userMenuOpen}
            onClick={handleUserTriggerClick}
            className="rounded-xl"
            aria-label="Opcje użytkownika"
          >
            <SidebarUserProfile />
          </SidebarFlyoutTrigger>
        </div>

        <AnchoredFlyout
          open={userMenuOpen}
          onClose={closeUserMenu}
          triggerRef={userTriggerRef}
          title="Konto"
          placement="right"
        >
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left hover:bg-accent text-foreground"
          >
            <LogOut size={15} />
            Wyloguj
          </button>
        </AnchoredFlyout>
      </div>
    </aside>
  );
};
