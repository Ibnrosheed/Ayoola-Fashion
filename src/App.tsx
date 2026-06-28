/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Order } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutSection from './components/CheckoutSection';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import {
  ShoppingBag, Star, Heart, ArrowRight, ShieldCheck, HelpCircle,
  Phone, Mail, MapPin, Sparkles, SlidersHorizontal, Check, RefreshCw, Send, Eye, StarHalf, ZoomIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function StorefrontContent() {
  const {
    products, categories, reviews, addReview, cart, addToCart, toggleWishlist, wishlist, currentUser, orders
  } = useApp();

  // Navigation & View States
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  
  // Modals & Drawer States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Shop filters
  const [shopCategory, setShopCategory] = useState('all');
  const [shopSort, setShopSort] = useState('featured');
  const [shopSearch, setShopSearch] = useState('');
  const [shopBrand, setShopBrand] = useState('all');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');

  // Product detail reviews form state
  const [revRating, setRevRating] = useState(5);
  const [revName, setRevName] = useState('');
  const [revEmail, setRevEmail] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revSuccess, setRevSuccess] = useState('');

  // Zoom feature state for product detail
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Update detail view when email matches
  useEffect(() => {
    if (currentUser) {
      setRevName(currentUser.name);
      setRevEmail(currentUser.email);
    }
  }, [currentUser]);

  // Handle page transitions / scroll reset
  const handleNavigate = (tab: string, args?: any) => {
    setActiveTab(tab);
    setSelectedProductSlug('');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'shop') {
      if (args?.search) {
        setShopSearch(args.search);
      } else if (args?.category) {
        setShopCategory(args.category);
        setShopSearch('');
      } else {
        setShopSearch('');
        setShopCategory('all');
      }
    }
  };

  const handleViewProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setActiveTab('product-details');
    setActiveImageIdx(0);
    setIsZoomed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuthModal = (tab: 'login' | 'register') => {
    setAuthInitialTab(tab);
    setIsAuthOpen(true);
  };

  const handleOrderComplete = (orderId: string) => {
    setActiveOrderId(orderId);
    setActiveTab('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Image zoom coordinates tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Extract Promotional "Featured Deals" (High discount products!)
  const discountDeals = products.filter((p) => p.discountPrice && p.discountPrice < p.price).slice(0, 3);

  // Extract items for home sectioning
  const featuredProducts = products.filter((p) => p.isFeatured);
  const trendingProducts = products.filter((p) => p.isTrending);
  const newArrivals = products.filter((p) => p.isNewArrival);
  const bestSellers = products.filter((p) => p.isBestSeller);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between text-gray-800 font-sans selection:bg-gold-100 selection:text-gold-900">
      
      {/* Navigation Layer */}
      <Navbar
        onNavigate={handleNavigate}
        activeTab={activeTab}
        onOpenAuth={handleOpenAuthModal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* HOME PAGE VIEW */}
          {activeTab === 'home' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16 pb-16"
              id="view-home"
            >
              {/* Hero Slider */}
              <Hero
                onShopNow={() => handleNavigate('shop')}
                onExploreCollections={() => handleNavigate('shop')}
              />

              {/* FEATURED DEALS (PROMOTIONAL SECTION) */}
              {discountDeals.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="featured-deals-section">
                  <div className="bg-gradient-to-r from-gray-950 via-[#121c2e] to-gray-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden border border-gold-500/20 shadow-xl">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row gap-8 justify-between items-center">
                      <div className="max-w-md space-y-4 text-center lg:text-left">
                        <span className="bg-gold-500 text-slate-900 font-display font-bold text-[10px] tracking-widest px-3 py-1 rounded-full uppercase">
                          Featured Flash Deals
                        </span>
                        <h3 className="font-serif text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
                          Limited Premium Promotions
                        </h3>
                        <p className="text-xs text-gray-400 font-light leading-relaxed">
                          Save up to 15% on handpicked luxury bags, high-fashion heels, and gold jewelry. Limited quantities available.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:max-w-3xl">
                        {discountDeals.map((deal) => {
                          const currentPrice = deal.discountPrice || deal.price;
                          const discPercent = Math.round(((deal.price - currentPrice) / deal.price) * 100);
                          return (
                            <div
                              key={deal.id}
                              onClick={() => handleViewProduct(deal.slug)}
                              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:bg-white/10 cursor-pointer transition-all group"
                            >
                              <div className="h-32 rounded-xl overflow-hidden relative">
                                <span className="absolute top-2 left-2 z-10 bg-red-500 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                                  -{discPercent}%
                                </span>
                                <img src={deal.images[0]} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-serif text-xs font-bold text-gray-200 line-clamp-1">{deal.name}</h4>
                                <div className="flex gap-2 items-baseline font-mono text-xs">
                                  <span className="font-bold text-gold-400">₦{currentPrice.toLocaleString()}</span>
                                  <span className="text-[10px] text-gray-500 line-through">₦{deal.price.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* FEATURED CATEGORIES SECTION */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="featured-categories-section">
                <div className="text-center space-y-1.5">
                  <h3 className="font-serif text-3xl font-extrabold text-gray-900 tracking-tight">Featured Collections</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">Explore our curated collections crafted to elevate your style</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleNavigate('shop', { category: cat.id })}
                      className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-3.5 hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-100 shadow-xs group-hover:scale-105 transition-transform">
                        <img src={cat.image} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 group-hover:text-gold-600 transition-colors">{cat.name}</h4>
                        <span className="text-[10px] text-gray-400">Shop Catalog</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* NEW ARRIVALS */}
              {newArrivals.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="new-arrivals-section">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold-600 tracking-widest font-display">Fresh off the Runway</span>
                      <h3 className="font-serif text-2xl font-black text-gray-900 tracking-tight">New Arrivals</h3>
                    </div>
                    <button onClick={() => handleNavigate('shop')} className="text-xs text-gold-600 hover:text-gold-700 font-semibold flex items-center gap-1 cursor-pointer">
                      <span>View All</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {newArrivals.slice(0, 4).map((p) => (
                      <ProductCard key={p.id} product={p} onViewDetails={handleViewProduct} />
                    ))}
                  </div>
                </section>
              )}

              {/* BEST SELLERS */}
              {bestSellers.length > 0 && (
                <section className="bg-gray-100/50 py-16" id="bestsellers-section">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="flex justify-between items-end border-b border-gray-200 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gold-600 tracking-widest font-display">Most Loved Pieces</span>
                        <h3 className="font-serif text-2xl font-black text-gray-900 tracking-tight">Best Sellers</h3>
                      </div>
                      <button onClick={() => handleNavigate('shop')} className="text-xs text-gold-600 hover:text-gold-700 font-semibold flex items-center gap-1 cursor-pointer">
                        <span>View All</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {bestSellers.slice(0, 4).map((p) => (
                        <ProductCard key={p.id} product={p} onViewDetails={handleViewProduct} />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* LIFESTYLE INSTAGRAM-STYLE GALLERY */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="lifestyle-gallery">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">Aesthetic Showcase</span>
                  <h3 className="font-serif text-3xl font-extrabold text-gray-900 tracking-tight">Ayoola on Instagram</h3>
                  <p className="text-xs text-gray-400 font-light">Tag <span className="font-bold">@AyoolaFashion</span> to get featured on our luxury feed</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="h-56 rounded-2xl overflow-hidden relative group shadow-sm border border-gray-100">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center text-white text-xs font-semibold">
                      @AyoolaFashion
                    </div>
                    <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80" alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="h-56 rounded-2xl overflow-hidden relative group shadow-sm border border-gray-100">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center text-white text-xs font-semibold">
                      @AyoolaFashion
                    </div>
                    <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80" alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="h-56 rounded-2xl overflow-hidden relative group shadow-sm border border-gray-100">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center text-white text-xs font-semibold">
                      @AyoolaFashion
                    </div>
                    <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="h-56 rounded-2xl overflow-hidden relative group shadow-sm border border-gray-100">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center text-white text-xs font-semibold">
                      @AyoolaFashion
                    </div>
                    <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* SHOP CATALOG VIEW */}
          {activeTab === 'shop' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
              id="view-shop"
            >
              {/* Heading */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-gray-900">Ayoola Fashion & Essentials Catalog</h2>
                <p className="text-xs text-gray-400 mt-1">Refine and filter through our catalog of footwear, luxury bags, and accessories.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-5">
                    <div className="flex items-center gap-2 border-b border-gray-50 pb-2.5">
                      <SlidersHorizontal className="h-4 w-4 text-gold-600" />
                      <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-700">Filter parameters</h3>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</label>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <button
                          onClick={() => setShopCategory('all')}
                          className={`text-left py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer ${shopCategory === 'all' ? 'bg-gold-500 text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          All Categories
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setShopCategory(cat.id)}
                            className={`text-left py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer truncate ${shopCategory === cat.id ? 'bg-gold-500 text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sorting */}
                    <div className="space-y-2 pt-2 border-t border-gray-50">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Sort By</label>
                      <select
                        value={shopSort}
                        onChange={(e) => setShopSort(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none"
                      >
                        <option value="featured">Featured Deals</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>

                    {/* Reset button */}
                    <button
                      onClick={() => {
                        setShopCategory('all');
                        setShopSort('featured');
                        setShopSearch('');
                      }}
                      className="w-full py-2 bg-gray-900 text-white text-[10px] uppercase tracking-wider font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1 hover:bg-gold-500"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-9 space-y-6">
                  {/* Active filters / search tag */}
                  {shopSearch && (
                    <div className="flex justify-between items-center bg-gold-50/50 border border-gold-200/30 p-3.5 rounded-xl">
                      <p className="text-xs text-gold-800">
                        Showing results for <span className="font-bold">"{shopSearch}"</span>
                      </p>
                      <button onClick={() => setShopSearch('')} className="text-xs font-semibold text-gold-600 hover:underline">Clear search</button>
                    </div>
                  )}

                  {/* Filter products logic */}
                  {(() => {
                    let filtered = products.filter((p) => {
                      const matchesCategory = shopCategory === 'all' || p.categoryId === shopCategory;
                      const matchesSearch = !shopSearch ||
                        p.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
                        p.description.toLowerCase().includes(shopSearch.toLowerCase()) ||
                        p.brand?.toLowerCase().includes(shopSearch.toLowerCase());
                      return matchesCategory && matchesSearch;
                    });

                    if (shopSort === 'price-low') {
                      filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
                    } else if (shopSort === 'price-high') {
                      filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
                    } else if (shopSort === 'rating') {
                      filtered.sort((a, b) => b.rating - a.rating);
                    }

                    if (filtered.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white border border-gray-100 rounded-2xl">
                          <ShoppingBag className="h-12 w-12 text-gray-300 stroke-1" />
                          <div>
                            <h4 className="font-serif text-lg font-bold text-gray-800">No products found</h4>
                            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Try adjusting your filters or search keywords to explore items.</p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {filtered.map((p) => (
                          <ProductCard key={p.id} product={p} onViewDetails={handleViewProduct} />
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}

          {/* PRODUCT DETAILS VIEW */}
          {activeTab === 'product-details' && selectedProductSlug && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12"
              id="view-product-details"
            >
              {(() => {
                const prod = products.find((p) => p.slug === selectedProductSlug);
                if (!prod) return <p className="text-center py-20 text-gray-400">Loading catalog item parameters...</p>;

                const itemPrice = prod.discountPrice || prod.price;
                const origPrice = prod.discountPrice ? prod.price : null;
                const related = products.filter((p) => p.categoryId === prod.categoryId && p.id !== prod.id).slice(0, 4);
                const prodReviews = reviews.filter((r) => r.productId === prod.id);

                return (
                  <div className="space-y-12">
                    {/* Back arrow */}
                    <button
                      onClick={() => handleNavigate('shop')}
                      className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
                      <span>Back to Shop All</span>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                      {/* Left: Images Showcase */}
                      <div className="md:col-span-6 space-y-4">
                        {/* Main Image View with Zoom */}
                        <div
                          onMouseMove={handleMouseMove}
                          onMouseEnter={() => setIsZoomed(true)}
                          onMouseLeave={() => setIsZoomed(false)}
                          className="aspect-[4/5] bg-white border border-gray-100 rounded-3xl overflow-hidden relative shadow-xs cursor-zoom-in"
                        >
                          <img
                            src={prod.images[activeImageIdx]}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover object-center transition-transform duration-100"
                            style={
                              isZoomed
                                ? {
                                    transform: 'scale(1.8)',
                                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                                  }
                                : undefined
                            }
                          />
                          {!isZoomed && (
                            <span className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] p-2 rounded-full backdrop-blur-xs flex items-center gap-1 pointer-events-none">
                              <ZoomIn className="h-3.5 w-3.5" />
                              Hover to Zoom
                            </span>
                          )}
                        </div>

                        {/* Thumbnails list */}
                        {prod.images.length > 1 && (
                          <div className="flex gap-3">
                            {prod.images.map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveImageIdx(idx)}
                                className={`h-16 w-16 rounded-xl border overflow-hidden bg-gray-50 cursor-pointer ${
                                  activeImageIdx === idx ? 'border-gold-500 ring-2 ring-gold-100' : 'border-gray-200'
                                }`}
                              >
                                <img src={img} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Specifications & Pricing */}
                      <div className="md:col-span-6 space-y-6">
                        <div className="space-y-1">
                          <span className="text-xs text-gold-600 font-bold uppercase tracking-widest">{prod.brand}</span>
                          <h2 className="font-serif text-2xl md:text-3xl font-black text-gray-900 leading-tight">{prod.name}</h2>
                          
                          {/* Rating and review statistics */}
                          <div className="flex items-center gap-2 pt-2">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < Math.floor(prod.rating) ? 'fill-amber-400' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <span className="text-xs font-mono font-bold text-gray-800">
                              {prod.rating} ({prodReviews.length} Verified Review{prodReviews.length !== 1 ? 's' : ''})
                            </span>
                          </div>
                        </div>

                        {/* Price segment */}
                        <div className="flex items-baseline gap-3 py-3 border-t border-b border-gray-100">
                          <span className="font-mono text-2xl font-black text-gray-900">
                            ₦{itemPrice.toLocaleString()}
                          </span>
                          {origPrice && (
                            <span className="font-mono text-sm text-gray-400 line-through">
                              ₦{origPrice.toLocaleString()}
                            </span>
                          )}
                          {origPrice && (
                            <span className="bg-red-100 text-red-600 font-bold text-xs px-2.5 py-0.5 rounded-md">
                              SAVE ₦{(origPrice - itemPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Stock Warning */}
                        <p className={`text-xs font-semibold ${prod.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          • {prod.stock > 0 ? `In Stock (Only ${prod.stock} items remaining)` : 'Out of Stock / Sold Out'}
                        </p>

                        {/* Product Description */}
                        <p className="text-xs text-gray-500 leading-relaxed font-light">{prod.description}</p>

                        {/* Action Buttons */}
                        {currentUser?.isAdmin && !currentUser?.isSuperAdmin ? (
                          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center rounded-xl font-medium">
                            ⚠️ Administrative accounts are not permitted to buy or purchase products. Please log in with a customer account to purchase.
                          </div>
                        ) : prod.stock > 0 ? (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={() => {
                                addToCart(prod, 1);
                                setIsCartOpen(true);
                              }}
                              className="flex-1 py-3.5 bg-gray-900 hover:bg-gold-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer text-center"
                              id="detail-add-to-cart"
                            >
                              Add to Luxury Cart
                            </button>
                            <button
                              onClick={() => {
                                addToCart(prod, 1);
                                handleNavigate('checkout');
                              }}
                              className="flex-1 py-3.5 bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer text-center"
                              id="detail-buy-now"
                            >
                              Express Buy Now
                            </button>
                          </div>
                        ) : (
                          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-center rounded-xl font-medium">
                            This luxury product is currently sold out. Connect on WhatsApp to reserve the next arrivals.
                          </div>
                        )}

                        {/* Specifications */}
                        {prod.specs.length > 0 && (
                          <div className="space-y-2 pt-4">
                            <h4 className="text-xs font-bold uppercase text-gray-800 tracking-wider">Product Specifications</h4>
                            <ul className="text-xs text-gray-500 space-y-1.5 list-disc pl-4 font-light">
                              {prod.specs.map((spec, idx) => (
                                <li key={idx}>{spec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CUSTOMER REVIEWS PORTLET */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 border-t border-gray-100">
                      {/* Left: Review metrics */}
                      <div className="lg:col-span-5 space-y-6">
                        <h3 className="font-serif text-xl font-bold text-gray-900">Verified Client Reviews</h3>
                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-4xl font-black text-gray-900">{prod.rating}</span>
                            <div>
                              <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(prod.rating) ? 'fill-amber-400' : 'text-gray-200'}`} />
                                ))}
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">Average Store Rating</p>
                            </div>
                          </div>

                          {/* Write Review form */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!revName || !revEmail || !revComment) return;
                              addReview(prod.id, revName, revEmail, revRating, revComment);
                              setRevSuccess('Your rating statement has been published!');
                              setRevComment('');
                              setTimeout(() => setRevSuccess(''), 2500);
                            }}
                            className="space-y-3 pt-4 border-t border-gray-50"
                          >
                            <p className="text-xs font-bold uppercase text-gray-700 tracking-wider">Leave a Review Statement</p>
                            
                            {revSuccess && (
                              <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg font-medium">{revSuccess}</p>
                            )}

                            <div className="flex gap-1.5 items-center">
                              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Select Rating:</span>
                              <div className="flex text-amber-400">
                                {[...Array(5)].map((_, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setRevRating(idx + 1)}
                                    className="p-1 cursor-pointer focus:outline-none"
                                  >
                                    <Star className={`h-4.5 w-4.5 ${idx < revRating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                required
                                placeholder="Your Name"
                                value={revName}
                                onChange={(e) => setRevName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none"
                              />
                              <input
                                type="email"
                                required
                                placeholder="Your Email"
                                value={revEmail}
                                onChange={(e) => setRevEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none"
                              />
                            </div>

                            <textarea
                              required
                              placeholder="Describe your purchase experience with Ayoola..."
                              value={revComment}
                              onChange={(e) => setRevComment(e.target.value)}
                              rows={2.5}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:bg-white focus:outline-none"
                            />

                            <button
                              type="submit"
                              className="w-full py-2 bg-gray-900 hover:bg-gold-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                            >
                              Publish Review Statement
                            </button>
                          </form>
                        </div>
                      </div>

                      {/* Right: Reviews List */}
                      <div className="lg:col-span-7 space-y-4">
                        <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Client Testimonials ({prodReviews.length})</h4>
                        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
                          {prodReviews.map((rev) => (
                            <div key={rev.id} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2 shadow-xs last:mb-0">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <p className="text-xs font-bold text-gray-800">{rev.userName}</p>
                                  <p className="text-[9px] text-gray-400">{rev.date} • Verified buyer</p>
                                </div>
                                <div className="flex text-amber-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400' : 'text-gray-100'}`} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 font-light leading-relaxed">"{rev.comment}"</p>
                            </div>
                          ))}
                          {prodReviews.length === 0 && (
                            <p className="text-xs text-gray-400 py-6 text-center italic">Be the first to review this luxury product statement.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RELATED PRODUCTS */}
                    {related.length > 0 && (
                      <div className="space-y-6 pt-10 border-t border-gray-100">
                        <h3 className="font-serif text-xl font-bold text-gray-900">Related Collections</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                          {related.map((p) => (
                            <ProductCard key={p.id} product={p} onViewDetails={handleViewProduct} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* CHECKOUT FLOW VIEW */}
          {activeTab === 'checkout' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              id="view-checkout"
            >
              <CheckoutSection
                onBackToCart={() => { setIsCartOpen(true); handleNavigate('shop'); }}
                onOrderComplete={handleOrderComplete}
              />
            </motion.div>
          )}

          {/* ORDER SUCCESS PAGE REDIRECT */}
          {activeTab === 'order-success' && activeOrderId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto py-20 px-4 text-center space-y-6"
              id="view-order-success"
            >
              <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <Check className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-3xl font-bold text-gray-900">Order Dispatched!</h2>
                <p className="text-xs text-gray-400">Order ID: <span className="font-mono text-emerald-600 font-semibold">{activeOrderId}</span></p>
                <p className="text-xs text-gray-500 font-light leading-relaxed px-2">
                  Thank you for shopping with <span className="font-semibold">Ayoola Fashion & Essentials</span>. An invoice receipt has been securely recorded in our database system.
                </p>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-left text-xs space-y-2.5">
                <p className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] border-b border-emerald-500/10 pb-1.5">WhatsApp Synchronization</p>
                <p className="text-gray-600 leading-relaxed font-light text-[11px]">
                  Our logistics dispatcher will confirm order dispatch details on WhatsApp. If you were not automatically redirected, please click the button below.
                </p>
                <button
                  onClick={() => {
                    const waNumber = '2348168325982';
                    const message = `Hello Ayoola Fashion & Essentials,
I have made payment for my order:
Order ID: ${activeOrderId}

Kindly confirm my dispatch shipment.
Thank you.`;
                    const encodedMessage = encodeURIComponent(message);
                    window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank');
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider text-center"
                >
                  Manually Open WhatsApp Chat
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleNavigate('home')}
                  className="px-6 py-3 bg-gray-900 hover:bg-gold-500 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Return to Storefront
                </button>
              </div>
            </motion.div>
          )}

          {/* WISHLIST STORE VIEW */}
          {activeTab === 'wishlist' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
              id="view-wishlist"
            >
              <div>
                <h2 className="font-serif text-3xl font-bold text-gray-900">Your Private Wishlist</h2>
                <p className="text-xs text-gray-400 mt-1">Saves all your favorite high-fashion pieces for effortless checkout.</p>
              </div>

              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white border border-gray-100 rounded-3xl">
                  <div className="bg-gray-50 p-6 rounded-full text-gray-300">
                    <Heart className="h-14 w-14 stroke-1" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gray-800">Your wishlist is empty</h3>
                    <p className="text-xs text-gray-400 mt-1">Tap the heart icon on any premium product card to save them here!</p>
                  </div>
                  <button
                    onClick={() => handleNavigate('shop')}
                    className="px-6 py-2.5 bg-gray-900 hover:bg-gold-500 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Explore Shop Catalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {wishlist.map((id) => {
                    const item = products.find((p) => p.id === id);
                    if (!item) return null;
                    return (
                      <div key={item.id} className="relative group">
                        <ProductCard product={item} onViewDetails={handleViewProduct} />
                        <button
                          onClick={() => {
                            addToCart(item, 1);
                            toggleWishlist(item.id);
                          }}
                          className="absolute bottom-20 left-4 right-4 z-15 py-2 bg-gray-900/90 text-white hover:bg-gold-500 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs cursor-pointer text-center"
                        >
                          Move to Cart
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* PROFILE & PURCHASES HISTORY VIEW */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
              id="view-profile"
            >
              {(() => {
                if (!currentUser) {
                  return (
                    <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-3xl p-8 shadow-md">
                      <h3 className="font-serif text-xl font-bold mb-2">My Profile Coordinates</h3>
                      <p className="text-xs text-gray-400 mb-6">Create an account or login to access your verified order histories</p>
                      <button
                        onClick={() => handleOpenAuthModal('login')}
                        className="px-6 py-2.5 bg-gray-900 hover:bg-gold-500 text-white text-xs font-semibold uppercase rounded-xl transition-all cursor-pointer"
                      >
                        Sign In / Register
                      </button>
                    </div>
                  );
                }

                const clientOrders = orders.filter((o) => o.email === currentUser.email);

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: profile details */}
                    <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-xs space-y-4">
                      <h3 className="font-serif text-lg font-bold text-gray-900">Personal Information</h3>
                      <div className="space-y-3">
                        <div className="h-16 w-16 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center font-serif text-2xl font-bold uppercase shadow-sm">
                          {currentUser.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verified Customer</p>
                          <p className="text-base font-bold text-gray-800">{currentUser.name}</p>
                          <p className="text-xs text-gray-500">{currentUser.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Order history tracking */}
                    <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-xs space-y-6">
                      <h3 className="font-serif text-lg font-bold text-gray-900">My Purchase History ({clientOrders.length})</h3>
                      <div className="space-y-6">
                        {clientOrders.map((order) => {
                          const steps: Order['status'][] = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered'];
                          const currentStepIdx = steps.indexOf(order.status);

                          return (
                            <div key={order.id} className="border border-gray-100 rounded-2xl p-5 space-y-4 shadow-xs">
                              <div className="flex justify-between items-start gap-4 border-b border-gray-50 pb-2 flex-wrap">
                                <div>
                                  <span className="text-[10px] text-gray-400 font-bold uppercase">Order Reference</span>
                                  <p className="font-mono text-sm font-bold text-gray-800">{order.id}</p>
                                </div>
                                <div>
                                  <span className="text-[10px] text-gray-400 font-bold uppercase">Total Amount</span>
                                  <p className="font-mono text-sm font-bold text-gray-900">₦{order.total.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-[10px] text-gray-400 font-bold uppercase">Payment Mode</span>
                                  <p className="text-xs font-semibold text-gray-600 uppercase">{order.paymentMethod}</p>
                                </div>
                              </div>

                              {/* Stepper tracking */}
                              <div className="space-y-2">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Shipment Status Tracking</p>
                                <div className="flex justify-between items-center relative pt-2">
                                  {steps.map((step, idx) => {
                                    const isDone = idx <= currentStepIdx;
                                    return (
                                      <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-xs ${
                                          isDone ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                          {isDone ? '✓' : idx + 1}
                                        </div>
                                        <span className="text-[9px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">{step}</span>
                                      </div>
                                    );
                                  })}
                                  {/* Line behind steps */}
                                  <div className="absolute top-[18px] left-[10%] right-[10%] h-0.5 bg-gray-100 -z-0" />
                                </div>
                              </div>

                              {/* Items within order */}
                              <div className="space-y-1.5 pt-2">
                                {order.items.map((it, i) => (
                                  <div key={i} className="flex gap-2.5 items-center text-xs text-gray-600">
                                    <div className="h-6 w-6 overflow-hidden rounded bg-gray-50 border border-gray-100">
                                      <img src={it.image} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                                    </div>
                                    <span>{it.quantity} x {it.productName}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                        {clientOrders.length === 0 && (
                          <p className="text-xs text-gray-400 py-6 text-center italic">No client orders recorded under your parameters.</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* ABOUT US STORE PAGE */}
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-4 py-16 space-y-10"
              id="view-about"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">Ayoola Essentials</span>
                <h2 className="font-serif text-4xl font-extrabold text-gray-900 tracking-tight">Our Company Story</h2>
                <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-2" />
              </div>

              <div className="space-y-6 text-sm text-gray-600 leading-relaxed font-light">
                <p>
                  Established with a profound appreciation for authentic luxury, <span className="font-bold text-gray-800">Ayoola Fashion & Essentials</span> was born to satisfy the Nigerian markets appetite for premium, tarnish-free gold accessories, hand-finished Italian leather bags, ergonomic luxury heels, and modern aesthetic culinary tools.
                </p>
                <p>
                  Our team sources exclusively from top-tier raw materials to guarantee unmatched quality. For us, fashion is not transient trends; it is structural beauty that acts as an extension of your stature and commands attention.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="bg-white border border-gray-100 p-6 rounded-2xl text-center space-y-2">
                  <h4 className="font-serif font-bold text-lg text-gray-900">Our Mission</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">To supply state-of-the-art luxury design accessories to every modern Nigerian home with unmatched convenience.</p>
                </div>
                <div className="bg-white border border-gray-100 p-6 rounded-2xl text-center space-y-2">
                  <h4 className="font-serif font-bold text-lg text-gray-900">Our Vision</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">To become the absolute benchmark of elite e-commerce across Africa, merging aesthetic elegance with fast delivery.</p>
                </div>
                <div className="bg-white border border-gray-100 p-6 rounded-2xl text-center space-y-2">
                  <h4 className="font-serif font-bold text-lg text-gray-900">Our Values</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">Authenticity, absolute structural trust, responsive support, and desktop-to-doorstep customer integrity.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* CONTACT US PAGE */}
          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10"
              id="view-contact"
            >
              <div>
                <h2 className="font-serif text-3xl font-bold text-gray-900">Contact Ayoola Luxury</h2>
                <p className="text-xs text-gray-400 mt-1">Get in touch with our elite support coordinates or write a custom message</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Contact Coordinates */}
                <div className="lg:col-span-5 bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-6">
                  <h3 className="font-serif text-lg font-bold text-gray-900">Executive Coordinates</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3.5 items-start">
                      <div className="p-2.5 bg-gold-50 text-gold-600 rounded-lg"><MapPin className="h-4.5 w-4.5" /></div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-gray-800">Flagship Studio Address</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-light mt-1">Plot Plot 24, 1st Avenue, Orere Abosan Estate, Awesu Area, Igbogbo</p>
                      </div>
                    </div>

                    <div className="flex gap-3.5 items-start">
                      <div className="p-2.5 bg-gold-50 text-gold-600 rounded-lg"><Phone className="h-4.5 w-4.5" /></div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-gray-800">Phone Support Line</h4>
                        <p className="text-xs text-gray-500 font-light mt-1">+234 816 832 5982</p>
                      </div>
                    </div>

                    <div className="flex gap-3.5 items-start">
                      <div className="p-2.5 bg-gold-50 text-gold-600 rounded-lg"><Mail className="h-4.5 w-4.5" /></div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-gray-800">Official Electronic Email</h4>
                        <p className="text-xs text-gray-500 font-light mt-1">Ayoolafashion@gmail.com</p>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Support Direct Button */}
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-emerald-800">Direct WhatsApp Link</p>
                    <p className="text-[11px] text-gray-500 font-light">Skip the email lines and chat instantly with our flagship sales representatives.</p>
                    <button
                      onClick={() => window.open('https://wa.me/2348168325982', '_blank')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider text-center cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Connect to WhatsApp support</span>
                    </button>
                  </div>
                </div>

                {/* Contact Message Form */}
                <div className="lg:col-span-7 bg-white border border-gray-100 p-6 rounded-2xl shadow-xs space-y-4">
                  <h3 className="font-serif text-lg font-bold text-gray-900">Corporate Inquiry Statement</h3>
                  
                  {contactSuccess && (
                    <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg font-medium">{contactSuccess}</p>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSuccess('Your corporate inquiry message has been submitted. A sales associate will reply shortly.');
                      setContactName('');
                      setContactEmail('');
                      setContactMsg('');
                      setTimeout(() => setContactSuccess(''), 4000);
                    }}
                    className="space-y-4"
                    id="contact-form-statement"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Your Name *</label>
                        <input
                          type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Email Address *</label>
                        <input
                          type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Message Detail *</label>
                      <textarea
                        required value={contactMsg} onChange={(e) => setContactMsg(e.target.value)}
                        rows={5}
                        placeholder="Detail your luxury inquiry parameters..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-gray-900 hover:bg-gold-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Transmit Message
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECURE ADMIN DASHBOARD VIEW */}
          {activeTab === 'admin' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              id="view-admin"
            >
              <AdminDashboard
                onBackToHome={() => handleNavigate('home')}
                onNavigateToProduct={handleViewProduct}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Brand Footer Section */}
      {activeTab !== 'admin' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Authentication registration/login modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authInitialTab}
      />

      {/* Sliding shopping cart drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => handleNavigate('checkout')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StorefrontContent />
    </AppProvider>
  );
}
