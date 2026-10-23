import React, { useState } from 'react';
import { Product } from '../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirm: (productId: string) => Promise<boolean>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  product,
  onClose,
  onConfirm,
}) => {
  const [deleting, setDeleting] = useState(false);

  if (!product) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const success = await onConfirm(product.id);
      if (success) {
        onClose();
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden p-6">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-rose-600 mb-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-950/50 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-classic text-xl font-bold text-stone-900 dark:text-stone-100">
              تأكيد حذف المنتج
            </h3>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              إجراء لا يمكن التراجع عنه
            </span>
          </div>
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-300 mb-6 leading-relaxed">
          هل أنت متأكد من رغبتك في حذف المنتج: <strong className="text-stone-900 dark:text-stone-100">«{product.title}»</strong> نهائياً من المتجر؟
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? 'جارٍ الحذف...' : 'نعم، حذف نهائي'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
