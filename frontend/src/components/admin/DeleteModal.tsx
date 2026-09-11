import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { scaleIn } from '../../utils/animations';

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  itemName?: string;
  itemType?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  title,
  itemName,
  itemType = 'project',
  isDeleting = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isDeleting ? undefined : onCancel}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl z-10"
          >
            {/* Close Button */}
            {!isDeleting && (
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Warning Icon */}
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white tracking-tight mb-2">
              {title}
            </h3>

            <p className="text-sm text-slate-500 dark:text-neutral-400 mb-6 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              {itemName ? (
                <span className="text-slate-900 dark:text-white font-semibold underline decoration-slate-300 dark:decoration-neutral-700">
                  "{itemName}"
                </span>
              ) : (
                `this ${itemType}`
              )}
              ? This action will remove the record and any associated Cloudinary assets and cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
