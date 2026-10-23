import React, { useState } from 'react';
import { Product } from '../types';
import { TARGET_GROUPS, PRODUCT_CATEGORIES, formatTimeAgo } from '../constants';
import { X, Clock, Share2, Edit2, Trash2, Link2, Check, ExternalLink } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const groupLabel = TARGET_GROUPS.find((g) => g.id === product.targetGroup)?.label || 'الكل';
  const categoryLabel = PRODUCT_CATEGORIES.find((c) => c.id === product.category)?.label || 'أخرى';
  const timeAgo = formatTimeAgo(product.createdAt);

  const directProductUrl = `${window.location.origin}/?product=${product.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directProductUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `${product.title} - ${product.price} ${product.currency}`,
          url: directProductUrl,
        });
      } catch {
        // user dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 transition-opacity">
      <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-10 p-2 rounded-full bg-white/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white shadow-sm transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 aspect-4/3 md:aspect-auto bg-stone-100 dark:bg-stone-950 relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 mb-3">
            <span className="font-semibold text-amber-800 dark:text-amber-400">{groupLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>أضيف {timeAgo}</span>
            </span>
          </div>

          {/* Title */}
          <h2 className="font-classic text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4 leading-snug">
            {product.title}
          </h2>

          {/* Price */}
          <div className="mb-6 pb-4 border-b border-stone-200 dark:border-stone-800 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
              {Number(product.price).toLocaleString('ar-DZ')}
            </span>
            <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
              {product.currency}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6 flex-1">
            <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
              تفاصيل ومواصفات المنتج:
            </h4>
            {product.description ? (
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-body whitespace-pre-line">
                {product.description}
              </p>
            ) : (
              <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                لم تتم إضافة وصف تفصيلي لهذا المنتج. للمزيد من المعلومات أو المقاسات المتاحة، يرجى التواصل معنا مباشرة.
              </p>
            )}
          </div>

          {/* Optional External Link */}
          {product.externalLink && (
            <div className="mb-6">
              <a
                href={product.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-400 hover:underline bg-amber-50 dark:bg-amber-950/40 px-3 py-2 rounded-lg border border-amber-800/20 dark:border-amber-400/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>زيارة الرابط المرفق للمنتج</span>
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 mt-auto">
            <div className="flex items-center gap-2">
              {/* Copy Direct Link Button */}
              <button
                onClick={handleCopyLink}
                className="flex-1 py-3 px-4 text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                title="نسخ الرابط المباشر لفتح هذا المنتج تحديداً للزبون"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Link2 className="w-4 h-4" />}
                <span>{copied ? 'تم نسخ الرابط المباشر!' : 'نسخ رابط المنتج'}</span>
              </button>

              <button
                onClick={handleShare}
                className="py-3 px-4 text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm"
                title="مشاركة المنتج"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">مشاركة</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(product);
                    }}
                    className="p-3 text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
                    title="تعديل هذا المنتج"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onDelete(product);
                    }}
                    className="p-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                    title="حذف هذا المنتج"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
