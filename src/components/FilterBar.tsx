import React from 'react';
import { TargetGroup, ProductCategory, SortOption } from '../types';
import { TARGET_GROUPS, PRODUCT_CATEGORIES } from '../constants';
import { Search, ArrowUpDown, X, Layers, Users } from 'lucide-react';

interface FilterBarProps {
  selectedGroup: TargetGroup | 'all';
  onSelectGroup: (group: TargetGroup | 'all') => void;
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  sortBy: SortOption;
  onSelectSort: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedGroup,
  onSelectGroup,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSort,
  searchQuery,
  onSearchChange,
  totalResults,
}) => {
  const hasActiveFilters =
    selectedGroup !== 'all' || selectedCategory !== 'all' || searchQuery.trim().length > 0;

  const resetFilters = () => {
    onSelectGroup('all');
    onSelectCategory('all');
    onSearchChange('');
  };

  return (
    <div id="products" className="py-6 border-b border-stone-200 dark:border-stone-800 space-y-4">
      {/* Top row: Search input + Sort Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم أو الوصف أو السعر..."
            className="w-full pr-10 pl-9 py-2.5 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 dark:focus:ring-amber-400/20 focus:border-amber-700 dark:focus:border-amber-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto">
          <label htmlFor="sort-select" className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>الترتيب:</span>
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="flex-1 sm:flex-initial py-2 px-3 text-xs sm:text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-800 dark:text-stone-200 focus:outline-none focus:border-amber-700 dark:focus:border-amber-400 cursor-pointer"
          >
            <option value="newest">الأحدث أولاً (وقت الإضافة)</option>
            <option value="oldest">الأقدم أولاً</option>
            <option value="price-asc">السعر: من الأقل للأعلى</option>
            <option value="price-desc">السعر: من الأعلى للأقل</option>
          </select>
        </div>
      </div>

      {/* Target Group Segmented Tabs (رجال / نساء / أطفال) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 pl-2 shrink-0 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>الفئة:</span>
          </span>
          <button
            onClick={() => onSelectGroup('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedGroup === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                : 'bg-stone-200/60 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            الكل
          </button>
          {TARGET_GROUPS.map((tg) => (
            <button
              key={tg.id}
              onClick={() => onSelectGroup(tg.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedGroup === tg.id
                  ? 'bg-amber-800 text-white dark:bg-amber-400 dark:text-amber-950 font-semibold shadow-xs'
                  : 'bg-stone-200/60 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {tg.label}
            </button>
          ))}
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <span>
            {totalResults === 1
              ? 'منتج واحد متاح'
              : totalResults === 2
              ? 'منتجان متاحان'
              : totalResults > 2 && totalResults < 11
              ? `${totalResults} منتجات متاحة`
              : `${totalResults} منتج متاح`}
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Type Categories (أقمصة / سراويل / أحذية / قبعات / عطور / أخرى) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-medium text-stone-500 dark:text-stone-400 pl-2 shrink-0 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>النوع:</span>
        </span>
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'border border-amber-800 dark:border-amber-400 text-amber-900 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20 font-medium'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-transparent'
          }`}
        >
          جميع الأنواع
        </button>
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'border border-amber-800 dark:border-amber-400 text-amber-900 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20 font-medium'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-transparent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};
