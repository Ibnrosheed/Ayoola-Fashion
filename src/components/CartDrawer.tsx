import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Ticket, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { cart, updateCartQty, removeFromCart, coupons, currentUser } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) return;

    const matched = coupons.find((c) => c.code === trimmed && c.active);
    if (!matched) {
      setCouponError('Invalid or expired coupon code.');
      setActiveCoupon(null);
      return;
    }

    if (matched.minOrderAmount && subtotal < matched.minOrderAmount) {
      setCouponError(`Minimum order of ₦${matched.minOrderAmount.toLocaleString()} required.`);
      setActiveCoupon(null);
      return;
    }

    setActiveCoupon(matched);
    let discAmt = 0;
    if (matched.discountType === 'percentage') {
      discAmt = (subtotal * matched.discountValue) / 100;
      setCouponSuccess(`Applied: ${matched.discountValue}% Off (₦${discAmt.toLocaleString()})`);
    } else {
      discAmt = matched.discountValue;
      setCouponSuccess(`Applied: ₦${discAmt.toLocaleString()} Off`);
    }
  };

  const discountAmount = activeCoupon
    ? activeCoupon.discountType === 'percentage'
      ? (subtotal * activeCoupon.discountValue) / 100
      : activeCoupon.discountValue
    : 0;

  const total = Math.max(0, subtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} id="cart-drawer-overlay" />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-screen max-w-md bg-white flex flex-col shadow-2xl border-l border-gray-100"
          id="cart-drawer-container"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gold-600" />
              <h2 className="font-serif text-lg font-bold text-gray-900">Your Luxury Cart</h2>
              <span className="text-xs bg-gray-900 text-white font-mono px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              id="cart-drawer-close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6" id="cart-drawer-items-list">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="bg-gray-50 p-6 rounded-full text-gray-300">
                  <ShoppingBag className="h-16 w-16 stroke-1" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-800">Your cart is empty</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">Explore our curated catalog of elite shoes, premium bags, and home accessories to elevate your style.</p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gold-500 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.product.discountPrice || item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-none group"
                  >
                    {/* Image */}
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Description */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between gap-1">
                          <h4 className="text-xs font-bold text-gray-900 tracking-tight line-clamp-1">{item.product.name}</h4>
                          <span className="text-xs font-mono font-bold text-gray-900 shrink-0">
                            ₦{(itemPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">{item.product.brand}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-bold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50/60 p-6 space-y-4" id="cart-drawer-footer">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="ENTER COUPON (e.g. AYOOLA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-gold-500 uppercase tracking-wider"
                    id="cart-coupon-input"
                  />
                  <Ticket className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 hover:bg-gold-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  id="cart-coupon-submit"
                >
                  Apply
                </button>
              </form>

              {/* Coupon Feedback Alerts */}
              {couponError && (
                <div className="flex items-center gap-1.5 text-[10px] text-red-600 font-medium" id="cart-coupon-error">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{couponError}</span>
                </div>
              )}
              {couponSuccess && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium" id="cart-coupon-success">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  <span>{couponSuccess}</span>
                </div>
              )}

              {/* Summary calculations */}
              <div className="space-y-2 border-b border-gray-100 pb-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Cart Subtotal</span>
                  <span className="font-mono font-medium">₦{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span className="font-mono">- ₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Shipping Fee</span>
                  <span className="italic">Calculated at Checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-serif font-bold text-gray-900">Estimated Total</span>
                <span className="text-xl font-mono font-black text-gray-900">
                  ₦{total.toLocaleString()}
                </span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {currentUser?.isAdmin ? (
                  <div className="text-center p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl font-medium leading-relaxed">
                    ⚠️ Administrative accounts cannot buy or purchase products. Please log in with a customer account to checkout.
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onCheckout();
                    }}
                    className="w-full py-3.5 bg-gray-900 hover:bg-gold-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    id="cart-checkout-btn"
                  >
                    <span>Proceed to Checkout</span>
                    <X className="h-3.5 w-3.5 rotate-45" />
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-white text-gray-500 hover:text-gray-800 text-xs font-semibold text-center hover:underline cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
