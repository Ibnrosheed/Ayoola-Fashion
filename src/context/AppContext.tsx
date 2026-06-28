import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Review, Coupon, CartItem, Order, UserSession, RegisteredUser, AdminActivity } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS, INITIAL_REVIEWS } from '../data/products';

interface AppContextType {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  coupons: Coupon[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  currentUser: UserSession | null;
  payOnDeliveryEnabled: boolean;
  newsletterEmails: string[];
  
  // Products Management
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => void;
  editProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Categories Management
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => void;
  editCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  moveWishlistToCart: (productId: string) => void;
  
  // Authentication Actions
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (name: string) => void;
  updatePassword: (email: string, password: string) => { success: boolean; error?: string };
  
  // Order Actions
  createOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  
  // Review Actions
  addReview: (productId: string, userName: string, userEmail: string, rating: number, comment: string) => void;
  deleteReview: (id: string) => void;
  
  // Coupon Actions
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
  
  // Pay on Delivery Toggle
  setPayOnDeliveryEnabled: (enabled: boolean) => void;

  // Newsletter Actions
  subscribeNewsletter: (email: string) => { success: boolean; message: string };

  // Customer & Admin Management
  registeredUsers: RegisteredUser[];
  adminAddAdmin: (name: string, email: string, password?: string) => { success: boolean; message: string };
  adminChangeUserPassword: (email: string, newPass: string) => { success: boolean };
  adminDeleteUser: (email: string) => { success: boolean };

  // Admin Activity Log Monitoring
  adminActivities: AdminActivity[];
  logAdminActivity: (action: string, details: string) => void;
  clearAdminActivities: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [adminActivities, setAdminActivities] = useState<AdminActivity[]>([]);
  const [payOnDeliveryEnabled, setPayOnDeliveryEnabled] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ay_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('ay_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (currentUser) {
      return currentUser.wishlist || [];
    }
    const saved = localStorage.getItem('ay_wishlist_anon');
    return saved ? JSON.parse(saved) : [];
  });

  const [newsletterEmails, setNewsletterEmails] = useState<string[]>(() => {
    const saved = localStorage.getItem('ay_newsletter');
    return saved ? JSON.parse(saved) : [];
  });

  // --- FETCH INITIAL STATE FROM DATABASE APIs ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes, rRes, coupRes, oRes, uRes, actRes, podRes] = await Promise.all([
          fetch('/api/products').then((res) => res.json()),
          fetch('/api/categories').then((res) => res.json()),
          fetch('/api/reviews').then((res) => res.json()),
          fetch('/api/coupons').then((res) => res.json()),
          fetch('/api/orders').then((res) => res.json()),
          fetch('/api/users').then((res) => res.json()),
          fetch('/api/admin-activities').then((res) => res.json()),
          fetch('/api/settings/pod').then((res) => res.json()),
        ]);

        if (Array.isArray(pRes)) setProducts(pRes);
        if (Array.isArray(cRes)) setCategories(cRes);
        if (Array.isArray(rRes)) setReviews(rRes);
        if (Array.isArray(coupRes)) setCoupons(coupRes);
        if (Array.isArray(oRes)) setOrders(oRes);
        if (Array.isArray(uRes)) setRegisteredUsers(uRes);
        if (Array.isArray(actRes)) setAdminActivities(actRes);
        if (podRes && typeof podRes.enabled === 'boolean') setPayOnDeliveryEnabled(podRes.enabled);
      } catch (err) {
        console.error('Failed to sync state with Cloud SQL PostgreSQL database:', err);
      }
    };
    fetchData();
  }, []);

  const safeSetItem = (key: string, val: string) => {
    try {
      localStorage.setItem(key, val);
    } catch (err) {
      console.error(`Failed to write to localStorage for key "${key}":`, err);
    }
  };

  // Sync client-only selections/sessions to localStorage
  useEffect(() => {
    safeSetItem('ay_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    safeSetItem('ay_currentUser', JSON.stringify(currentUser));
    if (currentUser) {
      setWishlist(currentUser.wishlist || []);
    } else {
      const saved = localStorage.getItem('ay_wishlist_anon');
      setWishlist(saved ? JSON.parse(saved) : []);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const updatedUser = { ...currentUser, wishlist };
      safeSetItem('ay_currentUser', JSON.stringify(updatedUser));
    } else {
      safeSetItem('ay_wishlist_anon', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    safeSetItem('ay_newsletter', JSON.stringify(newsletterEmails));
  }, [newsletterEmails]);

  // --- SYNC MUTATIONS WITH CLOUD SQL ---

  const logAdminActivity = async (action: string, details: string) => {
    if (!currentUser || !currentUser.isAdmin) return;
    const newActivity: AdminActivity = {
      id: 'act_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      adminEmail: currentUser.email,
      adminName: currentUser.name,
      action,
      details,
      timestamp: new Date().toISOString(),
    };

    setAdminActivities((prev) => [newActivity, ...prev]);

    try {
      await fetch('/api/admin-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity),
      });
    } catch (err) {
      console.error('Failed to log admin activity in database:', err);
    }
  };

  const clearAdminActivities = async () => {
    setAdminActivities([]);
    try {
      await fetch('/api/admin-activities', { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to clear admin activities in database:', err);
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Products CRUD
  const addProduct = async (p: Omit<Product, 'id' | 'slug'>) => {
    const id = 'prod_' + Date.now();
    const slug = slugify(p.name);
    const newProduct: Product = { ...p, id, slug };

    setProducts((prev) => [newProduct, ...prev]);

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      logAdminActivity('Add Product', `Added product "${p.name}" with a stock of ${p.stock} units, priced at ₦${p.price.toLocaleString()}`);
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  const editProduct = async (id: string, p: Partial<Product>) => {
    const existing = products.find((item) => item.id === id);
    if (existing) {
      const updatedProduct = { ...existing, ...p, slug: p.name ? slugify(p.name) : existing.slug };

      setProducts((prev) =>
        prev.map((item) => (item.id === id ? updatedProduct : item))
      );

      try {
        await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });
        logAdminActivity('Edit Product', `Updated product "${existing.name}" (changed: ${Object.keys(p).join(', ')})`);
      } catch (err) {
        console.error('Failed to update product:', err);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const existing = products.find((item) => item.id === id);
    if (existing) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
      removeFromCart(id);
      setWishlist((prev) => prev.filter((item) => item !== id));

      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        logAdminActivity('Delete Product', `Deleted product "${existing.name}" (ID: ${id})`);
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  // Categories CRUD
  const addCategory = async (c: Omit<Category, 'id' | 'slug'>) => {
    const id = 'cat_' + Date.now();
    const slug = slugify(c.name);
    const newCat: Category = { ...c, id, slug };

    setCategories((prev) => [...prev, newCat]);

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat),
      });
      logAdminActivity('Add Category', `Created category "${c.name}"`);
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  const editCategory = async (id: string, c: Partial<Category>) => {
    const existing = categories.find((item) => item.id === id);
    if (existing) {
      const updatedCategory = { ...existing, ...c, slug: c.name ? slugify(c.name) : existing.slug };

      setCategories((prev) =>
        prev.map((item) => (item.id === id ? updatedCategory : item))
      );

      try {
        await fetch(`/api/categories/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCategory),
        });
        logAdminActivity('Edit Category', `Updated category "${existing.name}"`);
      } catch (err) {
        console.error('Failed to update category:', err);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    const existing = categories.find((item) => item.id === id);
    if (existing) {
      setCategories((prev) => prev.filter((item) => item.id !== id));

      try {
        await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        logAdminActivity('Delete Category', `Deleted category "${existing.name}" (ID: ${id})`);
      } catch (err) {
        console.error('Failed to delete category:', err);
      }
    }
  };

  // Cart Management
  const addToCart = (product: Product, quantity: number) => {
    if (currentUser?.isAdmin && !currentUser?.isSuperAdmin) {
      alert('Administrative accounts are not permitted to buy or purchase products. Please log in with a customer or super admin account to purchase.');
      return;
    }
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty > product.stock ? product.stock : newQty,
        };
        return updated;
      }
      return [...prev, { product, quantity: quantity > product.stock ? product.stock : quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(item.product.stock, quantity)) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist Actions
  const toggleWishlist = async (productId: string) => {
    const updatedWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(updatedWishlist);

    if (currentUser) {
      try {
        await fetch(`/api/users/${currentUser.email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wishlist: updatedWishlist }),
        });
      } catch (err) {
        console.error('Failed to update wishlist in DB:', err);
      }
    }
  };

  const moveWishlistToCart = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      addToCart(prod, 1);
      toggleWishlist(productId);
    }
  };

  // Authentication Actions
  const login = (email: string, password?: string) => {
    const formattedEmail = email.trim().toLowerCase();
    
    const matched = registeredUsers.find((u) => u.email === formattedEmail);
    const isSuperAdmin = formattedEmail === 'ibnrosheed9@gmail.com' || (matched && !!matched.isSuperAdmin);
    const isAdmin = isSuperAdmin || formattedEmail === 'admin@ayoola.com' || (matched && !!matched.isAdmin);
    const name = matched ? matched.name : (isAdmin ? 'Ayoola Admin' : email.split('@')[0]);
    
    const user: UserSession = {
      uid: matched?.password || 'user_' + Date.now(),
      email: formattedEmail,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      isAdmin,
      isSuperAdmin,
      wishlist: matched?.wishlist || [],
    };

    if (matched) {
      if (matched.password && password && matched.password !== password) {
        if (!isSuperAdmin) {
          return { success: false, error: 'Incorrect password. Please try again.' };
        }
      }
    } else {
      // Auto register for convenience
      const newUser = {
        id: 'user_' + Date.now(),
        uid: 'uid_' + Date.now(),
        name: user.name,
        email: user.email,
        password: password || '',
        isAdmin,
        isSuperAdmin,
        wishlist: [],
      };
      setRegisteredUsers((prev) => [...prev, newUser]);
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).catch((err) => console.error('Failed to save newly auto-registered user:', err));
    }

    setCurrentUser(user);
    return { success: true };
  };

  const register = (name: string, email: string, password?: string) => {
    const formattedEmail = email.trim().toLowerCase();
    
    if (registeredUsers.some((u) => u.email === formattedEmail)) {
      return { success: false, error: 'Email already exists' };
    }

    const isSuperAdmin = formattedEmail === 'ibnrosheed9@gmail.com';
    const isAdmin = isSuperAdmin || formattedEmail === 'admin@ayoola.com';

    const id = 'user_' + Date.now();
    const uid = 'uid_' + Date.now();
    const newUser = {
      id,
      uid,
      name: name.trim(),
      email: formattedEmail,
      password: password || '',
      isAdmin,
      isSuperAdmin,
      wishlist: [],
    };

    setRegisteredUsers((prev) => [...prev, { ...newUser, wishlist: [] }]);

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch((err) => console.error('Failed to create user in DB:', err));

    const user: UserSession = {
      uid,
      email: formattedEmail,
      name: newUser.name,
      isAdmin,
      isSuperAdmin,
      wishlist: [],
    };
    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      setRegisteredUsers((prev) =>
        prev.map((u) => (u.email === currentUser.email ? { ...u, wishlist } : u))
      );
    }
    setCurrentUser(null);
  };

  const updateProfile = async (name: string) => {
    if (currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, name } : null));
      setRegisteredUsers((prev) =>
        prev.map((u) => (u.email === currentUser.email ? { ...u, name } : u))
      );

      try {
        await fetch(`/api/users/${currentUser.email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
      } catch (err) {
        console.error('Failed to update profile name:', err);
      }
    }
  };

  const updatePassword = (email: string, newPass: string) => {
    const formattedEmail = email.trim().toLowerCase();
    const exists = registeredUsers.some((u) => u.email === formattedEmail);

    if (exists) {
      setRegisteredUsers((prev) =>
        prev.map((u) => (u.email === formattedEmail ? { ...u, password: newPass } : u))
      );
      fetch(`/api/users/${formattedEmail}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass }),
      }).catch((err) => console.error('Failed to update password:', err));
    } else {
      const newUser = {
        id: 'user_' + Date.now(),
        uid: 'uid_' + Date.now(),
        name: email.split('@')[0],
        email: formattedEmail,
        password: newPass,
        isAdmin: formattedEmail === 'ibnrosheed9@gmail.com' || formattedEmail === 'admin@ayoola.com',
        isSuperAdmin: formattedEmail === 'ibnrosheed9@gmail.com',
        wishlist: [],
      };
      setRegisteredUsers((prev) => [...prev, newUser]);
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).catch((err) => console.error('Failed to create user on password reset:', err));
    }
    return { success: true };
  };

  // Admin Operations
  const adminAddAdmin = (name: string, email: string, password?: string) => {
    if (!currentUser || !currentUser.isSuperAdmin) {
      return { success: false, message: 'Unauthorized: Only the Super Administrator can create or promote administrative accounts.' };
    }
    const formattedEmail = email.trim().toLowerCase();
    const exists = registeredUsers.find((u) => u.email === formattedEmail);
    
    if (exists) {
      setRegisteredUsers((prev) =>
        prev.map((u) => {
          if (u.email === formattedEmail) {
            return {
              ...u,
              isAdmin: true,
              ...(password ? { password } : {}),
            };
          }
          return u;
        })
      );
      fetch(`/api/users/${formattedEmail}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: true, ...(password ? { password } : {}) }),
      }).catch((err) => console.error('Failed to update Admin role:', err));

      return { success: true, message: `User "${formattedEmail}" was successfully promoted to Admin.` };
    }

    const id = 'user_' + Date.now();
    const uid = 'uid_' + Date.now();
    const newUser = {
      id,
      uid,
      name: name.trim(),
      email: formattedEmail,
      password: password || 'admin123',
      isAdmin: true,
      isSuperAdmin: false,
      wishlist: [],
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch((err) => console.error('Failed to create new Admin user:', err));

    return { success: true, message: `New Admin account "${formattedEmail}" created successfully.` };
  };

  const adminChangeUserPassword = (email: string, newPass: string) => {
    if (!currentUser?.isSuperAdmin) {
      alert('Only the Super Admin is permitted to change passwords.');
      return { success: false };
    }
    const formattedEmail = email.trim().toLowerCase();
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.email === formattedEmail ? { ...u, password: newPass } : u))
    );
    fetch(`/api/users/${formattedEmail}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPass }),
    }).catch((err) => console.error('Failed to change password:', err));

    logAdminActivity('Change User Password', `Changed password for user account "${formattedEmail}"`);
    return { success: true };
  };

  const adminDeleteUser = (email: string) => {
    if (!currentUser?.isSuperAdmin) {
      alert('Only the Super Admin is permitted to delete user accounts.');
      return { success: false };
    }
    const formattedEmail = email.trim().toLowerCase();
    setRegisteredUsers((prev) => prev.filter((u) => u.email !== formattedEmail));
    fetch(`/api/users/${formattedEmail}`, { method: 'DELETE' })
      .catch((err) => console.error('Failed to delete user:', err));

    logAdminActivity('Delete User Account', `Deleted user account "${formattedEmail}"`);
    return { success: true };
  };

  // Orders Management
  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const id = 'AYO-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      ...orderData,
      id,
      date: new Date().toISOString().split('T')[0],
      status: orderData.paymentMethod === 'paystack' ? 'Paid' : 'Pending',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update product stock on server and client
    const updatedProducts = products.map((prod) => {
      const item = orderData.items.find((i) => i.productId === prod.id);
      if (item) {
        const newStock = Math.max(0, prod.stock - item.quantity);
        fetch(`/api/products/${prod.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stock: newStock }),
        }).catch((err) => console.error('Failed to sync stock on order:', err));
        return { ...prod, stock: newStock };
      }
      return prod;
    });
    setProducts(updatedProducts);

    // Save order on server
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch((err) => console.error('Failed to save order in DB:', err));

    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
    fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.error('Failed to update order status:', err));

    logAdminActivity('Update Order Status', `Updated order #${id} status to "${status}"`);
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    fetch(`/api/orders/${id}`, { method: 'DELETE' })
      .catch((err) => console.error('Failed to delete order:', err));

    logAdminActivity('Delete Order', `Deleted order #${id} from record`);
  };

  // Reviews Actions
  const addReview = (productId: string, userName: string, userEmail: string, rating: number, comment: string) => {
    const id = 'rev_' + Date.now();
    const newReview: Review = {
      id,
      productId,
      userName,
      userEmail,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating & reviewsCount
    const prodReviews = [newReview, ...reviews.filter((r) => r.productId === productId)];
    const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
    const newRating = parseFloat((totalRating / prodReviews.length).toFixed(1));

    setProducts((prevProds) =>
      prevProds.map((prod) => {
        if (prod.id === productId) {
          const updatedProd = { ...prod, rating: newRating, reviewsCount: prodReviews.length };
          fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: newRating, reviewsCount: prodReviews.length }),
          }).catch((err) => console.error('Failed to sync product rating on review add:', err));
          return updatedProd;
        }
        return prod;
      })
    );

    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview),
    }).catch((err) => console.error('Failed to save review:', err));
  };

  const deleteReview = (id: string) => {
    const reviewToDelete = reviews.find((r) => r.id === id);
    setReviews((prev) => prev.filter((item) => item.id !== id));

    if (reviewToDelete) {
      logAdminActivity('Delete Review', `Deleted review by ${reviewToDelete.userName} on product ID: ${reviewToDelete.productId}`);
      
      const prodReviews = reviews.filter((r) => r.productId === reviewToDelete.productId && r.id !== id);
      const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
      const newRating = prodReviews.length > 0 ? parseFloat((totalRating / prodReviews.length).toFixed(1)) : 5.0;

      setProducts((prevProds) =>
        prevProds.map((prod) => {
          if (prod.id === reviewToDelete.productId) {
            const updatedProd = { ...prod, rating: newRating, reviewsCount: prodReviews.length };
            fetch(`/api/products/${prod.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rating: newRating, reviewsCount: prodReviews.length }),
            }).catch((err) => console.error('Failed to sync product rating on review deletion:', err));
            return updatedProd;
          }
          return prod;
        })
      );

      fetch(`/api/reviews/${id}`, { method: 'DELETE' })
        .catch((err) => console.error('Failed to delete review:', err));
    }
  };

  // Coupon Actions
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
    fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon),
    }).catch((err) => console.error('Failed to create coupon:', err));

    logAdminActivity('Add Coupon', `Created discount coupon code "${coupon.code}" (${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : ' ₦'} discount)`);
  };

  const toggleCoupon = (id: string) => {
    const existing = coupons.find((c) => c.id === id);
    if (existing) {
      const updatedActive = !existing.active;
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, active: updatedActive } : c))
      );
      fetch(`/api/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: updatedActive }),
      }).catch((err) => console.error('Failed to toggle coupon:', err));

      logAdminActivity('Toggle Coupon', `Toggled activation of coupon code "${existing.code}" to ${updatedActive ? 'Active' : 'Inactive'}`);
    }
  };

  const deleteCoupon = (id: string) => {
    const existing = coupons.find((c) => c.id === id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    if (existing) {
      fetch(`/api/coupons/${id}`, { method: 'DELETE' })
        .catch((err) => console.error('Failed to delete coupon:', err));

      logAdminActivity('Delete Coupon', `Deleted discount coupon "${existing.code}"`);
    }
  };

  // Pay on Delivery Toggle
  const togglePODStatus = (enabled: boolean) => {
    setPayOnDeliveryEnabled(enabled);
    fetch('/api/settings/pod', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    }).catch((err) => console.error('Failed to save POD setting:', err));
  };

  // Newsletter subscription
  const subscribeNewsletter = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return { success: false, message: 'Please enter a valid email address.' };
    
    if (newsletterEmails.includes(trimmed)) {
      return { success: true, message: `Welcome back! A confirmation subscription email has been re-sent to ${trimmed}.` };
    }
    
    setNewsletterEmails((prev) => [...prev, trimmed]);
    return { success: true, message: `Welcome to Ayoola Luxury Newsletter! A confirmation subscription email has been sent to ${trimmed}.` };
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        reviews,
        coupons,
        orders,
        cart,
        wishlist,
        currentUser,
        payOnDeliveryEnabled,
        newsletterEmails,
        addProduct,
        editProduct,
        deleteProduct,
        addCategory,
        editCategory,
        deleteCategory,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        moveWishlistToCart,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        addReview,
        deleteReview,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        setPayOnDeliveryEnabled: togglePODStatus,
        subscribeNewsletter,
        registeredUsers,
        adminAddAdmin,
        adminChangeUserPassword,
        adminDeleteUser,
        adminActivities,
        logAdminActivity,
        clearAdminActivities,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
