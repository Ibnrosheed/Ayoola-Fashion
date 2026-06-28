import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import {
  users,
  categories,
  products,
  reviews,
  coupons,
  orders,
  adminActivities,
} from './schema.ts';

// --- Generic Error Handling Helper ---
function handleQueryError(operation: string, error: unknown): never {
  console.error(`Database query failed during [${operation}]:`, error);
  throw new Error(`Database query failed during [${operation}]. Please try again later.`, { cause: error });
}

// --- Users Queries ---
export async function getUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    handleQueryError('getUsers', error);
  }
}

export async function createUser(user: {
  id: string;
  uid: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  wishlist?: any[];
}) {
  try {
    const existing = await db.select().from(users).where(eq(users.email, user.email.trim().toLowerCase()));
    if (existing.length > 0) {
      const updated = await db.update(users)
        .set({
          name: user.name,
          uid: user.uid,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
          wishlist: user.wishlist || [],
        })
        .where(eq(users.email, user.email.trim().toLowerCase()))
        .returning();
      return updated[0];
    }

    const inserted = await db.insert(users)
      .values({
        id: user.id,
        uid: user.uid,
        email: user.email.trim().toLowerCase(),
        name: user.name,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        wishlist: user.wishlist || [],
      })
      .returning();
    return inserted[0];
  } catch (error) {
    handleQueryError('createUser', error);
  }
}

export async function updateUser(email: string, updates: Partial<typeof users.$inferSelect>) {
  try {
    const formattedEmail = email.trim().toLowerCase();
    const updated = await db.update(users)
      .set(updates)
      .where(eq(users.email, formattedEmail))
      .returning();
    return updated[0];
  } catch (error) {
    handleQueryError('updateUser', error);
  }
}

export async function deleteUser(email: string) {
  try {
    const formattedEmail = email.trim().toLowerCase();
    const deleted = await db.delete(users)
      .where(eq(users.email, formattedEmail))
      .returning();
    return deleted[0];
  } catch (error) {
    handleQueryError('deleteUser', error);
  }
}

// --- Categories Queries ---
export async function getCategories() {
  try {
    return await db.select().from(categories);
  } catch (error) {
    handleQueryError('getCategories', error);
  }
}

export async function createCategory(cat: {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}) {
  try {
    const inserted = await db.insert(categories)
      .values(cat)
      .returning();
    return inserted[0];
  } catch (error) {
    handleQueryError('createCategory', error);
  }
}

export async function updateCategory(id: string, updates: Partial<typeof categories.$inferSelect>) {
  try {
    const updated = await db.update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    handleQueryError('updateCategory', error);
  }
}

export async function deleteCategory(id: string) {
  try {
    const deleted = await db.delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return deleted[0];
  } catch (error) {
    handleQueryError('deleteCategory', error);
  }
}

// --- Products Queries ---
export async function getProducts() {
  try {
    return await db.select().from(products);
  } catch (error) {
    handleQueryError('getProducts', error);
  }
}

export async function createProduct(prod: {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: any[];
  specs: any[];
  rating: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  brand?: string;
}) {
  try {
    const inserted = await db.insert(products)
      .values({
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        categoryId: prod.categoryId,
        categorySlug: prod.categorySlug,
        description: prod.description,
        price: prod.price,
        discountPrice: prod.discountPrice || null,
        stock: prod.stock,
        images: prod.images || [],
        specs: prod.specs || [],
        rating: prod.rating || 0,
        isFeatured: prod.isFeatured || false,
        isTrending: prod.isTrending || false,
        isNewArrival: prod.isNewArrival || false,
        isBestSeller: prod.isBestSeller || false,
        brand: prod.brand || null,
      })
      .returning();
    return inserted[0];
  } catch (error) {
    handleQueryError('createProduct', error);
  }
}

export async function updateProduct(id: string, updates: Partial<typeof products.$inferSelect>) {
  try {
    const updated = await db.update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    handleQueryError('updateProduct', error);
  }
}

export async function deleteProduct(id: string) {
  try {
    const deleted = await db.delete(products)
      .where(eq(products.id, id))
      .returning();
    return deleted[0];
  } catch (error) {
    handleQueryError('deleteProduct', error);
  }
}

// --- Reviews Queries ---
export async function getReviews() {
  try {
    return await db.select().from(reviews);
  } catch (error) {
    handleQueryError('getReviews', error);
  }
}

export async function createReview(rev: {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
}) {
  try {
    const inserted = await db.insert(reviews)
      .values(rev)
      .returning();
    return inserted[0];
  } catch (error) {
    handleQueryError('createReview', error);
  }
}

export async function deleteReview(id: string) {
  try {
    const deleted = await db.delete(reviews)
      .where(eq(reviews.id, id))
      .returning();
    return deleted[0];
  } catch (error) {
    handleQueryError('deleteReview', error);
  }
}

// --- Coupons Queries ---
export async function getCoupons() {
  try {
    return await db.select().from(coupons);
  } catch (error) {
    handleQueryError('getCoupons', error);
  }
}

export async function createCoupon(coupon: {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number;
  active: boolean;
}) {
  try {
    const inserted = await db.insert(coupons)
      .values({
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount || null,
        active: coupon.active ?? true,
      })
      .returning();
    return inserted[0];
  } catch (error) {
    handleQueryError('createCoupon', error);
  }
}

export async function updateCoupon(id: string, updates: Partial<typeof coupons.$inferSelect>) {
  try {
    const updated = await db.update(coupons)
      .set(updates)
      .where(eq(coupons.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    handleQueryError('updateCoupon', error);
  }
}

export async function deleteCoupon(id: string) {
  try {
    const deleted = await db.delete(coupons)
      .where(eq(coupons.id, id))
      .returning();
    return deleted[0];
  } catch (error) {
    handleQueryError('deleteCoupon', error);
  }
}

// --- Orders Queries ---
export async function getOrders() {
  try {
    return await db.select().from(orders);
  } catch (error) {
    handleQueryError('getOrders', error);
  }
}

export async function createOrder(order: {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  items: any[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: string;
  date: string;
  paymentId?: string;
  notes?: string;
}) {
  try {
    const inserted = await db.insert(orders)
      .values({
        id: order.id,
        customerName: order.customerName,
        email: order.email,
        phone: order.phone,
        address: order.address,
        state: order.state,
        city: order.city,
        items: order.items,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        discount: order.discount,
        total: order.total,
        paymentMethod: order.paymentMethod,
        status: order.status,
        date: order.date,
        paymentId: order.paymentId || null,
        notes: order.notes || null,
      })
      .returning();
    return inserted[0];
  } catch (error) {
    handleQueryError('createOrder', error);
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const updated = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    handleQueryError('updateOrderStatus', error);
  }
}

export async function deleteOrder(id: string) {
  try {
    const deleted = await db.delete(orders)
      .where(eq(orders.id, id))
      .returning();
    return deleted[0];
  } catch (error) {
    handleQueryError('deleteOrder', error);
  }
}

// --- Admin Activities Queries ---
export async function getAdminActivities() {
  try {
    return await db.select().from(adminActivities);
  } catch (error) {
    handleQueryError('getAdminActivities', error);
  }
}

export async function createAdminActivity(act: {
  id: string;
  adminEmail: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}) {
  try {
    const inserted = await db.insert(adminActivities)
      .values(act)
      .returning();
    return inserted[0];
  } catch (error) {
    handleQueryError('createAdminActivity', error);
  }
}

export async function clearAdminActivities() {
  try {
    await db.delete(adminActivities);
  } catch (error) {
    handleQueryError('clearAdminActivities', error);
  }
}
