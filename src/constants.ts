import { TargetGroup, ProductCategory } from './types';

export const TARGET_GROUPS: { id: TargetGroup; label: string }[] = [
  { id: 'men', label: 'رجال' },
  { id: 'women', label: 'نساء' },
  { id: 'kids', label: 'أطفال' },
];

export const PRODUCT_CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'shirts', label: 'أقمصة' },
  { id: 'pants', label: 'سراويل' },
  { id: 'shoes', label: 'أحذية' },
  { id: 'hats', label: 'قبعات' },
  { id: 'perfumes', label: 'عطور' },
  { id: 'other', label: 'أخرى' },
];

export const PRESET_IMAGES = [
  {
    name: 'قميص كتان بيج',
    url: '/src/assets/images/clothing_mens_shirt_1792765146572.jpg',
    category: 'shirts',
  },
  {
    name: 'معطف صوف الجمل',
    url: '/src/assets/images/clothing_womens_coat_1792765148404.jpg',
    category: 'other',
  },
  {
    name: 'حذاء كلاسيكي بني',
    url: '/src/assets/images/clothing_classic_shoes_1792765148143.jpg',
    category: 'shoes',
  },
  {
    name: 'عطر أرورا الملكي',
    url: '/src/assets/images/clothing_luxury_perfume_1792765147925.jpg',
    category: 'perfumes',
  },
  {
    name: 'قبعة فيدورا صوف',
    url: '/src/assets/images/clothing_classic_hat_1792765148586.jpg',
    category: 'hats',
  },
];

export function formatTimeAgo(isoString: string): string {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days === 1) return 'أمس';
    if (days < 30) return `منذ ${days} يوم`;
    return new Date(isoString).toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'مؤخراً';
  }
}
