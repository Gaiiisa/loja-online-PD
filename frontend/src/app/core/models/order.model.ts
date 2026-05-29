export interface OrderItem {
  productId: number;
  productName: string;
  emoji?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod?: string;
  couponCode?: string;
  shippingInfo: ShippingInfo;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  product: import('./product.model').Product;
  qty: number;
}

export interface OrderRequest {
  items: { productId: number; quantity: number }[];
  paymentMethod: string;
  couponCode?: string;
  shipping: ShippingInfo;
}
