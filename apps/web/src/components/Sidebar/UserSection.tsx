import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiService } from "@/services/api.service";
import { SidebarFlyoutTrigger, AnchoredFlyout } from "./Flyout";
import { UserProfile } from "./UserProfile";
import { LogoutBtn } from "./LogoutBtn";
import { toast } from "sonner";

export function UserSection() {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userTriggerRef = useRef<HTMLButtonElement>(null);

  const closeUserMenu = useCallback(() => setUserMenuOpen(false), []);

  const logoutMutation = useMutation({
    mutationFn: async () => await ApiService.logout(),
    onSuccess: () => {
      router.replace("/login");
    },
    onError: ({ message }: Error) => {
      toast.error(message);
    },
    onSettled: () => {
      closeUserMenu();
    },
  });

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return (
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
  );
}
