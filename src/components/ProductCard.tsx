import React, { useState } from 'react';
import { Product } from '../types';
import { TARGET_GROUPS, PRODUCT_CATEGORIES, formatTimeAgo } from '../constants';
import { Edit2, Trash2, Clock, Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAdmin,
  onEdit,
  onDelete,
  onView,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const groupLabel = TARGET_GROUPS.find((g) => g.id === product.targetGroup)?.label || 'الكل';
  const categoryLabel = PRODUCT_CATEGORIES.find((c) => c.id === product.category)?.label || 'أخرى';
  const timeAgo = formatTimeAgo(product.createdAt);

  return (
    <article className="group relative flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden hover:border-amber-800/40 dark:hover:border-amber-400/40 hover:shadow-md transition-all duration-200">
      {/* Product Image Slot */}
      <div
        onClick={() => onView(product)}
        className="relative aspect-4/3 w-full bg-stone-100 dark:bg-stone-950 overflow-hidden cursor-pointer"
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800 animate-pulse flex items-center justify-center">
            <span className="text-xs text-stone-400 font-sans">جارٍ التحميل...</span>
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-stone-100 dark:bg-stone-800 text-stone-400 text-center">
            <ShoppingBag className="w-8 h-8 mb-2 opacity-50 text-amber-700" />
            <span className="text-xs font-medium">{product.title}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5" />
            <span>عرض التفاصيل</span>
          </span>
        </div>

        {/* Admin Quick Action Floating Bar on Card Image */}
        {isAdmin && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              className="p-2 rounded-lg bg-white/95 dark:bg-stone-900/95 text-stone-700 dark:text-stone-200 hover:text-amber-700 dark:hover:text-amber-400 shadow-sm border border-stone-200/80 dark:border-stone-700/80 transition-colors cursor-pointer"
              title="تعديل هذا المنتج"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product);
              }}
              className="p-2 rounded-lg bg-white/95 dark:bg-stone-900/95 text-stone-700 dark:text-stone-200 hover:text-rose-600 dark:hover:text-rose-400 shadow-sm border border-stone-200/80 dark:border-stone-700/80 transition-colors cursor-pointer"
              title="حذف هذا المنتج"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Zero-Pill Metadata Line (Clean unboxed text with typographic separators) */}
        <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 mb-2">
          <span className="font-medium text-amber-900 dark:text-amber-400">{groupLabel}</span>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
          <span>{categoryLabel}</span>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{timeAgo}</span>
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onView(product)}
          className="font-classic text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mb-2 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
        >
          {product.title}
        </h3>

        {/* Optional Description (only renders if provided) */}
        {product.description ? (
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-4 flex-1">
            {product.description}
          </p>
        ) : (
          <div className="flex-1 mb-4" />
        )}

        {/* Bottom Price & Action Row */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2 mt-auto">
          {/* Price with Tabular Numerals */}
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
              {Number(product.price).toLocaleString('ar-DZ')}
            </span>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              {product.currency || 'د.ج'}
            </span>
          </div>

          {/* Quick CTA */}
          <button
            onClick={() => onView(product)}
            className="text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>التفاصيل</span>
            <span aria-hidden="true">←</span>
          </button>
        </div>
      </div>
    </article>
  );
};
