"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "danger";
  disableClose?: boolean;
  showActions?: boolean;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  disableClose = false,
  showActions = true,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={disableClose ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xl">
        <h3 className="mb-2 text-xl font-semibold text-[var(--admin-text)]">{title}</h3>
        <p className="mb-6 text-sm text-[var(--admin-text-muted)]">{message}</p>

        {isLoading && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-[var(--admin-bg)] px-4 py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-[var(--admin-text)]">Synchronizing...</span>
          </div>
        )}

        {showActions && (
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={disableClose || isLoading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                confirmColor === "danger"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-primary hover:bg-primary-strong"
              }`}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

