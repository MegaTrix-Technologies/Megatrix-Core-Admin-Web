import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-mx-surface border border-mx-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-mx-subtle hover:text-neutral-200 transition-colors p-1"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl flex-shrink-0 ${
              danger ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'
            }`}
          >
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-mx-subtle mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-mx-border">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-mx-elevated hover:bg-mx-border2 text-neutral-300 transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md ${
              danger
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                : 'bg-white hover:bg-white/90 text-black shadow-white/5'
            } disabled:opacity-50`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
