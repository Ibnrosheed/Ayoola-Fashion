import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Heart, User, Menu, X, ChevronDown, LogOut, ShieldAlert, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onNavigate: (tab: string, arg?: any) => void;
  activeTab: string;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onOpenCart: () => void;
}

export default function Navbar({ onNavigate, activeTab, onOpenAuth, onOpenCart }: NavbarProps) {
  const { cart, wishlist, currentUser, logout } = useApp();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Monitor Scroll for Sticky Header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', { search: searchQuery });
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { label: 'Home', tab: 'home' },
    { label: 'Shop All', tab: 'shop' },
    { label: 'About Us', tab: 'about' },
    { label: 'Contact Us', tab: 'contact' }
  ];

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Top Banner Promotion */}
      <div className="bg-gray-950 text-white py-1.5 px-4 text-center text-[10px] md:text-xs font-display tracking-widest font-medium border-b border-gold-500/20">
        ✨ FREE SHIPPING IN LAGOS ON ORDERS ABOVE ₦35,000 | USE COUPON <span className="text-gold-500 font-bold">AYOOLA10</span>
      </div>

      <header
        className={`w-full z-40 transition-all duration-300 ${
          isSticky
            ? 'sticky top-0 bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-gray-100'
            : 'relative bg-white py-5 border-b border-gray-50'
        }`}
        id="app-navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-700 hover:text-gold-600 p-1.5 cursor-pointer"
                id="mobile-menu-open-btn"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <div
              onClick={() => onNavigate('home')}
              className="flex flex-col items-center justify-center cursor-pointer select-none group"
              id="navbar-logo"
            >
              <h1 className="font-serif text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none group-hover:text-gold-600 transition-colors">
                Ayoola
              </h1>
              <p className="text-[8px] md:text-[9px] tracking-[0.25em] uppercase font-display text-gold-500 font-bold leading-none mt-1">
                Fashion & Essentials
              </p>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8" id="desktop-nav-links">
              {navItems.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => onNavigate(item.tab)}
                  className={`text-xs font-display uppercase tracking-widest font-semibold transition-all hover:text-gold-500 py-1 cursor-pointer relative ${
                    activeTab === item.tab ? 'text-gold-600' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                  {activeTab === item.tab && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Navigation Icons (Search, Wishlist, User, Cart) */}
            <div className="flex items-center gap-1.5 md:gap-3.5" id="navbar-icons-group">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-gold-500 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                title="Search Products"
                id="search-toggle-btn"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => onNavigate('wishlist')}
                className="p-2 text-gray-600 hover:text-gold-500 rounded-full hover:bg-gray-50 transition-colors cursor-pointer relative"
                title="View Wishlist"
                id="wishlist-nav-btn"
              >
                <Heart className={`h-5 w-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* User Account / Auth Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (currentUser) {
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                    } else {
                      onOpenAuth('login');
                    }
                  }}
                  className="p-2 text-gray-600 hover:text-gold-500 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-1 cursor-pointer"
                  title="My Account"
                  id="user-account-btn"
                >
                  <User className="h-5 w-5" />
                  {currentUser && (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden md:block" />
                  )}
                </button>

                {/* Account Dropdown */}
                <AnimatePresence>
                  {currentUser && isUserDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2.5 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 text-gray-800"
                        id="user-dropdown-container"
                      >
                        <div className="px-4 py-2.5 border-b border-gray-50 bg-gray-50/50">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Signed in as</p>
                          <p className="text-sm font-bold text-gray-800 truncate">{currentUser.name}</p>
                          <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                        </div>

                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-gold-50 hover:text-gold-700 transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile & Orders</span>
                        </button>

                        {currentUser.isAdmin && (
                          <button
                            onClick={() => {
                              onNavigate('admin');
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs bg-gold-50 text-gold-700 hover:bg-gold-100 font-semibold transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <ShieldAlert className="h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </button>
                        )}

                        <div className="border-t border-gray-50 my-1" />

                        <button
                          onClick={() => {
                            logout();
                            setIsUserDropdownOpen(false);
                            onNavigate('home');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Toggle */}
              <button
                onClick={onOpenCart}
                className="p-2 text-gray-900 bg-gray-900 hover:bg-gold-500 text-white rounded-full transition-all flex items-center justify-center relative cursor-pointer shadow-md hover:shadow-lg"
                title="Open Cart"
                id="cart-nav-btn"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-500 text-white font-mono font-bold text-[9px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Search Overlay Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-50 border-b border-gray-100 overflow-hidden"
              id="search-bar-container"
            >
              <div className="max-w-4xl mx-auto px-4 py-4">
                <form onSubmit={handleSearchSubmit} className="relative flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search premium bags, sneakers, shoes, accessories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                      id="search-input-field"
                      autoFocus
                    />
                    <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-gray-400" />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gray-900 text-white font-semibold text-xs tracking-wider uppercase rounded-xl hover:bg-gold-500 transition-colors cursor-pointer"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 flex flex-col shadow-2xl"
              id="mobile-drawer-container"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold tracking-tight text-gray-900">Ayoola</span>
                  <span className="text-[7px] tracking-[0.2em] uppercase font-display text-gold-500 font-bold">Fashion & Essentials</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  id="mobile-menu-close-btn"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                <nav className="flex flex-col gap-5">
                  {navItems.map((item) => (
                    <button
                      key={item.tab}
                      onClick={() => {
                        onNavigate(item.tab);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left text-sm uppercase tracking-widest font-semibold pb-1 border-b border-gray-50 cursor-pointer ${
                        activeTab === item.tab ? 'text-gold-600' : 'text-gray-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {currentUser ? (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest">Active User</p>
                    <p className="text-xs font-bold text-gray-800">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-500">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    My Profile
                  </button>
                  {currentUser.isAdmin && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-center py-2 bg-gold-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      onNavigate('home');
                    }}
                    className="w-full py-2 text-red-600 text-xs font-semibold hover:bg-red-50 border border-red-200/55 rounded-lg cursor-pointer text-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="w-full py-2.5 bg-gray-100 text-gray-800 font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer text-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="w-full py-2.5 bg-gold-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer text-center"
                  >
                    Register
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
