import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (slug: string) => void;
  key?: string;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist, currentUser } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const isLiked = wishlist.includes(product.id);
  const currentPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg transition-all relative group flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product.slug)}
      id={`product-card-${product.id}`}
    >
      {/* Badge Tags (Discount, New, Selling Fast) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent && (
          <span className="bg-red-500 text-white font-mono font-bold text-[10px] tracking-wide px-2.5 py-1 rounded-md uppercase shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-gray-900 text-white font-sans font-semibold text-[9px] tracking-widest px-2.5 py-1 rounded-md uppercase shadow-sm border border-gold-500/20">
            NEW
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="bg-amber-500 text-slate-950 font-sans font-bold text-[9px] tracking-wide px-2 py-0.5 rounded-md uppercase">
            Only {product.stock} Left
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-gray-400 text-white font-sans font-bold text-[9px] tracking-wide px-2 py-0.5 rounded-md uppercase">
            SOLD OUT
          </span>
        )}
      </div>

      {/* Quick Actions (Wishlist floating button) */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
        title="Save to Wishlist"
        id={`product-wishlist-btn-${product.id}`}
      >
        <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Product Image Container */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden cursor-pointer">
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-all duration-700 ease-out"
        />

        {/* Hover quick actions bar */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 justify-center z-10">
          {(!currentUser?.isAdmin || currentUser?.isSuperAdmin) ? (
            <>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  product.stock === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-900 hover:bg-gold-500 hover:text-white'
                }`}
                id={`product-quick-add-${product.id}`}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => onViewDetails(product.slug)}
                className="p-2 bg-white/20 hover:bg-white text-white hover:text-gray-900 rounded-lg backdrop-blur-xs transition-colors cursor-pointer"
                title="Quick View"
              >
                <Eye className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onViewDetails(product.slug)}
              className="w-full py-2.5 bg-white text-gray-900 hover:bg-gold-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              <span>View Product Details</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand */}
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-1">
          {product.brand || 'Ayoola Fashion'}
        </p>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(product.slug)}
          className="font-serif text-sm font-bold text-gray-800 tracking-tight cursor-pointer hover:text-gold-600 transition-colors line-clamp-2 min-h-[40px] flex-1 mb-2"
        >
          {product.name}
        </h3>

        {/* Rating stars */}
        <div className="flex items-center gap-1 mb-2.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-gray-500 font-bold">
            ({product.reviewsCount || 0})
          </span>
        </div>

        {/* Price Tag */}
        <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-gray-50">
          <span className="font-mono font-black text-sm text-gray-900">
            ₦{currentPrice.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="font-mono text-xs text-gray-400 line-through">
              ₦{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
