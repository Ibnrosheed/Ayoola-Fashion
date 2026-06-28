import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, RotateCcw, Headset } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onShopNow: () => void;
  onExploreCollections: () => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Elevate Your Style With Premium Fashion',
    subtitle: 'AYOOLA LUXURY COLLECTION',
    description: 'Discover curated designer leather bags, sleek high-heels, and tailored urban sneakers designed to turn heads.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'border-gold-500 text-gold-500'
  },
  {
    id: 2,
    title: 'Exquisite Details, Timeless Accents',
    subtitle: 'ELITE ACCESSORIES',
    description: 'Explore hypoallergenic 18K gold-plated jewelry sets, sapphire chronograph watches, and premium Italian saffiano leather wallets.',
    image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'border-royal-500 text-royal-500'
  },
  {
    id: 3,
    title: 'Aesthetic Kitchen Culinary Accents',
    subtitle: 'AYOOLA HOME & ESSENTIALS',
    description: 'Transform your dining experience with tarnish-resistant matte gold cutlery sets and luxury rotating marble spice carousels.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'border-emerald-500 text-emerald-500'
  }
];

export default function Hero({ onShopNow, onExploreCollections }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto Scroll Slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div className="relative w-full overflow-hidden" id="homepage-hero-section">
      {/* Slider viewport */}
      <div className="relative h-[480px] md:h-[620px] w-full bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image overlay */}
            <div className="absolute inset-0 bg-black/55 z-10" />
            <img
              src={HERO_SLIDES[currentSlide].image}
              alt="Fashion Banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />

            {/* Slider Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-white">
                  {/* Category Accent */}
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs md:text-sm font-display uppercase tracking-[0.35em] text-gold-500 font-bold mb-3"
                  >
                    {HERO_SLIDES[currentSlide].subtitle}
                  </motion.p>

                  {/* Primary Heading */}
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="font-serif text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4"
                  >
                    {HERO_SLIDES[currentSlide].title}
                  </motion.h2>

                  {/* Description Paragraph */}
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-lg mb-8 font-light"
                  >
                    {HERO_SLIDES[currentSlide].description}
                  </motion.p>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-4"
                  >
                    <button
                      onClick={onShopNow}
                      className="px-6 py-3.5 bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      id="hero-shop-now-btn"
                    >
                      <span>Shop the Catalog</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={onExploreCollections}
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-xl border border-white/25 backdrop-blur-xs transition-all cursor-pointer"
                      id="hero-explore-btn"
                    >
                      Explore Collections
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Manual Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-35 p-2 bg-black/25 hover:bg-black/50 text-white rounded-full transition-all backdrop-blur-xs border border-white/10 cursor-pointer hidden md:block"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-35 p-2 bg-black/25 hover:bg-black/50 text-white rounded-full transition-all backdrop-blur-xs border border-white/10 cursor-pointer hidden md:block"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-35 flex gap-2.5">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 transition-all rounded-full ${
                currentSlide === idx ? 'w-8 bg-gold-500' : 'w-2 bg-white/40'
              } cursor-pointer`}
            />
          ))}
        </div>
      </div>

      {/* Brand Value Strengths Indicator bar */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3.5" id="val-shipping">
              <div className="p-3 bg-gold-50 text-gold-600 rounded-full">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Fast Nationwide Delivery</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Reliable dispatch straight to your doorstep across Nigeria.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5" id="val-security">
              <div className="p-3 bg-gold-50 text-gold-600 rounded-full">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Secured Paystack Payment</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Shop with complete peace of mind using your card or transfer.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5" id="val-returns">
              <div className="p-3 bg-gold-50 text-gold-600 rounded-full">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Guaranteed Quality</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Only premium luxury products sourced from the finest origins.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3.5" id="val-support">
              <div className="p-3 bg-gold-50 text-gold-600 rounded-full">
                <Headset className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">24/7 WhatsApp Support</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Need help? Connect instantly with our dedicated customer agents.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
