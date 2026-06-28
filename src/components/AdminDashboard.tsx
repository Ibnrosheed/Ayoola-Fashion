import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Category, Coupon, Order } from '../types';
import {
  ShieldAlert, LayoutDashboard, ShoppingBag, FolderOpen, CreditCard,
  MessageSquare, Star, Trash2, Plus, Edit2, ToggleLeft, ToggleRight,
  TrendingUp, Users, CheckCircle, Package, Clock, X, Check, Save, RotateCcw,
  Eye, EyeOff, History
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  onBackToHome: () => void;
  onNavigateToProduct: (slug: string) => void;
}

type AdminTab = 'stats' | 'products' | 'categories' | 'orders' | 'coupons' | 'reviews' | 'users' | 'activity';

export default function AdminDashboard({ onBackToHome, onNavigateToProduct }: AdminDashboardProps) {
  const {
    products, categories, reviews, coupons, orders, payOnDeliveryEnabled,
    addProduct, editProduct, deleteProduct,
    addCategory, editCategory, deleteCategory,
    updateOrderStatus, deleteOrder,
    deleteReview,
    addCoupon, toggleCoupon, deleteCoupon,
    setPayOnDeliveryEnabled, currentUser, login,
    registeredUsers, adminAddAdmin, adminChangeUserPassword, adminDeleteUser,
    adminActivities
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  
  // Restricted Access Logic
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // User/Admin Form states
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [adminFormName, setAdminFormName] = useState('');
  const [adminFormEmail, setAdminFormEmail] = useState('');
  const [adminFormPassword, setAdminFormPassword] = useState('');
  const [adminFormMessage, setAdminFormMessage] = useState({ type: '', text: '' });

  // User Password Change states
  const [changingPasswordUserEmail, setChangingPasswordUserEmail] = useState<string | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  // Product Form states
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pDiscountPrice, setPDiscountPrice] = useState('');
  const [pStock, setPStock] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pSpecs, setPSpecs] = useState('');
  const [pImages, setPImages] = useState('');
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pIsTrending, setPIsTrending] = useState(false);
  const [pIsNewArrival, setPIsNewArrival] = useState(true);
  const [pIsBestSeller, setPIsBestSeller] = useState(false);

  // Category Form states
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [cName, setCName] = useState('');
  const [cDescription, setCDescription] = useState('');
  const [cImage, setCImage] = useState('');

  // Coupon Form states
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);
  const [coupCode, setCoupCode] = useState('');
  const [coupType, setCoupType] = useState<'percentage' | 'fixed'>('percentage');
  const [coupVal, setCoupVal] = useState('');
  const [coupMin, setCoupMin] = useState('');

  // Helper to compress image to a smaller Base64 JPEG string to save localStorage quota
  const compressImage = (dataUrl: string, maxWidth = 800, maxHeight = 800, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => {
        resolve(dataUrl);
      };
      img.src = dataUrl;
    });
  };

  // Helper to read file as a Base64 DataURL for direct browser preview and storage
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const rawDataUrl = reader.result as string;
          const compressed = await compressImage(rawDataUrl);
          resolve(compressed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  // Handler for uploading multiple product image files
  const handleProductImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const base64List: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const dataUrl = await readFileAsDataURL(files[i]);
        base64List.push(dataUrl);
      } catch (err) {
        console.error('Error reading product image file', err);
      }
    }
    if (base64List.length > 0) {
      const currentList = pImages ? pImages.split(',').map(s => s.trim()).filter(s => s !== '') : [];
      // Clean up default placeholder if it is the only one
      const filteredList = currentList.filter(s => !s.startsWith('https://images.unsplash.com'));
      const newList = [...filteredList, ...base64List];
      setPImages(newList.join(', '));
    }
    e.target.value = '';
  };

  // Handler for uploading a single category image file
  const handleCategoryImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const dataUrl = await readFileAsDataURL(files[0]);
      setCImage(dataUrl);
    } catch (err) {
      console.error('Error reading category image file', err);
    }
    e.target.value = '';
  };

  // Admin Verification check
  const isAdminLoggedIn = currentUser && currentUser.isAdmin;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = login(adminEmail, adminPassword);
    if (!res.success) {
      setLoginError('Invalid access metrics. Enter a valid admin email.');
    } else {
      const emailLower = adminEmail.trim().toLowerCase();
      if (emailLower !== 'ibnrosheed9@gmail.com' && emailLower !== 'admin@ayoola.com') {
        setLoginError('This account does not possess Administrative clearance.');
      }
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20" id="admin-login-screen">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">Admin Clearance Required</h2>
            <p className="text-xs text-gray-400">Authenticating access parameters for Ayoola Back-office</p>
          </div>

          {loginError && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg font-medium text-center">{loginError}</p>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4" id="admin-login-form">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                placeholder="e.g. ibnrosheed9@gmail.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 text-gray-800"
                id="admin-email-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                Authorization PIN / Password
              </label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  placeholder="••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label={showAdminPassword ? "Hide password" : "Show password"}
                >
                  {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gray-900 hover:bg-gold-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
            >
              Request Clearance
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onBackToHome}
              className="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
            >
              Return to storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Statistics Calculations
  const totalRevenue = orders
    .filter((o) => o.status === 'Paid' || o.status === 'Delivered' || o.status === 'Processing' || o.status === 'Shipped')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const uniqueCustomerEmails = new Set(orders.map((o) => o.email));
  const totalCustomers = Math.max(registeredUsers?.length || 0, uniqueCustomerEmails.size);

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setPName('');
    setPCategory(categories[0]?.id || '');
    setPBrand('');
    setPPrice('');
    setPDiscountPrice('');
    setPStock('');
    setPDescription('');
    setPSpecs('');
    setPImages('https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80');
    setPIsFeatured(false);
    setPIsTrending(false);
    setPIsNewArrival(true);
    setPIsBestSeller(false);
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setPName(prod.name);
    setPCategory(prod.categoryId);
    setPBrand(prod.brand || '');
    setPPrice(String(prod.price));
    setPDiscountPrice(prod.discountPrice ? String(prod.discountPrice) : '');
    setPStock(String(prod.stock));
    setPDescription(prod.description);
    setPSpecs(prod.specs.join('\n'));
    setPImages(prod.images.join(', '));
    setPIsFeatured(prod.isFeatured || false);
    setPIsTrending(prod.isTrending || false);
    setPIsNewArrival(prod.isNewArrival || false);
    setPIsBestSeller(prod.isBestSeller || false);
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const catObj = categories.find((c) => c.id === pCategory);
    const categorySlug = catObj ? catObj.slug : 'general';

    const pData = {
      name: pName,
      categoryId: pCategory,
      categorySlug,
      brand: pBrand || 'Ayoola',
      price: parseFloat(pPrice) || 0,
      discountPrice: pDiscountPrice ? parseFloat(pDiscountPrice) : undefined,
      stock: parseInt(pStock) || 0,
      description: pDescription,
      specs: pSpecs.split('\n').filter((s) => s.trim() !== ''),
      images: pImages.split(',').map((img) => img.trim()).filter((img) => img !== ''),
      rating: 5.0,
      reviewsCount: 0,
      isFeatured: pIsFeatured,
      isTrending: pIsTrending,
      isNewArrival: pIsNewArrival,
      isBestSeller: pIsBestSeller
    };

    if (editingProductId) {
      editProduct(editingProductId, pData);
    } else {
      addProduct(pData);
    }

    setIsProductFormOpen(false);
  };

  // Category CRUD Handlers
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCName('');
    setCDescription('');
    setCImage('https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80');
    setIsCategoryFormOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cData = {
      name: cName,
      description: cDescription,
      image: cImage
    };

    if (editingCategoryId) {
      editCategory(editingCategoryId, cData);
    } else {
      addCategory(cData);
    }

    setIsCategoryFormOpen(false);
  };

  // Coupon Handlers
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoup: Coupon = {
      id: 'coup_' + Date.now(),
      code: coupCode.trim().toUpperCase(),
      discountType: coupType,
      discountValue: parseFloat(coupVal) || 0,
      minOrderAmount: coupMin ? parseFloat(coupMin) : undefined,
      active: true
    };
    addCoupon(newCoup);
    setIsCouponFormOpen(false);
    setCoupCode('');
    setCoupVal('');
    setCoupMin('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="admin-dashboard-root">
      {/* Dashboard Title Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-gold-600 font-bold text-xs uppercase tracking-widest font-display">
            <ShieldAlert className="h-4 w-4" />
            <span>Ayoola Executive Portal</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 mt-1">Administrative Dashboard</h2>
          <p className="text-xs text-gray-400 mt-0.5">Corporate business parameters, product listings, coupons, and orders management hub.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {/* POD Toggle Controls */}
          <button
            onClick={() => setPayOnDeliveryEnabled(!payOnDeliveryEnabled)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer transition-colors ${
              payOnDeliveryEnabled
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
            id="admin-toggle-pod"
          >
            {payOnDeliveryEnabled ? <ToggleRight className="h-4.5 w-4.5" /> : <ToggleLeft className="h-4.5 w-4.5" />}
            <span>Pay on Delivery: {payOnDeliveryEnabled ? 'ENABLED' : 'DISABLED'}</span>
          </button>

          <button
            onClick={onBackToHome}
            className="px-4 py-2.5 bg-gray-900 hover:bg-gold-500 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
          >
            Exit Backoffice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation Tabs on Left */}
        <div className="md:col-span-3 flex flex-col gap-2 border-r border-gray-100 pr-4 shrink-0">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-3 text-left rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'stats' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            id="tab-btn-stats"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 text-left rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'products' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            id="tab-btn-products"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Products Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-3 text-left rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'categories' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            id="tab-btn-categories"
          >
            <FolderOpen className="h-4 w-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 text-left rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            id="tab-btn-orders"
          >
            <Package className="h-4 w-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-3 text-left rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'coupons' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            id="tab-btn-coupons"
          >
            <CreditCard className="h-4 w-4" />
            <span>Manage Coupons ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-3 text-left rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'reviews' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            id="tab-btn-reviews"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Product Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 text-left rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'users' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            id="tab-btn-users"
          >
            <Users className="h-4 w-4" />
            <span>Customers & Admins ({registeredUsers?.length || 0})</span>
          </button>

          {currentUser?.isSuperAdmin && (
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-3 text-left rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'activity' ? 'bg-gold-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
              id="tab-btn-activity"
            >
              <History className="h-4 w-4" />
              <span>Admin Activity Log ({adminActivities.length})</span>
            </button>
          )}
        </div>

        {/* Tab Contents on Right */}
        <div className="md:col-span-9 space-y-6">
          {/* STATS OVERVIEW */}
          {activeTab === 'stats' && (
            <div className="space-y-6" id="panel-stats">
              {/* Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
                  <div className="text-gray-400 p-2 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 font-semibold uppercase tracking-wider">Total Revenue</p>
                  <p className="font-mono text-xl md:text-2xl font-black text-gray-900 mt-1">₦{totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
                  <div className="text-gray-400 p-2 bg-royal-50 text-royal-500 rounded-xl w-fit">
                    <Package className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 font-semibold uppercase tracking-wider">Total Orders</p>
                  <p className="font-mono text-xl md:text-2xl font-black text-gray-900 mt-1">{totalOrders}</p>
                </div>

                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
                  <div className="text-gray-400 p-2 bg-gold-50 text-gold-600 rounded-xl w-fit">
                    <Users className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 font-semibold uppercase tracking-wider">Total Customers</p>
                  <p className="font-mono text-xl md:text-2xl font-black text-gray-900 mt-1">{totalCustomers}</p>
                </div>

                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
                  <div className="text-gray-400 p-2 bg-gray-50 text-gray-700 rounded-xl w-fit">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 font-semibold uppercase tracking-wider">Total Products</p>
                  <p className="font-mono text-xl md:text-2xl font-black text-gray-900 mt-1">{totalProducts}</p>
                </div>
              </div>

              {/* Recent Placed Orders Table in Overview */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-gray-900">Recent Customer Activity</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] uppercase text-gray-400 tracking-wider">
                        <th className="pb-3 font-semibold">Order ID</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Method</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50">
                          <td className="py-3 font-mono font-bold text-gray-700">{order.id}</td>
                          <td className="py-3 font-semibold text-gray-800">{order.customerName}</td>
                          <td className="py-3 font-mono font-bold">₦{order.total.toLocaleString()}</td>
                          <td className="py-3 text-gray-500">{order.date}</td>
                          <td className="py-3 text-gray-500 uppercase">{order.paymentMethod}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                              order.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                              order.status === 'Delivered' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-gray-400">No client order records available yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS CATALOG PANEL */}
          {activeTab === 'products' && (
            <div className="space-y-6" id="panel-products">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-gray-900">Manage Products Catalog</h3>
                {!isProductFormOpen && (
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 bg-gray-900 hover:bg-gold-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    id="admin-add-product-btn"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Product</span>
                  </button>
                )}
              </div>

              {/* Add / Edit Inline Form */}
              {isProductFormOpen && (
                <form onSubmit={handleSaveProduct} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4" id="admin-product-form">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2.5">
                    <h4 className="font-serif font-bold text-sm text-gray-800">
                      {editingProductId ? 'Edit Fashion Item parameters' : 'List New Premium Product'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsProductFormOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Product Title *</label>
                      <input
                        type="text" required value={pName} onChange={(e) => setPName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                        id="form-pname"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Brand Accent *</label>
                      <input
                        type="text" required value={pBrand} onChange={(e) => setPBrand(e.target.value)}
                        placeholder="e.g. Ayoola Luxury"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                        id="form-pbrand"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Catalog Category *</label>
                      <select
                        value={pCategory} onChange={(e) => setPCategory(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                        id="form-pcategory"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Base Price (₦) *</label>
                      <input
                        type="number" required value={pPrice} onChange={(e) => setPPrice(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                        id="form-pprice"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Discount Price (₦) (Optional)</label>
                      <input
                        type="number" value={pDiscountPrice} onChange={(e) => setPDiscountPrice(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                        id="form-pdiscount"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Stock Count *</label>
                      <input
                        type="number" required value={pStock} onChange={(e) => setPStock(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                        id="form-pstock"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Product Images *</label>
                      <div className="border border-dashed border-gray-200 rounded-xl p-3 text-center bg-white space-y-2">
                        <div className="flex flex-wrap gap-1.5 justify-center max-h-24 overflow-y-auto">
                          {pImages.split(',').map((img) => img.trim()).filter((img) => img !== '').map((img, idx) => (
                            <div key={idx} className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-100 group shrink-0">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const list = pImages.split(',').map(s => s.trim()).filter(s => s !== '');
                                  list.splice(idx, 1);
                                  setPImages(list.join(', '));
                                }}
                                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-md cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          {pImages.split(',').map((img) => img.trim()).filter((img) => img !== '').length === 0 && (
                            <p className="text-[10px] text-gray-400 py-1">No images selected.</p>
                          )}
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <label className="px-3 py-1.5 bg-gold-600 hover:bg-gold-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer inline-block transition-colors">
                            <span>Upload Files</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleProductImageFilesChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Description *</label>
                    <textarea
                      required value={pDescription} onChange={(e) => setPDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                      id="form-pdesc"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Specifications (One per line) *</label>
                    <textarea
                      required value={pSpecs} onChange={(e) => setPSpecs(e.target.value)}
                      placeholder="Material: 100% genuine calf leather&#10;Dimensions: 30cm x 15cm&#10;Insole: Ergonomic Cushion"
                      rows={3}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                      id="form-pspecs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-2">Showcase Placements (Control where this shows on Homepage)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-3.5 border border-gray-100 rounded-xl">
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pIsNewArrival}
                          onChange={(e) => setPIsNewArrival(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                        />
                        <span>New Arrivals</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pIsFeatured}
                          onChange={(e) => setPIsFeatured(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                        />
                        <span>Featured Items</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pIsTrending}
                          onChange={(e) => setPIsTrending(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                        />
                        <span>Trending Items</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={pIsBestSeller}
                          onChange={(e) => setPIsBestSeller(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                        />
                        <span>Best Sellers</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button" onClick={() => setIsProductFormOpen(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gray-900 hover:bg-gold-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                      id="form-psave"
                    >
                      Save Parameters
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase text-gray-400 tracking-wider">
                        <th className="p-4 font-semibold">Image</th>
                        <th className="p-4 font-semibold">Name</th>
                        <th className="p-4 font-semibold">Category</th>
                        <th className="p-4 font-semibold">Price</th>
                        <th className="p-4 font-semibold">Stock</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {products.map((p) => {
                        const cat = categories.find((c) => c.id === p.categoryId);
                        return (
                          <tr key={p.id} className="hover:bg-gray-50/50">
                            <td className="p-4">
                              <div className="h-10 w-10 overflow-hidden rounded-lg border border-gray-100">
                                <img src={p.images[0]} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-gray-800 max-w-[200px] truncate">{p.name}</td>
                            <td className="p-4 text-gray-500">{cat ? cat.name : p.categorySlug}</td>
                            <td className="p-4 font-mono">₦{p.price.toLocaleString()}</td>
                            <td className="p-4 font-mono font-semibold">
                              <span className={p.stock <= 5 ? 'text-amber-600' : 'text-gray-600'}>{p.stock} units</span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-1.5 hover:bg-gold-50 text-gold-600 rounded-lg cursor-pointer"
                                  title="Edit parameters"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteProduct(p.id)}
                                  className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                                  title="Delete product"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORIES PANEL */}
          {activeTab === 'categories' && (
            <div className="space-y-6" id="panel-categories">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-gray-900">Manage Collection Categories</h3>
                {!isCategoryFormOpen && (
                  <button
                    onClick={handleOpenAddCategory}
                    className="px-4 py-2 bg-gray-900 hover:bg-gold-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Category</span>
                  </button>
                )}
              </div>

              {/* Category form */}
              {isCategoryFormOpen && (
                <form onSubmit={handleSaveCategory} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2.5">
                    <h4 className="font-serif font-bold text-sm text-gray-800">
                      {editingCategoryId ? 'Edit Collection properties' : 'Create New Collection Category'}
                    </h4>
                    <button
                      type="button" onClick={() => setIsCategoryFormOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Category Title *</label>
                      <input
                        type="text" required value={cName} onChange={(e) => setCName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Category banner Image *</label>
                      <div className="border border-dashed border-gray-200 rounded-xl p-3 text-center bg-white space-y-2">
                        <div className="flex justify-center">
                          {cImage ? (
                            <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-100 group shrink-0">
                              <img src={cImage} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setCImage('')}
                                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-md cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <p className="text-[10px] text-gray-400 py-1">No banner image selected.</p>
                          )}
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <label className="px-3 py-1.5 bg-gold-600 hover:bg-gold-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer inline-block transition-colors">
                            <span>Upload Banner</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCategoryImageFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Brief Description *</label>
                    <textarea
                      required value={cDescription} onChange={(e) => setCDescription(e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                    />
                  </div>

                  <div className="flex justify-end gap-2.5 pt-1">
                    <button
                      type="button" onClick={() => setIsCategoryFormOpen(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gray-900 hover:bg-gold-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Save Collection
                    </button>
                  </div>
                </form>
              )}

              {/* Categories grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden group">
                    <div className="h-28 rounded-xl overflow-hidden mb-3 relative">
                      <div className="absolute inset-0 bg-black/25 z-10" />
                      <img src={c.image} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute bottom-3 left-3 z-20 text-white font-serif font-bold text-sm">{c.name}</div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{c.description}</p>
                    <div className="flex justify-end gap-2 border-t border-gray-50 pt-2">
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer text-xs flex items-center gap-1.5 font-medium"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6" id="panel-orders">
              <h3 className="font-serif text-lg font-bold text-gray-900">Track Customer Order Parameters</h3>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase text-gray-400 tracking-wider">
                        <th className="p-4 font-semibold">Order ID</th>
                        <th className="p-4 font-semibold">Customer</th>
                        <th className="p-4 font-semibold">Items</th>
                        <th className="p-4 font-semibold">Total Paid</th>
                        <th className="p-4 font-semibold">Method</th>
                        <th className="p-4 font-semibold">Status Update</th>
                        <th className="p-4 font-semibold text-right">Cancel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50/50">
                          <td className="p-4 font-mono font-bold text-gray-700">{o.id}</td>
                          <td className="p-4">
                            <p className="font-bold text-gray-800">{o.customerName}</p>
                            <p className="text-[10px] text-gray-400">{o.phone}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-gray-800 truncate max-w-[150px]">
                              {o.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                            </p>
                          </td>
                          <td className="p-4 font-mono font-bold text-gray-900">₦{o.total.toLocaleString()}</td>
                          <td className="p-4 text-gray-500 uppercase font-semibold text-[10px]">{o.paymentMethod}</td>
                          <td className="p-4">
                            <select
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                              className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-2.5 py-1 text-gray-700 font-medium focus:ring-1 focus:ring-gold-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => deleteOrder(o.id)}
                              className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                              title="Delete Order Record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-gray-400">No placed orders available in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* COUPONS MANAGEMENT */}
          {activeTab === 'coupons' && (
            <div className="space-y-6" id="panel-coupons">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-gray-900">Manage Discount Coupons</h3>
                {!isCouponFormOpen && (
                  <button
                    onClick={() => setIsCouponFormOpen(true)}
                    className="px-4 py-2 bg-gray-900 hover:bg-gold-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Coupon</span>
                  </button>
                )}
              </div>

              {/* Coupon creation form */}
              {isCouponFormOpen && (
                <form onSubmit={handleSaveCoupon} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2.5">
                    <h4 className="font-serif font-bold text-sm text-gray-800">Add New Promo Coupon Code</h4>
                    <button
                      type="button" onClick={() => setIsCouponFormOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Coupon Code (Uppercase) *</label>
                      <input
                        type="text" required placeholder="e.g. FLASH25" value={coupCode} onChange={(e) => setCoupCode(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800 uppercase font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Discount Type *</label>
                      <select
                        value={coupType} onChange={(e) => setCoupType(e.target.value as any)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                      >
                        <option value="percentage">Percentage Off (%)</option>
                        <option value="fixed">Fixed Amount Off (₦)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Value *</label>
                      <input
                        type="number" required placeholder="e.g. 15 for 15%" value={coupVal} onChange={(e) => setCoupVal(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Minimum Cart Subtotal (₦) (Optional)</label>
                      <input
                        type="number" placeholder="e.g. 15000" value={coupMin} onChange={(e) => setCoupMin(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-1">
                    <button
                      type="button" onClick={() => setIsCouponFormOpen(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gray-900 hover:bg-gold-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Publish Coupon
                    </button>
                  </div>
                </form>
              )}

              {/* Coupon list layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs flex justify-between items-center">
                    <div>
                      <span className="font-mono font-black text-sm text-gray-900 bg-gray-50 border border-gray-100 rounded px-2.5 py-1 tracking-wider uppercase">
                        {c.code}
                      </span>
                      <p className="text-xs text-gray-500 mt-2.5 font-medium">
                        Value: <span className="font-bold text-gray-800">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₦${c.discountValue.toLocaleString()}`} Off</span>
                      </p>
                      {c.minOrderAmount && (
                        <p className="text-[10px] text-gray-400">Min Order: ₦{c.minOrderAmount.toLocaleString()}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => toggleCoupon(c.id)}
                        className={`p-1 rounded-lg cursor-pointer ${c.active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-300 hover:bg-gray-50'}`}
                        title={c.active ? 'Deactivate' : 'Activate'}
                      >
                        {c.active ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="p-1 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                        title="Delete coupon"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-6" id="panel-reviews">
              <h3 className="font-serif text-lg font-bold text-gray-900">Moderate Customer Product Reviews</h3>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {reviews.map((rev) => {
                    const prod = products.find((p) => p.id === rev.productId);
                    return (
                      <div key={rev.id} className="p-4 flex gap-4 hover:bg-gray-50/40">
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-bold text-gray-800 text-xs">{rev.userName}</p>
                              <p className="text-[10px] text-gray-400">{rev.userEmail} • {rev.date}</p>
                            </div>
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400' : 'text-gray-100'}`} />
                              ))}
                            </div>
                          </div>
                          {prod && (
                            <p className="text-[10px] text-gold-600 font-semibold uppercase tracking-wider">
                              Product: {prod.name}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 font-light mt-1">{rev.comment}</p>
                        </div>
                        <div className="self-center">
                          <button
                            onClick={() => deleteReview(rev.id)}
                            className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                            title="Delete comment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {reviews.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-xs">No submitted product reviews available.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* USERS & ADMINS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6" id="panel-users">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">Manage Customers & Administrators</h3>
                  <p className="text-xs text-gray-500 font-light mt-0.5">View user accounts, change passwords on demand, or create new administrators.</p>
                </div>
                {currentUser?.isSuperAdmin ? (
                  <button
                    onClick={() => {
                      setIsAdminFormOpen(!isAdminFormOpen);
                      setAdminFormMessage({ type: '', text: '' });
                      setAdminFormName('');
                      setAdminFormEmail('');
                      setAdminFormPassword('');
                    }}
                    className="bg-gray-900 hover:bg-gold-600 text-white font-medium text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isAdminFormOpen ? 'Hide Form' : 'Add New Admin'}</span>
                  </button>
                ) : (
                  <div className="text-[11px] uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100/60 px-3 py-2 rounded-xl font-bold">
                    Super Admin privileges required to add admins
                  </div>
                )}
              </div>

              {/* ADD ADMIN FORM */}
              {isAdminFormOpen && (
                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs space-y-4">
                  <h4 className="font-serif text-sm font-bold text-gray-800 border-b border-gray-50 pb-2 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-gold-600" />
                    Create/Promote Administrative Account
                  </h4>
                  
                  {adminFormMessage.text && (
                    <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      adminFormMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {adminFormMessage.type === 'success' ? <Check className="h-4 w-4 shrink-0" /> : <X className="h-4 w-4 shrink-0" />}
                      <span>{adminFormMessage.text}</span>
                    </div>
                  )}

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!adminFormName.trim() || !adminFormEmail.trim() || !adminFormPassword.trim()) {
                      setAdminFormMessage({ type: 'error', text: 'All fields (Name, Email, and Password) are required.' });
                      return;
                    }
                    const res = adminAddAdmin(adminFormName, adminFormEmail, adminFormPassword);
                    if (res.success) {
                      setAdminFormMessage({ type: 'success', text: res.message });
                      setAdminFormName('');
                      setAdminFormEmail('');
                      setAdminFormPassword('');
                      setTimeout(() => setIsAdminFormOpen(false), 2500);
                    } else {
                      setAdminFormMessage({ type: 'error', text: 'An unexpected error occurred.' });
                    }
                  }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ibrahim Rosheed"
                        value={adminFormName}
                        onChange={(e) => setAdminFormName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. testadmin@ayoola.com"
                        value={adminFormEmail}
                        onChange={(e) => setAdminFormEmail(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                      />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Secure Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={adminFormPassword}
                          onChange={(e) => setAdminFormPassword(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs uppercase tracking-wider h-[34px] px-4 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        Create Admin
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CHANGE PASSWORD COMPACT FORM */}
              {changingPasswordUserEmail && (
                <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl shadow-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-amber-600" />
                      Resetting Password for: <span className="font-mono text-xs text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded">{changingPasswordUserEmail}</span>
                    </h4>
                    <button
                      onClick={() => {
                        setChangingPasswordUserEmail(null);
                        setNewPasswordValue('');
                        setPasswordChangeSuccess('');
                      }}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {passwordChangeSuccess && (
                    <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> {passwordChangeSuccess}
                    </p>
                  )}

                  <div className="flex gap-3 max-w-md">
                    <input
                      type="text"
                      placeholder="Enter new secure password"
                      value={newPasswordValue}
                      onChange={(e) => setNewPasswordValue(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-gold-500 text-gray-800"
                    />
                    <button
                      onClick={() => {
                        if (!newPasswordValue.trim()) return;
                        adminChangeUserPassword(changingPasswordUserEmail, newPasswordValue.trim());
                        setPasswordChangeSuccess('Password updated successfully!');
                        setNewPasswordValue('');
                        setTimeout(() => {
                          setChangingPasswordUserEmail(null);
                          setPasswordChangeSuccess('');
                        }, 2000);
                      }}
                      className="bg-gray-900 hover:bg-gold-600 text-white font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {/* USER ACCOUNTS LIST */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/70 border-b border-gray-100">
                        <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">User / Account Details</th>
                        <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address</th>
                        <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Account Type</th>
                        <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Wishlist Size</th>
                        <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {registeredUsers && registeredUsers.map((user) => {
                        const isSelf = currentUser?.email === user.email;
                        const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';
                        
                        return (
                          <tr key={user.email} className="hover:bg-gray-50/30 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                  user.isSuperAdmin ? 'bg-rose-100 text-rose-700 border border-rose-200' : user.isAdmin ? 'bg-gold-100 text-gold-700 border border-gold-200' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {userInitials}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                                    {user.name || 'Anonymous User'}
                                    {isSelf && <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-semibold px-1.5 py-0.5 rounded-md">You</span>}
                                  </p>
                                  {user.password && (
                                    <p className="text-[9px] text-gray-400 font-mono mt-0.5">Password: <span className="bg-gray-50 px-1 py-0.5 rounded">{user.password}</span></p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-xs text-gray-600">{user.email}</td>
                            <td className="p-4">
                              {user.isSuperAdmin ? (
                                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Super Admin
                                </span>
                              ) : user.isAdmin ? (
                                <span className="inline-flex items-center gap-1 bg-gold-50 text-gold-700 border border-gold-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 border border-gray-100 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Customer
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-xs font-medium text-gray-500 font-mono">{user.wishlist?.length || 0} items</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setChangingPasswordUserEmail(user.email);
                                    setNewPasswordValue('');
                                    setPasswordChangeSuccess('');
                                  }}
                                  className="text-gray-600 hover:text-gold-600 hover:bg-gold-50/50 border border-gray-200 hover:border-gold-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap"
                                  title="Change User Password"
                                >
                                  Change Password
                                </button>
                                
                                {!user.isAdmin && currentUser?.isSuperAdmin && (
                                  <button
                                    onClick={() => {
                                      const res = adminAddAdmin(user.name, user.email);
                                      if (res && !res.success) {
                                        alert(res.message);
                                      }
                                    }}
                                    className="text-gray-600 hover:text-white hover:bg-gold-500 border border-gray-200 hover:border-gold-500 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap"
                                    title="Promote User to Admin Role"
                                  >
                                    Promote to Admin
                                  </button>
                                )}

                                {!isSelf && (
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete the account for "${user.email}"?`)) {
                                        adminDeleteUser(user.email);
                                      }
                                    }}
                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                    title="Delete User Account"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {(!registeredUsers || registeredUsers.length === 0) && (
                    <div className="text-center py-12 text-gray-400 text-xs">No user accounts found.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ADMIN ACTIVITY MONITORING LOG */}
          {activeTab === 'activity' && currentUser?.isSuperAdmin && (
            <div className="space-y-6" id="panel-activity">
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                      <History className="h-5 w-5 text-rose-600" />
                      <span>System Audit & Admin Activity Log</span>
                    </h3>
                    <p className="text-xs text-gray-500 font-light mt-0.5">
                      Monitor all system modifications, additions, and deletions executed by administrators in real time.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear the system log history?')) {
                        localStorage.removeItem('ay_admin_activities');
                        window.location.reload();
                      }
                    }}
                    className="px-3.5 py-2 border border-red-200 hover:border-red-500 text-red-600 hover:bg-red-50 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer self-start md:self-auto"
                  >
                    Clear History Log
                  </button>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                        <th className="p-4">Admin Name & Email</th>
                        <th className="p-4">Action</th>
                        <th className="p-4">Details / Description</th>
                        <th className="p-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {adminActivities && adminActivities.length > 0 ? (
                        adminActivities.map((act) => {
                          const isSelf = act.adminEmail === currentUser?.email;
                          return (
                            <tr key={act.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-4">
                                <div className="font-semibold text-xs text-gray-900">{act.adminName}</div>
                                <div className="font-mono text-[10px] text-gray-500">{act.adminEmail}</div>
                                {isSelf ? (
                                  <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    You (Super Admin)
                                  </span>
                                ) : (
                                  <span className="inline-block mt-1 bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    Other Admin
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  act.action.includes('Delete') 
                                    ? 'bg-red-50 text-red-700 border border-red-100' 
                                    : act.action.includes('Add') 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                      : 'bg-gold-50 text-gold-700 border border-gold-100'
                                }`}>
                                  {act.action}
                                </span>
                              </td>
                              <td className="p-4 text-xs text-gray-600 max-w-xs md:max-w-md truncate md:whitespace-normal">
                                {act.details}
                              </td>
                              <td className="p-4 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                                {new Date(act.timestamp).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-12 text-gray-400 text-xs">
                            No administrative activities logged yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
