import { pgTable, text, integer, real, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Firebase Auth UID or unique ID
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  isAdmin: boolean('is_admin').default(false).notNull(),
  isSuperAdmin: boolean('is_super_admin').default(false).notNull(),
  wishlist: jsonb('wishlist').default([]).notNull(), // Array of product IDs
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  image: text('image').notNull(),
});

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  categoryId: text('category_id').notNull(),
  categorySlug: text('category_slug').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  discountPrice: real('discount_price'),
  stock: integer('stock').notNull(),
  images: jsonb('images').default([]).notNull(), // Array of image URLs
  specs: jsonb('specs').default([]).notNull(), // Array of specs
  rating: real('rating').default(0).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isTrending: boolean('is_trending').default(false).notNull(),
  isNewArrival: boolean('is_new_arrival').default(false).notNull(),
  isBestSeller: boolean('is_best_seller').default(false).notNull(),
  brand: text('brand'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull(),
  userName: text('user_name').notNull(),
  userEmail: text('user_email').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  date: text('date').notNull(),
});

export const coupons = pgTable('coupons', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  discountType: text('discount_type').notNull(), // 'percentage' | 'fixed'
  discountValue: real('discount_value').notNull(),
  minOrderAmount: real('min_order_amount'),
  active: boolean('active').default(true).notNull(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  state: text('state').notNull(),
  city: text('city').notNull(),
  items: jsonb('items').notNull(), // Array of OrderItem
  subtotal: real('subtotal').notNull(),
  shippingFee: real('shipping_fee').notNull(),
  discount: real('discount').notNull(),
  total: real('total').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'paystack' | 'delivery'
  status: text('status').notNull(), // 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  date: text('date').notNull(),
  paymentId: text('payment_id'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const adminActivities = pgTable('admin_activities', {
  id: text('id').primaryKey(),
  adminEmail: text('admin_email').notNull(),
  adminName: text('admin_name').notNull(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  timestamp: text('timestamp').notNull(),
});
