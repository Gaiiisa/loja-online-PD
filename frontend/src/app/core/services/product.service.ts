import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'app/core/services/api.service';
import { Product, PageResponse } from 'app/core/models/product.model';

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = inject(ApiService);

  getProducts(filters: ProductFilters = {}): Observable<PageResponse<Product>> {
    return this.api.get<PageResponse<Product>>('/api/products', {
      ...filters,
      page: filters.page ?? 0,
      size: filters.size ?? 12
    });
  }

  getFeatured(): Observable<Product[]> {
    return this.api.get<Product[]>('/api/products/featured');
  }

  getById(id: number): Observable<Product> {
    return this.api.get<Product>(`/api/products/${id}`);
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.api.post<Product>('/api/products', product);
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.api.put<Product>(`/api/products/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/api/products/${id}`);
  }
}
