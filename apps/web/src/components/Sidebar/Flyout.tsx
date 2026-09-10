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
import { ChevronRight } from "lucide-react";

const SIDEBAR_FLYOUT_TRIGGER =
  "group w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent data-[state=open]:bg-secondary/80 data-[state=open]:text-secondary-foreground";

const SIDEBAR_FLYOUT_CHEVRON =
  "ml-auto transform text-primary transition-transform duration-200 ease-in-out data-[state=open]:-rotate-180";

const VIEWPORT_EDGE_MARGIN = 10;
const SIDE_OFFSET = 8;

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

export interface SidebarFlyoutTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  open: boolean;
  children: ReactNode;
}

export const SidebarFlyoutTrigger = forwardRef<
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

interface AnchoredFlyoutProps {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  title: string;
  placement?: "right" | "left";
  panelClassName?: string;
  children: ReactNode;
}

export function AnchoredFlyout({
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

  return createPortal(
    <div
      className="fixed z-50"
      style={{
        top: layout?.top ?? VIEWPORT_EDGE_MARGIN,
        left: layout?.left ?? 0,
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
