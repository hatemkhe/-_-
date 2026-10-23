/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Product, TargetGroup, ProductCategory, SortOption } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { AdminModal } from './components/AdminModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Footer } from './components/Footer';
import { ShoppingBag, PlusCircle, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Theme state (Dark/Light mode)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dar_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Admin state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dar_admin_auth') === 'true';
    }
    return false;
  });

  // Modals state
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Products & Loading state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters state
  const [selectedGroup, setSelectedGroup] = useState<TargetGroup | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dar_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dar_theme', 'light');
    }
  }, [darkMode]);

  // Toast auto-hide
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch products from server (persisted cross-device)
  const loadProducts = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('فشل تحميل المنتجات من الخادم');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setFetchError(err.message || 'حدث خطأ أثناء تحميل المعروضات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Check for direct product link from URL query params (e.g. ?product=prod_123)
  useEffect(() => {
    if (products.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product');
      if (prodId) {
        const found = products.find((p) => p.id === prodId);
        if (found) {
          setViewingProduct(found);
        }
      }
    }
  }, [products]);

  const handleOpenProduct = (p: Product) => {
    setViewingProduct(p);
    const url = new URL(window.location.href);
    url.searchParams.set('product', p.id);
    window.history.pushState(null, '', url.toString());
  };

  const handleCloseProduct = () => {
    setViewingProduct(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
  };

  // Logout admin
  const handleLogoutAdmin = () => {
    localStorage.removeItem('dar_admin_auth');
    setIsAdmin(false);
    showToast('تم الخروج من وضع المسؤول والعودة إلى وضع الزائر');
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (productData: Partial<Product>): Promise<boolean> => {
    try {
      if (productToEdit) {
        // Edit existing product
        const res = await fetch(`/api/products/${productToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });

        if (!res.ok) return false;
        const updated = await res.json();

        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast(`تم تعديل منتج «${updated.title}» بنجاح وتحديثه لجميع الزوار`);
        return true;
      } else {
        // Add new product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });

        if (!res.ok) return false;
        const created = await res.json();

        // Place at top (newest)
        setProducts((prev) => [created, ...prev]);
        showToast(`تم نشر منتج «${created.title}» بنجاح ويظهر الآن لجميع الزوار!`);
        return true;
      }
    } catch (err) {
      console.error('Error saving product:', err);
      return false;
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) return false;

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast('تم حذف المنتج بنجاح من المتجر لجميع الأجهزة');
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      return false;
    }
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Target Group Filter (رجال / نساء / أطفال)
    if (selectedGroup !== 'all') {
      result = result.filter((p) => p.targetGroup === selectedGroup);
    }

    // 2. Category Filter (أقمصة / سراويل / أحذية / قبعات / عطور / أخرى)
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.price.toString().includes(q)
      );
    }

    // 4. Sorting (default: newest first based on createdAt)
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      return 0;
    });

    return result;
  }, [products, selectedGroup, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-amber-800/20 selection:text-amber-900 dark:selection:bg-amber-400/20 dark:selection:text-amber-200 transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 left-5 sm:left-auto z-50 max-w-md bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-amber-500/30 text-xs sm:text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span className="flex-1 font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isAdmin={isAdmin}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onOpenAddModal={() => {
          setProductToEdit(null);
          setIsAdminFormOpen(true);
        }}
        onLogoutAdmin={handleLogoutAdmin}
        totalProducts={products.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero totalProducts={products.length} />

        {/* Store Catalog Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter & Sorting Controls */}
          {products.length > 0 && (
            <FilterBar
              selectedGroup={selectedGroup}
              onSelectGroup={setSelectedGroup}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              sortBy={sortBy}
              onSelectSort={setSortBy}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalResults={filteredProducts.length}
            />
          )}

          {/* Error Banner */}
          {fetchError && (
            <div className="my-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{fetchError}</span>
              </div>
              <button
                onClick={loadProducts}
                className="px-3 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-4/3 bg-stone-200 dark:bg-stone-800" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/3" />
                    <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
                    <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
                    <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-1/4 pt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Product Grid */}
          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdmin={isAdmin}
                  onEdit={(p) => {
                    setProductToEdit(p);
                    setIsAdminFormOpen(true);
                  }}
                  onDelete={(p) => {
                    setProductToDelete(p);
                  }}
                  onView={handleOpenProduct}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="py-20 text-center max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-900/10 dark:bg-amber-400/10 border border-amber-800/20 dark:border-amber-400/20 flex items-center justify-center text-amber-900 dark:text-amber-300">
                <ShoppingBag className="w-8 h-8 opacity-70" />
              </div>
              <h3 className="font-classic text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                {products.length === 0 ? 'لا توجد منتجات معروضة حالياً' : 'لا توجد منتجات تطابق هذا البحث'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
                {products.length === 0
                  ? isAdmin
                    ? 'المتجر جاهز الآن! يمكنك الضغط على الزر أدناه لإضافة أول منتج وتصنيفه.'
                    : 'سيقوم متجر منارة المسلم بنشر المعروضات قريباً.'
                  : 'جرب تغيير فلاتر البحث أو الفئات المختارة للوصول للمنتجات.'}
              </p>
              {isAdmin ? (
                <button
                  onClick={() => {
                    setProductToEdit(null);
                    setIsAdminFormOpen(true);
                  }}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 rounded-lg shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ إضافة أول منتج الآن</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAdminAuthOpen(true)}
                  className="px-4 py-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-lg transition-colors cursor-pointer"
                >
                  دخول صاحب المتجر (Admin)
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductModal
        product={viewingProduct}
        onClose={handleCloseProduct}
        isAdmin={isAdmin}
        onEdit={(p) => {
          setViewingProduct(null);
          setProductToEdit(p);
          setIsAdminFormOpen(true);
        }}
        onDelete={(p) => {
          setViewingProduct(null);
          setProductToDelete(p);
        }}
      />

      {/* Admin Auth Modal */}
      <AdminLoginModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          showToast('مرحباً بك! تم تفعيل وضع المسؤول بنجاح');
        }}
      />

      {/* Admin Add / Edit Modal */}
      <AdminModal
        isOpen={isAdminFormOpen}
        onClose={() => {
          setIsAdminFormOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSaveProduct={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        product={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}
