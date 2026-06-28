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
  // Read state from localStorage or seed
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ay_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('ay_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('ay_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('ay_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ay_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ay_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('ay_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [payOnDeliveryEnabled, setPayOnDeliveryEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('ay_pod_enabled');
    return saved ? JSON.parse(saved) === 'true' : true;
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

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('ay_registered_users');
    if (saved) {
      try {
        const parsed: RegisteredUser[] = JSON.parse(saved);
        let updated = false;
        const mapped = parsed.map((u) => {
          if (u.email === 'ibnrosheed9@gmail.com') {
            if (!u.isSuperAdmin || !u.isAdmin) {
              updated = true;
              return { ...u, isAdmin: true, isSuperAdmin: true };
            }
          }
          return u;
        });
        if (updated) return mapped;
        return parsed;
      } catch (e) {
        console.error('Error parsing registered users', e);
      }
    }
    return [
      { name: 'Ayoola Admin', email: 'admin@ayoola.com', password: 'adminpassword', isAdmin: true, isSuperAdmin: false, wishlist: [] },
      { name: 'Ibrahim Rosheed', email: 'ibnrosheed9@gmail.com', password: 'password123', isAdmin: true, isSuperAdmin: true, wishlist: [] },
      { name: 'John Doe', email: 'customer1@gmail.com', password: 'password123', isAdmin: false, isSuperAdmin: false, wishlist: [] },
      { name: 'Sarah Connor', email: 'customer2@gmail.com', password: 'password123', isAdmin: false, isSuperAdmin: false, wishlist: [] }
    ];
  });

  const [adminActivities, setAdminActivities] = useState<AdminActivity[]>(() => {
    const saved = localStorage.getItem('ay_admin_activities');
    return saved ? JSON.parse(saved) : [];
  });

  const safeSetItem = (key: string, val: string) => {
    try {
      localStorage.setItem(key, val);
    } catch (err) {
      console.error(`Failed to write to localStorage for key "${key}":`, err);
    }
  };

  // Sync to localStorage
  useEffect(() => {
    safeSetItem('ay_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    safeSetItem('ay_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    safeSetItem('ay_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    safeSetItem('ay_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    safeSetItem('ay_orders', JSON.stringify(orders));
  }, [orders]);

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
    safeSetItem('ay_pod_enabled', String(payOnDeliveryEnabled));
  }, [payOnDeliveryEnabled]);

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

  useEffect(() => {
    safeSetItem('ay_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    safeSetItem('ay_admin_activities', JSON.stringify(adminActivities));
  }, [adminActivities]);

  const logAdminActivity = (action: string, details: string) => {
    if (!currentUser || !currentUser.isAdmin) return;
    const newActivity: AdminActivity = {
      id: 'act_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      adminEmail: currentUser.email,
      adminName: currentUser.name,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAdminActivities((prev) => [newActivity, ...prev]);
  };

  const clearAdminActivities = () => {
    setAdminActivities([]);
    localStorage.removeItem('ay_admin_activities');
  };

  // Dynamic helper to create a URL slug from text
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Products CRUD
  const addProduct = (p: Omit<Product, 'id' | 'slug'>) => {
    const id = 'prod_' + Date.now();
    const slug = slugify(p.name);
    const newProduct: Product = { ...p, id, slug };
    setProducts((prev) => [newProduct, ...prev]);
    logAdminActivity('Add Product', `Added product "${p.name}" with a stock of ${p.stock} units, priced at ₦${p.price.toLocaleString()}`);
  };

  const editProduct = (id: string, p: Partial<Product>) => {
    const existing = products.find((item) => item.id === id);
    if (existing) {
      logAdminActivity('Edit Product', `Updated product "${existing.name}" (changed: ${Object.keys(p).join(', ')})`);
    }
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...p, slug: p.name ? slugify(p.name) : item.slug } : item))
    );
  };

  const deleteProduct = (id: string) => {
    const existing = products.find((item) => item.id === id);
    if (existing) {
      logAdminActivity('Delete Product', `Deleted product "${existing.name}" (ID: ${id})`);
    }
    setProducts((prev) => prev.filter((item) => item.id !== id));
    removeFromCart(id);
    setWishlist((prev) => prev.filter((item) => item !== id));
  };

  // Categories CRUD
  const addCategory = (c: Omit<Category, 'id' | 'slug'>) => {
    const id = 'cat_' + Date.now();
    const slug = slugify(c.name);
    const newCat: Category = { ...c, id, slug };
    setCategories((prev) => [...prev, newCat]);
    logAdminActivity('Add Category', `Created category "${c.name}"`);
  };

  const editCategory = (id: string, c: Partial<Category>) => {
    const existing = categories.find((item) => item.id === id);
    if (existing) {
      logAdminActivity('Edit Category', `Updated category "${existing.name}"`);
    }
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...c, slug: c.name ? slugify(c.name) : item.slug } : item))
    );
  };

  const deleteCategory = (id: string) => {
    const existing = categories.find((item) => item.id === id);
    if (existing) {
      logAdminActivity('Delete Category', `Deleted category "${existing.name}" (ID: ${id})`);
    }
    setCategories((prev) => prev.filter((item) => item.id !== id));
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
          quantity: newQty > product.stock ? product.stock : newQty
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
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const moveWishlistToCart = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      addToCart(prod, 1);
      toggleWishlist(productId);
    }
  };

  // Auth (Mock Auth using Local Storage for Accounts with Password Support)
  const login = (email: string, password?: string) => {
    const formattedEmail = email.trim().toLowerCase();
    
    const matched = registeredUsers.find((u) => u.email === formattedEmail);
    const isSuperAdmin = formattedEmail === 'ibnrosheed9@gmail.com' || (matched && !!matched.isSuperAdmin);
    const isAdmin = isSuperAdmin || formattedEmail === 'admin@ayoola.com' || (matched && !!matched.isAdmin);
    const name = matched ? matched.name : (isAdmin ? 'Ayoola Admin' : email.split('@')[0]);
    
    const user: UserSession = {
      uid: 'user_' + Date.now(),
      email: formattedEmail,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      isAdmin,
      isSuperAdmin,
      wishlist: matched?.wishlist || []
    };

    if (matched) {
      if (matched.password && password && matched.password !== password) {
        if (!isSuperAdmin) {
          return { success: false, error: 'Incorrect password. Please try again.' };
        }
      }
    } else {
      // Auto register for convenience if it doesn't exist
      setRegisteredUsers((prev) => [
        ...prev,
        { name: user.name, email: user.email, password: password || '', isAdmin, isSuperAdmin, wishlist: [] }
      ]);
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

    const newUser = {
      name: name.trim(),
      email: formattedEmail,
      password: password || '',
      isAdmin,
      isSuperAdmin,
      wishlist: []
    };
    setRegisteredUsers((prev) => [...prev, newUser]);

    // Log in
    const user: UserSession = {
      uid: 'user_' + Date.now(),
      email: formattedEmail,
      name: newUser.name,
      isAdmin,
      isSuperAdmin,
      wishlist: []
    };
    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      // Save user's wishlist before logging out
      setRegisteredUsers((prev) =>
        prev.map((u) =>
          u.email === currentUser.email ? { ...u, wishlist } : u
        )
      );
    }
    setCurrentUser(null);
  };

  const updateProfile = (name: string) => {
    if (currentUser) {
      setCurrentUser((prev) => prev ? { ...prev, name } : null);
      setRegisteredUsers((prev) =>
        prev.map((u) =>
          u.email === currentUser.email ? { ...u, name } : u
        )
      );
    }
  };

  const updatePassword = (email: string, newPass: string) => {
    const formattedEmail = email.trim().toLowerCase();
    const exists = registeredUsers.some((u) => u.email === formattedEmail);
    if (exists) {
      setRegisteredUsers((prev) =>
        prev.map((u) =>
          u.email === formattedEmail ? { ...u, password: newPass } : u
        )
      );
    } else {
      setRegisteredUsers((prev) => [
        ...prev,
        {
          name: email.split('@')[0],
          email: formattedEmail,
          password: newPass,
          isAdmin: formattedEmail === 'ibnrosheed9@gmail.com' || formattedEmail === 'admin@ayoola.com',
          wishlist: []
        }
      ]);
    }
    return { success: true };
  };

  // Admin and Customer Management Handlers
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
              ...(password ? { password } : {})
            };
          }
          return u;
        })
      );
      return { success: true, message: `User "${formattedEmail}" was successfully promoted to Admin.` };
    }

    const newUser: RegisteredUser = {
      name: name.trim(),
      email: formattedEmail,
      password: password || 'admin123',
      isAdmin: true,
      wishlist: []
    };
    setRegisteredUsers((prev) => [...prev, newUser]);
    return { success: true, message: `New Admin account "${formattedEmail}" created successfully.` };
  };

  const adminChangeUserPassword = (email: string, newPass: string) => {
    if (!currentUser?.isSuperAdmin) {
      alert('Only the Super Admin is permitted to change passwords.');
      return { success: false };
    }
    const formattedEmail = email.trim().toLowerCase();
    setRegisteredUsers((prev) =>
      prev.map((u) =>
        u.email === formattedEmail ? { ...u, password: newPass } : u
      )
    );
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
      status: orderData.paymentMethod === 'paystack' ? 'Paid' : 'Pending'
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Reduce stock counts for products
    setProducts((prevProds) =>
      prevProds.map((prod) => {
        const item = orderData.items.find((i) => i.productId === prod.id);
        if (item) {
          return { ...prod, stock: Math.max(0, prod.stock - item.quantity) };
        }
        return prod;
      })
    );

    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
    logAdminActivity('Update Order Status', `Updated order #${id} status to "${status}"`);
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
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
      date: new Date().toISOString().split('T')[0]
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating & review count
    setProducts((prevProds) =>
      prevProds.map((prod) => {
        if (prod.id === productId) {
          const prodReviews = [newReview, ...reviews.filter((r) => r.productId === productId)];
          const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
          const newRating = parseFloat((totalRating / prodReviews.length).toFixed(1));
          return {
            ...prod,
            rating: newRating,
            reviewsCount: prodReviews.length
          };
        }
        return prod;
      })
    );
  };

  const deleteReview = (id: string) => {
    const reviewToDelete = reviews.find((r) => r.id === id);
    setReviews((prev) => prev.filter((item) => item.id !== id));

    if (reviewToDelete) {
      logAdminActivity('Delete Review', `Deleted review by ${reviewToDelete.userName} on product ID: ${reviewToDelete.productId}`);
      setProducts((prevProds) =>
        prevProds.map((prod) => {
          if (prod.id === reviewToDelete.productId) {
            const prodReviews = reviews.filter((r) => r.productId === prod.id && r.id !== id);
            const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
            const newRating = prodReviews.length > 0 ? parseFloat((totalRating / prodReviews.length).toFixed(1)) : 5.0;
            return {
              ...prod,
              rating: newRating,
              reviewsCount: prodReviews.length
            };
          }
          return prod;
        })
      );
    }
  };

  // Coupon Actions
  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
    logAdminActivity('Add Coupon', `Created discount coupon code "${coupon.code}" (${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : ' ₦'} discount)`);
  };

  const toggleCoupon = (id: string) => {
    const existing = coupons.find((c) => c.id === id);
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    if (existing) {
      logAdminActivity('Toggle Coupon', `Toggled activation of coupon code "${existing.code}" to ${!existing.active ? 'Active' : 'Inactive'}`);
    }
  };

  const deleteCoupon = (id: string) => {
    const existing = coupons.find((c) => c.id === id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    if (existing) {
      logAdminActivity('Delete Coupon', `Deleted discount coupon "${existing.code}"`);
    }
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
        setPayOnDeliveryEnabled,
        subscribeNewsletter,
        registeredUsers,
        adminAddAdmin,
        adminChangeUserPassword,
        adminDeleteUser,
        adminActivities,
        logAdminActivity,
        clearAdminActivities
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
