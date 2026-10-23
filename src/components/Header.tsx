import React from 'react';
import { Sun, Moon, Shield, ShieldCheck, LogOut, Sparkles } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isAdmin: boolean;
  onOpenAdminAuth: () => void;
  onOpenAddModal: () => void;
  onLogoutAdmin: () => void;
  totalProducts: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  isAdmin,
  onOpenAdminAuth,
  onOpenAddModal,
  onLogoutAdmin,
  totalProducts,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="group flex items-center gap-2.5 text-stone-900 dark:text-stone-100">
              <span className="w-9 h-9 rounded-full bg-amber-900/10 dark:bg-amber-400/10 border border-amber-800/20 dark:border-amber-400/20 flex items-center justify-center text-amber-900 dark:text-amber-300 font-classic text-xl font-bold">
                م
              </span>
              <div className="flex flex-col">
                <span className="font-classic text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                  منارة المسلم
                </span>
                <span className="text-[11px] font-sans tracking-widest text-stone-600 dark:text-stone-400">
                  متجر الألبسة الكلاسيكية
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 dark:text-stone-300">
            <a
              href="#products"
              className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              المعروضات {totalProducts > 0 && `(${totalProducts})`}
            </a>
          </nav>

          {/* Zone 3: Actions (Theme Toggle + Admin) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 sm:px-3 sm:py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
              title={darkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
              aria-label="تبديل وضع الإضاءة"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
              <span className="hidden sm:inline">{darkMode ? 'فاتح' : 'داكن'}</span>
            </button>

            {/* Admin Button */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={onOpenAddModal}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-amber-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ إضافة منتج</span>
                </button>
                <button
                  onClick={onLogoutAdmin}
                  className="p-2 text-stone-500 hover:text-rose-600 dark:text-stone-400 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="الخروج من وضع المسؤول"
                  aria-label="الخروج من وضع المسؤول"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminAuth}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 bg-stone-200/80 hover:bg-stone-300/80 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="دخول المسؤول لإدارة المنتجات"
              >
                <Shield className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Mode Floating Banner if logged in */}
      {isAdmin && (
        <div className="bg-amber-900/10 dark:bg-amber-950/40 border-t border-amber-800/20 dark:border-amber-700/30 py-1.5 px-4 text-xs text-amber-900 dark:text-amber-300 text-center font-medium flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>أنت الآن في وضع المسؤول (Admin) — يمكنك إضافة وتعديل وحذف المنتجات بسهولة</span>
        </div>
      )}
    </header>
  );
};
