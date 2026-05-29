export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sku?: string;
  slug?: string;
  imageUrl?: string;
  emoji?: string;
  badge?: string;
  rating: number;
  active: boolean;
  featured: boolean;
  category?: string;
  categoryId?: number;
  createdAt?: string;
}

export interface PageResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
