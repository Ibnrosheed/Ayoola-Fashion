import React, { useState, useEffect } from 'react';
import { Shield, CreditCard, Landmark, Phone, Smartphone, Loader, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaystackPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    state: string;
    city: string;
    notes?: string;
  };
  cartItems: any[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  onSuccess: (orderId: string) => void;
}

export default function PaystackPayment({
  isOpen,
  onClose,
  customerData,
  cartItems,
  subtotal,
  shippingFee,
  discount,
  total,
  onSuccess
}: PaystackPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [loaderMessage, setLoaderMessage] = useState('Initializing Secure Connection...');
  const [orderId, setOrderId] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (step === 'processing') {
      const messages = [
        { text: 'Securing transaction layer...', time: 1000 },
        { text: 'Contacting card issuer...', time: 2000 },
        { text: 'Verifying anti-fraud metrics...', time: 3500 },
        { text: 'Authorizing amount ₦' + total.toLocaleString() + '...', time: 5000 },
        { text: 'Finalizing payment confirmation...', time: 6500 }
      ];

      messages.forEach((msg) => {
        setTimeout(() => {
          setLoaderMessage(msg.text);
        }, msg.time);
      });

      const successTimer = setTimeout(() => {
        // Generate random Order ID and switch to success
        const genId = 'AYO-' + Math.floor(100000 + Math.random() * 900000);
        setOrderId(genId);
        setStep('success');
      }, 7500);

      return () => clearTimeout(successTimer);
    }
  }, [step, total]);

  // Handle successful state and WhatsApp redirection
  useEffect(() => {
    if (step === 'success' && orderId) {
      onSuccess(orderId); // Call callback to trigger parent order saving

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            redirectToWhatsApp(orderId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, orderId]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim()
      .slice(0, 19);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value
      .replace(/\D/g, '')
      .replace(/(.{2})/, '$1/')
      .trim()
      .slice(0, 5);
    setExpiry(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(val);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
  };

  const redirectToWhatsApp = (id: string) => {
    const waNumber = '2348168325982';
    const message = `Hello Ayoola Fashion & Essentials,
I have made payment for the following products:
Order ID: ${id}
Customer Name: ${customerData.name}
Amount Paid: ₦${total.toLocaleString()}

Kindly confirm my payment and get back to me.
Thank you.`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" onClick={() => step !== 'processing' && onClose()} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-lg bg-[#0e1726] rounded-3xl overflow-hidden shadow-2xl z-10 border border-emerald-900/40 text-white"
        id="paystack-modal-container"
      >
        {/* Paystack Header style */}
        <div className="bg-[#14233c] p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-slate-900 p-1.5 rounded-full font-bold text-xs tracking-wider">
              P
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-200">PAYSTACK SECURED GATEWAY</h3>
              <p className="text-[10px] text-gray-400">Merchant: Ayoola Fashion & Essentials</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400">Total Amount</p>
            <p className="font-mono text-lg font-bold text-emerald-400">₦{total.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
                id="paystack-form-step"
              >
                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-gray-800 hover:border-gray-700 text-gray-400'
                    }`}
                    id="pay-method-card"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-[11px] font-medium">Pay with Card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'bank'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-gray-800 hover:border-gray-700 text-gray-400'
                    }`}
                    id="pay-method-bank"
                  >
                    <Landmark className="h-5 w-5" />
                    <span className="text-[11px] font-medium">Bank Transfer</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('ussd')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'ussd'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-gray-800 hover:border-gray-700 text-gray-400'
                    }`}
                    id="pay-method-ussd"
                  >
                    <Smartphone className="h-5 w-5" />
                    <span className="text-[11px] font-medium">USSD Code</span>
                  </button>
                </div>

                <form onSubmit={handlePay} className="space-y-4" id="paystack-card-form">
                  {paymentMethod === 'card' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-semibold">
                          Cardholder Email
                        </label>
                        <input
                          type="email"
                          disabled
                          value={customerData.email}
                          className="w-full bg-[#18263e] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-semibold">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="4012 8831 9904 5532"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="w-full bg-[#18263e] border border-gray-800 rounded-xl pl-4 pr-10 py-3 text-sm text-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            id="paystack-card-num"
                          />
                          <div className="absolute right-3.5 top-3.5">
                            <CreditCard className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-semibold">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={handleExpiryChange}
                            className="w-full bg-[#18263e] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-center"
                            id="paystack-card-expiry"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-semibold">
                            CVV
                          </label>
                          <div className="relative">
                            <input
                              type={showCvv ? 'text' : 'password'}
                              required
                              placeholder="•••"
                              value={cvv}
                              onChange={handleCvvChange}
                              className="w-full bg-[#18263e] border border-gray-800 rounded-xl pl-4 pr-10 py-3 text-sm text-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-center tracking-widest font-mono"
                              id="paystack-card-cvv"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCvv(!showCvv)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 cursor-pointer"
                              aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                            >
                              {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : paymentMethod === 'bank' ? (
                    <div className="p-4 rounded-2xl bg-[#18263e] border border-gray-800 space-y-4">
                      <div className="text-center py-2 border-b border-gray-800">
                        <p className="text-xs text-emerald-400 font-semibold mb-1">PROMPT BANK TRANSFER</p>
                        <p className="text-[11px] text-gray-400">Transfer exactly the total amount to the account below</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Bank Name</span>
                          <span className="font-semibold text-gray-200">Titan Trust Bank (Paystack)</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Account Number</span>
                          <span className="font-mono font-bold text-emerald-400">9903254189</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Beneficiary</span>
                          <span className="font-semibold text-gray-200">Ayoola Fashion Stores</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-center text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        The system monitors this transfer automatically. Proceeding will simulate verification.
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#18263e] border border-gray-800 space-y-4 text-center">
                      <p className="text-xs text-gray-300">Dial the code below from your registered mobile phone:</p>
                      <p className="font-mono font-bold text-2xl text-emerald-400 py-3 bg-[#111c2e] rounded-xl border border-gray-800">
                        *737*1*9*₦{total.toLocaleString()}#
                      </p>
                      <p className="text-[10px] text-gray-500">Supports GTBank, Access, Zenith, and Sterling bank lines.</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[11px] text-gray-400 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-emerald-500" />
                      <span>SECURED BY PAYSTACK</span>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel Payment
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-sm tracking-wider rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    id="paystack-confirm-pay"
                  >
                    <span>Authorize Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12 text-center"
                id="paystack-processing-step"
              >
                <div className="relative mb-6">
                  <Loader className="h-14 w-14 text-emerald-500 animate-spin" />
                  <Shield className="h-6 w-6 text-emerald-300 absolute inset-0 m-auto animate-pulse" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Processing Transaction</h3>
                <p className="text-xs text-gray-400 max-w-xs">{loaderMessage}</p>
                <div className="w-48 bg-gray-800 h-1.5 rounded-full mt-6 overflow-hidden">
                  <div className="bg-emerald-500 h-full animate-progress rounded-full" />
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
                id="paystack-success-step"
              >
                <div className="bg-emerald-500/15 p-4 rounded-full border border-emerald-500/30 mb-4 animate-bounce">
                  <CheckCircle2 className="h-16 w-16 text-emerald-400" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-1">Payment Successful!</h3>
                <p className="text-xs text-gray-400">Order ID: <span className="font-mono text-emerald-400 font-semibold">{orderId}</span></p>
                
                <div className="my-6 p-4 rounded-xl bg-[#18263e] border border-gray-800 text-left w-full max-w-sm space-y-2">
                  <p className="text-xs text-gray-300 font-semibold border-b border-gray-800 pb-1.5">Order Invoice Confirmation</p>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Customer</span>
                    <span className="text-gray-200">{customerData.name}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Amount Paid</span>
                    <span className="text-emerald-400 font-semibold">₦{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-400">Channel</span>
                    <span className="text-gray-200 capitalize">Paystack ({paymentMethod})</span>
                  </div>
                </div>

                <div className="text-xs text-emerald-400 max-w-xs bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 mb-6 animate-pulse">
                  Redirecting to WhatsApp to complete your shipment validation in <span className="font-bold font-mono text-sm">{countdown}</span> seconds...
                </div>

                <button
                  onClick={() => redirectToWhatsApp(orderId)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  id="paystack-whatsapp-manual-btn"
                >
                  <span>Connect to WhatsApp Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
