import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Facebook, Instagram, Phone, Mail, MapPin, Clock, ArrowRight, Loader } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { subscribeNewsletter } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = subscribeNewsletter(email);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setEmail('');
      } else {
        setErrorMsg(res.message);
      }
    }, 1000);
  };

  return (
    <footer className="bg-gray-950 text-white border-t border-gold-500/10 pt-16 pb-8" id="brand-footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Signup Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-gray-900 items-center">
          <div className="lg:col-span-5 space-y-2">
            <h3 className="font-serif text-2xl font-bold tracking-tight">Join The Ayoola Elite Circle</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Subscribe to receive private collection arrivals, premium runway inspirations, and exclusive 10% coupon codes directly in your inbox.
            </p>
          </div>
          <div className="lg:col-span-7">
            <form onSubmit={handleSubscribe} className="relative flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="ENTER YOUR EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#0d1523] border border-gray-800 focus:border-gold-500 rounded-xl px-4 py-3.5 text-xs text-gray-200 tracking-wider uppercase focus:outline-none focus:ring-1 focus:ring-gold-500"
                id="footer-newsletter-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                id="footer-newsletter-submit"
              >
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <span>Subscribe</span>}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
            {successMsg && (
              <p className="text-[10px] text-emerald-400 font-semibold mt-2.5 animate-pulse" id="footer-newsletter-success">{successMsg}</p>
            )}
            {errorMsg && (
              <p className="text-[10px] text-red-500 font-semibold mt-2.5" id="footer-newsletter-error">{errorMsg}</p>
            )}
          </div>
        </div>

        {/* Footer Navigation Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 py-12 border-b border-gray-900 text-xs text-gray-400">
          
          {/* Logo & Info column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-white tracking-tight leading-none">Ayoola</span>
              <span className="text-[8px] tracking-[0.2em] uppercase font-display text-gold-500 font-bold leading-none mt-1">Fashion & Essentials</span>
            </div>
            <p className="font-light leading-relaxed">
              We specialize in bringing tarnish-free gold accessories, premium full-grain leather bags, ergonomic high-fashion footwear, and modern aesthetic kitchen essentials to the Nigerian luxury market.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 pt-1">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-900 hover:bg-gold-500 hover:text-white rounded-full transition-all text-gray-400">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-900 hover:bg-gold-500 hover:text-white rounded-full transition-all text-gray-400">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-900 hover:bg-gold-500 hover:text-white rounded-full transition-all text-gray-400" aria-label="X (formerly Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white uppercase tracking-wider font-bold text-[10px]">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('home')} className="hover:text-gold-500 transition-colors cursor-pointer text-left">Home storefront</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-gold-500 transition-colors cursor-pointer text-left">Browse All Products</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-gold-500 transition-colors cursor-pointer text-left">Our Company Story</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-gold-500 transition-colors cursor-pointer text-left">Get In Touch</button></li>
              <li><button onClick={() => onNavigate('admin')} className="hover:text-gold-500 font-semibold transition-colors cursor-pointer text-left">Executive Backoffice</button></li>
            </ul>
          </div>

          {/* Luxury Categories Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white uppercase tracking-wider font-bold text-[10px]">Categories</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('shop')} className="hover:text-gold-500 transition-colors cursor-pointer text-left">Bags & Clutches</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-gold-500 transition-colors cursor-pointer text-left">Heels & Loafers</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-gold-500 transition-colors cursor-pointer text-left">Streetwear Sneakers</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-gold-500 transition-colors cursor-pointer text-left">Men\'s Accessories</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-gold-500 transition-colors cursor-pointer text-left">Kitchen & Culinary</button></li>
            </ul>
          </div>

          {/* Brand Contact Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-white uppercase tracking-wider font-bold text-[10px]">Contact Information</h4>
            <ul className="space-y-2.5">
              <li className="flex gap-2 items-start">
                <MapPin className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                <span>Plot Plot 24, 1st Avenue, Orere Abosan Estate, Awesu Area, Igbogbo</span>
              </li>
              <li className="flex gap-2 items-start">
                <Phone className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                <span className="font-mono">+234 816 832 5982</span>
              </li>
              <li className="flex gap-2 items-start">
                <Mail className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                <span className="font-mono">Ayoolafashion@gmail.com</span>
              </li>
              <li className="flex gap-2 items-start">
                <Clock className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal & Compliance Footer Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-[11px] text-gray-500 font-light">
          <div>
            <p>© 2026 Ayoola Fashion & Essentials. Handcrafted with Premium Elegance.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-gold-500 cursor-pointer">Privacy Policy</button>
            <button onClick={() => onNavigate('about')} className="hover:text-gold-500 cursor-pointer">Terms & Conditions</button>
            <button onClick={() => onNavigate('about')} className="hover:text-gold-500 cursor-pointer">Refund & Return Policy</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
