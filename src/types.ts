export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  specs: string[];
  rating: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  reviewsCount?: number;
  brand?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingLocation {
  state: string;
  fee: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'paystack' | 'delivery';
  status: 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  paymentId?: string;
  notes?: string;
}

export interface UserSession {
  uid: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  wishlist: string[]; // Product IDs
}

export interface RegisteredUser {
  name: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  wishlist?: string[];
}

export interface AdminActivity {
  id: string;
  adminEmail: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}


