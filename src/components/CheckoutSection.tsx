import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SHIPPING_LOCATIONS } from '../data/products';
import { ShieldCheck, Truck, ArrowLeft, Loader2, Landmark, DollarSign, Wallet } from 'lucide-react';
import PaystackPayment from './PaystackPayment';
import { motion } from 'motion/react';

interface CheckoutSectionProps {
  onBackToCart: () => void;
  onOrderComplete: (orderId: string) => void;
}

export default function CheckoutSection({ onBackToCart, onOrderComplete }: CheckoutSectionProps) {
  const { cart, coupons, payOnDeliveryEnabled, createOrder } = useApp();

  // Customer input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedState, setSelectedState] = useState(SHIPPING_LOCATIONS[0].state);
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'delivery'>('paystack');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Payment process loaders
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [isSubmittingPOD, setIsSubmittingPOD] = useState(false);

  // Math Calculations
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

  const currentShipping = SHIPPING_LOCATIONS.find((loc) => loc.state === selectedState);
  const shippingFee = currentShipping ? currentShipping.fee : 1500;

  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      alert('Please fill out all required shipping fields.');
      return;
    }

    if (paymentMethod === 'paystack') {
      setIsPaystackOpen(true);
    } else {
      // Pay on Delivery execution
      setIsSubmittingPOD(true);

      setTimeout(() => {
        const orderItems = cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          image: item.product.images[0]
        }));

        const newOrder = createOrder({
          customerName: name,
          email,
          phone,
          address,
          state: selectedState,
          city,
          items: orderItems,
          subtotal,
          shippingFee,
          discount: discountAmount,
          total,
          paymentMethod: 'delivery',
          notes
        });

        setIsSubmittingPOD(false);
        onOrderComplete(newOrder.id);

        // Redirect to WhatsApp for POD
        const waNumber = '2348168325982';
        const message = `Hello Ayoola Fashion & Essentials,
I have placed an order (Pay on Delivery):
Order ID: ${newOrder.id}
Customer Name: ${name}
Amount: ₦${total.toLocaleString()}
Delivery Address: ${address}, ${city}, ${selectedState}

Kindly confirm my order and arrange delivery.
Thank you.`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
        window.open(waUrl, '_blank');
      }, 1500);
    }
  };

  const handlePaystackSuccess = (paystackOrderId: string) => {
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.discountPrice || item.product.price,
      quantity: item.quantity,
      image: item.product.images[0]
    }));

    createOrder({
      customerName: name,
      email,
      phone,
      address,
      state: selectedState,
      city,
      items: orderItems,
      subtotal,
      shippingFee,
      discount: discountAmount,
      total,
      paymentMethod: 'paystack',
      paymentId: 'pay_' + Date.now(),
      notes
    });

    setIsPaystackOpen(false);
    onOrderComplete(paystackOrderId);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h3 className="font-serif text-xl font-bold text-gray-800">Your cart is empty</h3>
        <p className="text-xs text-gray-400 mt-2">Add some stunning fashion pieces first to checkout!</p>
        <button
          onClick={onBackToCart}
          className="px-6 py-2.5 bg-gray-900 hover:bg-gold-500 text-white font-semibold text-xs rounded-lg mt-6"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="checkout-section-root">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={onBackToCart}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          id="checkout-back-btn"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Secure Checkout</h2>
          <p className="text-xs text-gray-400">Complete your shipping and payment verification parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Shipping Address Form & Payments */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handlePlaceOrder} className="space-y-6" id="checkout-shipping-form">
            {/* Shipping Info Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
                <Truck className="h-5 w-5 text-gold-500" />
                <span>Shipping & Delivery Coordinates</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your first & last name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 text-gray-800"
                    id="checkout-input-name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 08168325982"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 text-gray-800"
                    id="checkout-input-phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 text-gray-800"
                  id="checkout-input-email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                  Delivery Home / Office Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, flat / house number, area"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 text-gray-800"
                  id="checkout-input-address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                    State (Nigeria) *
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 text-gray-800"
                    id="checkout-input-state"
                  >
                    {SHIPPING_LOCATIONS.map((loc) => (
                      <option key={loc.state} value={loc.state}>
                        {loc.state} (₦{loc.fee.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 text-gray-800"
                    id="checkout-input-city"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                  Special Notes / Delivery Instructions (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gate code, landmark, secure packaging guidelines..."
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 text-gray-800"
                  id="checkout-input-notes"
                />
              </div>
            </div>

            {/* Payment Methods selector */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold-500" />
                <span>Secured Payment Configuration</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Paystack */}
                <div
                  onClick={() => setPaymentMethod('paystack')}
                  className={`p-4 rounded-xl border-2 flex items-start gap-3.5 cursor-pointer select-none transition-all ${
                    paymentMethod === 'paystack'
                      ? 'border-gold-500 bg-gold-50/20'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                  id="pay-choice-paystack"
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'paystack' ? 'bg-gold-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">Paystack Secure Checkout</p>
                    <p className="text-[10px] text-gray-400 mt-1">Instant authorization using Card, Bank transfer, or USSD code.</p>
                  </div>
                </div>

                {/* Pay on Delivery */}
                <div
                  onClick={() => payOnDeliveryEnabled && setPaymentMethod('delivery')}
                  className={`p-4 rounded-xl border-2 flex items-start gap-3.5 select-none transition-all ${
                    !payOnDeliveryEnabled
                      ? 'opacity-40 cursor-not-allowed border-gray-50 bg-gray-50/50'
                      : paymentMethod === 'delivery'
                      ? 'border-gold-500 bg-gold-50/20 cursor-pointer'
                      : 'border-gray-100 hover:border-gray-200 cursor-pointer'
                  }`}
                  id="pay-choice-pod"
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'delivery' ? 'bg-gold-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-gray-900">Pay On Delivery (POD)</p>
                      {!payOnDeliveryEnabled && (
                        <span className="text-[8px] bg-red-100 text-red-600 font-semibold px-1 rounded">Disabled</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Make cash/POS payment only when our dispatcher arrives at your doorstep.</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingPOD}
                className="w-full py-4 mt-2 bg-gray-900 hover:bg-gold-500 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                id="checkout-submit-btn"
              >
                {isSubmittingPOD ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Processing POD Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Process Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Order Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs sticky top-28 space-y-4">
            <h3 className="font-serif text-lg font-bold text-gray-900 border-b border-gray-50 pb-2">
              Order Review
            </h3>

            {/* Cart products list */}
            <div className="max-h-52 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {cart.map((item) => {
                const itemPrice = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.product.id} className="flex gap-3 items-center text-xs">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity} x ₦{itemPrice.toLocaleString()}</p>
                    </div>
                    <span className="font-mono font-bold text-gray-800">
                      ₦{(itemPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupon Application Box */}
            <div className="border-t border-b border-gray-50 py-3 space-y-2">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="COUPON CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-gold-500 uppercase tracking-wider"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gray-900 hover:bg-gold-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {couponError && (
                <p className="text-[10px] text-red-600 font-semibold">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-[10px] text-emerald-600 font-semibold">{couponSuccess}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-mono">₦{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span className="font-mono">- ₦{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping Fee ({selectedState.split(' (')[0]})</span>
                <span className="font-mono">₦{shippingFee.toLocaleString()}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
              <span className="text-sm font-serif font-black text-gray-900">Grand Total</span>
              <span className="text-xl font-mono font-black text-gray-900">
                ₦{total.toLocaleString()}
              </span>
            </div>

            <div className="bg-gold-50/40 p-3 rounded-xl border border-gold-200/40 text-[10px] text-gold-800 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-gold-600 shrink-0 mt-0.5" />
              <span>
                Your data is processed under absolute end-to-end security parameters. Shipping confirmation is synchronously wired directly onto WhatsApp.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Paystack Sim Gateway Modal */}
      <PaystackPayment
        isOpen={isPaystackOpen}
        onClose={() => setIsPaystackOpen(false)}
        customerData={{ name, email, phone, address, state: selectedState, city, notes }}
        cartItems={cart}
        subtotal={subtotal}
        shippingFee={shippingFee}
        discount={discountAmount}
        total={total}
        onSuccess={handlePaystackSuccess}
      />
    </div>
  );
}
