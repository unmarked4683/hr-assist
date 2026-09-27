import { Button } from "../ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTitle,
} from "../ui/dialog";

interface ConfirmModalProps {
  isConfirmOpen: boolean;
  setIsConfirmOpen: (isOpen: boolean) => void;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}
export function ConfirmModal({
  isConfirmOpen,
  setIsConfirmOpen,
  message,
  confirmLabel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <DialogContent className="sm:max-w-100 bg-white text-zinc-900 border-zinc-200 shadow-lg">
        <DialogHeader>
          <DialogTitle>Potwierdzenie</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-zinc-600 py-2">{message}</p>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsConfirmOpen(false)}
            className="border-zinc-300 text-zinc-700 bg-transparent hover:bg-zinc-100"
          >
            Nie
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
