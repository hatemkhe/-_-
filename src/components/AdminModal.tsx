import React, { useState, useEffect, useRef } from 'react';
import { Product, TargetGroup, ProductCategory } from '../types';
import { TARGET_GROUPS, PRODUCT_CATEGORIES, PRESET_IMAGES } from '../constants';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Sparkles, AlertCircle, Check } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
  onSaveProduct: (productData: Partial<Product>) => Promise<boolean>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSaveProduct,
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState('د.ج');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [targetGroup, setTargetGroup] = useState<TargetGroup>('men');
  const [category, setCategory] = useState<ProductCategory>('shirts');
  const [externalLink, setExternalLink] = useState('');

  // Image input tab: 'upload' | 'preset' | 'url'
  const [imageTab, setImageTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens or productToEdit changes
  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title || '');
      setPrice(productToEdit.price !== undefined ? String(productToEdit.price) : '');
      setCurrency(productToEdit.currency || 'د.ج');
      setDescription(productToEdit.description || '');
      setImage(productToEdit.image || '');
      setTargetGroup(productToEdit.targetGroup || 'men');
      setCategory(productToEdit.category || 'shirts');
      setExternalLink(productToEdit.externalLink || '');
      setImageTab(productToEdit.image.startsWith('/uploads') ? 'upload' : 'preset');
    } else {
      // Default initial form state for a new product
      setTitle('');
      setPrice('');
      setCurrency('د.ج');
      setDescription('');
      setImage('');
      setTargetGroup('men');
      setCategory('shirts');
      setExternalLink('');
      setImageTab('upload');
    }
    setError(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local file / camera upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      setError('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 15 ميغابايت');
      return;
    }

    setUploadLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64,
              filename: file.name,
            }),
          });
          const data = await res.json();
          if (res.ok && data.url) {
            setImage(data.url);
          } else {
            // Fallback to direct base64 if server upload has issue
            setImage(base64);
          }
        } catch {
          setImage(base64);
        } finally {
          setUploadLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setError('تعذر قراءة ملف الصورة');
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('يرجى كتابة اسم المنتج');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setError('يرجى تحديد سعر صالح للمنتج');
      return;
    }

    if (!image.trim()) {
      setError('يرجى إضافة صورة للمنتج');
      return;
    }

    setSaving(true);
    try {
      const success = await onSaveProduct({
        title: title.trim(),
        price: numericPrice,
        currency,
        description: description.trim(), // Optional
        image: image.trim(),
        targetGroup,
        category,
        externalLink: externalLink.trim(), // Optional
      });

      if (success) {
        onClose();
      } else {
        setError('تعذر حفظ بيانات المنتج، يرجى المحاولة ثانية');
      }
    } catch {
      setError('حدث خطأ غير متوقع أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 transition-opacity">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 bg-stone-50/50 dark:bg-stone-950/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-800 dark:text-amber-400" />
            <h2 className="font-classic text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              {productToEdit ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للمتجر'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs sm:text-sm text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              اسم المنتج <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-700 dark:focus:border-amber-400 transition-all"
            />
          </div>

          {/* 2. Price & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                السعر <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-700 dark:focus:border-amber-400 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                العملة
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-700 dark:focus:border-amber-400 cursor-pointer"
              >
                <option value="د.ج">د.ج (دينار)</option>
                <option value="ر.س">ر.س (ريال)</option>
                <option value="$">$ (دولار)</option>
                <option value="€">€ (يورو)</option>
                <option value="د.إ">د.إ (درهم)</option>
              </select>
            </div>
          </div>

          {/* 3. Categorization (Target Group & Type) */}
          <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-950/60 rounded-xl border border-stone-200 dark:border-stone-800">
            {/* Target Group */}
            <div>
              <span className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                الفئة المستهدفة (رجال / نساء / أطفال):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {TARGET_GROUPS.map((tg) => (
                  <button
                    key={tg.id}
                    type="button"
                    onClick={() => setTargetGroup(tg.id)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      targetGroup === tg.id
                        ? 'bg-amber-800 text-white border-amber-800 dark:bg-amber-400 dark:text-amber-950 dark:border-amber-400 font-bold shadow-xs'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                    }`}
                  >
                    {targetGroup === tg.id && <Check className="w-3 h-3" />}
                    <span>{tg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Type / Category */}
            <div>
              <span className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                نوع المنتج (أقمصة / سراويل / أحذية / قبعات / عطور / أخرى):
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      category === cat.id
                        ? 'bg-amber-800 text-white border-amber-800 dark:bg-amber-400 dark:text-amber-950 dark:border-amber-400 font-bold shadow-xs'
                        : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                    }`}
                  >
                    {category === cat.id && <Check className="w-2.5 h-2.5" />}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Product Image Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                صورة المنتج <span className="text-rose-500">*</span>
              </label>
              {/* Image Mode Tabs */}
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    imageTab === 'upload'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-medium shadow-xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>رفع من الجهاز</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('preset')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    imageTab === 'preset'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-medium shadow-xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>نماذج جاهزة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    imageTab === 'url'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-medium shadow-xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>رابط URL</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Upload from Phone / Camera / Computer */}
            {imageTab === 'upload' && (
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-700 dark:hover:border-amber-400 rounded-xl p-5 text-center cursor-pointer bg-stone-50/50 dark:bg-stone-950/40 transition-colors"
                >
                  <Upload className="w-7 h-7 mx-auto text-amber-800 dark:text-amber-400 mb-2 opacity-80" />
                  <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 mb-1">
                    {uploadLoading ? 'جارٍ رفع ومعالجة الصورة...' : 'اضغط لاختيار صورة من الكاميرا أو ألبوم الهاتف'}
                  </p>
                  <span className="text-[11px] text-stone-600 dark:text-stone-400">
                    يدعم JPG و PNG و WEBP حتى 15 ميغابايت
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: Pre-curated Luxury Stock Assets */}
            {imageTab === 'preset' && (
              <div className="grid grid-cols-5 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      image === preset.url
                        ? 'border-amber-700 dark:border-amber-400 ring-2 ring-amber-800/30'
                        : 'border-transparent hover:border-stone-400'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-stone-950/70 py-0.5 text-[9px] text-white text-center truncate px-1">
                      {preset.name}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Tab 3: Direct URL */}
            {imageTab === 'url' && (
              <div>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-700 dark:focus:border-amber-400 font-mono text-xs"
                />
              </div>
            )}

            {/* Image Preview Thumbnail */}
            {image && (
              <div className="mt-3 flex items-center gap-3 p-2 bg-stone-100 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700">
                <div className="w-14 h-14 rounded-md overflow-hidden bg-stone-200 shrink-0">
                  <img
                    src={image}
                    alt="معاينة الصورة"
                    className="w-full h-full object-cover"
                    onError={() => setError('تعذر تحميل الصورة من المسار المحدد')}
                  />
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-300 flex-1 truncate">
                  <div className="font-semibold text-stone-800 dark:text-stone-100">تم اختيار الصورة بنجاح</div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400 truncate">{image}</div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Description (Explicitly Optional as requested) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                وصف المنتج
              </label>
              <span className="text-[11px] font-medium text-amber-900 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/20 dark:border-amber-400/20">
                اختياري (يمكنك النشر بدون وصف)
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-700 dark:focus:border-amber-400 transition-all leading-relaxed"
            />
          </div>

          {/* 6. External Link (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                رابط خارجي للمنتج
              </label>
              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                اختياري (رابط شراء أو صفحة تواصل)
              </span>
            </div>
            <input
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-700 dark:focus:border-amber-400 font-mono text-xs"
            />
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || uploadLoading}
            className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {saving ? (
              <span>جارٍ الحفظ والمزامنة...</span>
            ) : (
              <span>{productToEdit ? 'حفظ التعديلات' : 'نشر المنتج للجميع'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
