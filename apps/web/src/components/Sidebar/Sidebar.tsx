"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiService } from "@/services/api.service";
import { SidebarFlyoutTrigger, AnchoredFlyout } from "./Flyout";
import { UserProfile } from "./UserProfile";
import { LogoutBtn } from "./LogoutBtn";
import { Header } from "./Header";
import { Nav } from "./Nav";

export const Sidebar = () => {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userTriggerRef = useRef<HTMLButtonElement>(null);

  const closeUserMenu = useCallback(() => setUserMenuOpen(false), []);

  const handleLogout = useCallback(() => {
    ApiService.logout();
    closeUserMenu();
    router.replace("/login");
  }, [closeUserMenu, router]);

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col bg-sidebar border-r border-sidebar-border overflow-visible">
      <Header />
      <Nav />

      <div className="px-3 pb-4 overflow-visible">
        <div className="rounded-xl border border-primary">
          <SidebarFlyoutTrigger
            ref={userTriggerRef}
            open={userMenuOpen}
            onClick={() => setUserMenuOpen((current) => !current)}
            className="rounded-xl"
            aria-label="Opcje użytkownika"
          >
            <UserProfile />
          </SidebarFlyoutTrigger>
        </div>

        <AnchoredFlyout
          open={userMenuOpen}
          onClose={closeUserMenu}
          triggerRef={userTriggerRef}
          title="Konto"
          placement="right"
        >
          <LogoutBtn onLogoutBtnClick={handleLogout} />
        </AnchoredFlyout>
      </div>
    </aside>
  );
};
