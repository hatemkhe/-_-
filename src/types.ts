export type TargetGroup = 'men' | 'women' | 'kids';

export type ProductCategory = 'shirts' | 'pants' | 'shoes' | 'hats' | 'perfumes' | 'other';

export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  description?: string;
  image: string;
  targetGroup: TargetGroup;
  category: ProductCategory;
  externalLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  currency: string;
  adminPin: string;
  phoneNumber?: string;
  address?: string;
}

export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc';
