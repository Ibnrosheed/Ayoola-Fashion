import { Product, Category, ShippingLocation } from '../types';

export const SHIPPING_LOCATIONS: ShippingLocation[] = [
  { state: 'Lagos State (Express)', fee: 1500 },
  { state: 'Lagos State (Standard)', fee: 1000 },
  { state: 'Abuja (FCT)', fee: 3500 },
  { state: 'Oyo State (Ibadan)', fee: 2000 },
  { state: 'Ogun State', fee: 2000 },
  { state: 'Rivers State (Port Harcourt)', fee: 3500 },
  { state: 'Enugu State', fee: 3000 },
  { state: 'Kano State', fee: 4000 },
  { state: 'Kaduna State', fee: 4000 },
  { state: 'Edo State (Benin)', fee: 3000 },
  { state: 'Anambra State', fee: 3000 },
  { state: 'Delta State', fee: 3500 },
  { state: 'Other Nigeria State Capital', fee: 4500 }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_bags',
    name: 'Bags',
    slug: 'bags',
    description: 'Elegant leather designer bags and clutches for every occasion.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat_shoes',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Luxury high heels, corporate shoes, and elegant loafers.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat_sneakers',
    name: 'Sneakers',
    slug: 'sneakers',
    description: 'Urban luxury streetwear sneakers and comfortable athletic kicks.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat_women',
    name: "Women's Accessories",
    slug: 'womens-accessories',
    description: 'Gold-plated jewelry, designer sunglasses, and premium silk scarves.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat_men',
    name: "Men's Accessories",
    slug: 'mens-accessories',
    description: 'Chrono watches, leather wallets, designer belts, and premium ties.',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cat_kitchen',
    name: 'Kitchen Accessories',
    slug: 'kitchen-accessories',
    description: 'Premium golden cutlery sets, aesthetic spice jars, and luxury cookware.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // BAGS
  {
    id: 'prod_bag_1',
    name: 'Aurelia Crimson Premium Handbag',
    slug: 'aurelia-crimson-handbag',
    categoryId: 'cat_bags',
    categorySlug: 'bags',
    brand: 'Ayoola Luxury',
    description: 'Handcrafted from fine Italian full-grain leather, the Aurelia Crimson Handbag is the ultimate fashion statement. Featuring a sleek gold-plated clasp and an adjustable shoulder strap, it transitions effortlessly from a busy day at the office to an elegant evening out. Inside is lined with premium micro-suede and features secure compartments.',
    price: 45000,
    discountPrice: 38500,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc15aae9?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Material: 100% Genuine Italian Leather',
      'Hardware: 24K Gold-plated Brass Clasp',
      'Dimensions: 28cm x 20cm x 12cm',
      'Origin: Handcrafted in Milan',
      'Interior: Red velvet lining with zippered pocket'
    ],
    rating: 4.8,
    isFeatured: true,
    isBestSeller: true,
    reviewsCount: 24
  },
  {
    id: 'prod_bag_2',
    name: 'Midnight Suede Luxury Shoulder Bag',
    slug: 'midnight-suede-shoulder-bag',
    categoryId: 'cat_bags',
    categorySlug: 'bags',
    brand: 'Ayoola Essentials',
    description: 'An elegant, tactile experience. Crafted from premium black suede with rich metallic chain details, this shoulder bag is as versatile as it is sophisticated. Magnetic double-flap closure keeps your essentials secure.',
    price: 35000,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Material: Genuine Suede and Polished Calfskin',
      'Hardware: Anthracite Nickel-plated Chain',
      'Dimensions: 25cm x 16cm x 8cm',
      'Closure: Dual Magnetic Snap Button'
    ],
    rating: 4.6,
    isNewArrival: true,
    reviewsCount: 15
  },
  {
    id: 'prod_bag_3',
    name: 'Sienna Croc-Effect Satchel',
    slug: 'sienna-croc-satchel',
    categoryId: 'cat_bags',
    categorySlug: 'bags',
    brand: 'Ayoola Elite',
    description: 'Timeless structural beauty. Features high-gloss embossed crocodile leather with structural golden handles. Perfect for the modern dynamic woman who commands attention in every room.',
    price: 48000,
    discountPrice: 42000,
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Material: Crocodile-embossed Calf Leather',
      'Hardware: Solid Brushed Brass Accent Handles',
      'Dimensions: 30cm x 22cm x 14cm',
      'Strap: Detachable, adjustable leather crossbody strap'
    ],
    rating: 4.9,
    isTrending: true,
    reviewsCount: 9
  },

  // SHOES
  {
    id: 'prod_shoe_1',
    name: 'D’Orsay Suede Aquamarine Pumps',
    slug: 'dorsay-suede-pumps',
    categoryId: 'cat_shoes',
    categorySlug: 'shoes',
    brand: 'Ayoola Footwear',
    description: 'Elevate your gait with the gorgeous Aquamarine Suede Pumps. Built with an ergonomic padded insole that delivers unparalleled comfort without compromising on structural height. Featuring a sharp pointed-toe silhouette and slim high-fashion stiletto heel.',
    price: 32000,
    discountPrice: 27500,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Heel Height: 10.5cm (4.1 inches)',
      'Material: Italian Goatskin Suede Upper',
      'Insole: Multi-layer Ortho Cushioning',
      'Sole: Genuine Anti-slip Leather Sole'
    ],
    rating: 4.7,
    isFeatured: true,
    isTrending: true,
    reviewsCount: 32
  },
  {
    id: 'prod_shoe_2',
    name: 'Regal Gold Velvet Slip-On Loafers',
    slug: 'regal-gold-velvet-loafers',
    categoryId: 'cat_shoes',
    categorySlug: 'shoes',
    brand: 'Ayoola Footwear',
    description: 'Ultimate luxury and effortless wearability. Lined in royal purple velvet with customized golden embroidery. Ideal for ceremonies, premium dining experiences, or formal lounge events.',
    price: 38000,
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Material: High-pile Embroidered Cotton Velvet',
      'Lining: Silk-blend Purple Satin',
      'Embroidered Detail: Royal Crest in Gold Wire Thread',
      'Sole: Stacked wooden block heel with rubber grip'
    ],
    rating: 4.5,
    isBestSeller: true,
    reviewsCount: 18
  },

  // SNEAKERS
  {
    id: 'prod_sneaker_1',
    name: 'Apex Tan Retro-Luxury Sneakers',
    slug: 'apex-tan-retro-sneakers',
    categoryId: 'cat_sneakers',
    categorySlug: 'sneakers',
    brand: 'Ayoola Street',
    description: 'Fusing athletic engineering with haute couture. This pair is crafted with contrasting panels of full-grain beige leather, sand suede, and breathable nylon. Complete with custom supportive TPU mid-soles for clouds-like strides.',
    price: 29500,
    discountPrice: 25000,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Materials: Calf Suede, Premium Nappa Leather, Performance mesh',
      'Lining: Absorbent French Terry loop cotton',
      'Sole: 100% vulcanized custom grip gum rubber',
      'Laces: Waxed flat cotton ropes'
    ],
    rating: 4.8,
    isFeatured: true,
    isNewArrival: true,
    reviewsCount: 41
  },
  {
    id: 'prod_sneaker_2',
    name: 'Neon Horizon High-Tops',
    slug: 'neon-horizon-high-tops',
    categoryId: 'cat_sneakers',
    categorySlug: 'sneakers',
    brand: 'Ayoola Street',
    description: 'Make a bold entrance in our Neon Horizon high-top sneakers. Built with dual ankle straps, breathable mesh netting, and contrasting reflective panels that glow under neon light settings.',
    price: 34000,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Structure: High-top basketball style ankle support',
      'Detailing: Reflective 3M details',
      'Sole: Responsive air bubble cushioning unit'
    ],
    rating: 4.4,
    reviewsCount: 12
  },

  // WOMEN'S ACCESSORIES
  {
    id: 'prod_women_acc_1',
    name: 'Elysian 18K Gold Jewelry Set',
    slug: 'elysian-gold-jewelry-set',
    categoryId: 'cat_women',
    categorySlug: 'womens-accessories',
    brand: 'Ayoola Jewelry',
    description: 'Add a sparkling halo of elegance to your attire. This coordinated set includes an organic drop-style gold pendant necklace and matching drop earrings. Perfectly styled to match gold thread lace gowns or silk slip dresses.',
    price: 18500,
    discountPrice: 15000,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Plating: Heavy 18-Karat Gold electroplating (3 microns)',
      'Base Metal: Hypoallergenic surgical grade stainless steel',
      'Stones: Premium high-clarity cubic zirconia accents',
      'Necklace Chain length: 45cm with 5cm extension'
    ],
    rating: 4.9,
    isFeatured: true,
    isBestSeller: true,
    reviewsCount: 64
  },
  {
    id: 'prod_women_acc_2',
    name: 'Siena Cat-Eye Polarized Sunglasses',
    slug: 'siena-cateye-sunglasses',
    categoryId: 'cat_women',
    categorySlug: 'womens-accessories',
    brand: 'Ayoola Elite',
    description: 'Elegance under the tropical sun. Crafted with thick tortoise-shell acetate frames and custom polarized bronze lenses that eliminate reflective glare completely while filtering out 100% of UVA and UVB radiation.',
    price: 12500,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Protection: 100% UV400 Protection',
      'Frame Material: Hand-polished Bio-acetate',
      'Lenses: Polarized scratch-resistant polycarbonate'
    ],
    rating: 4.6,
    isTrending: true,
    reviewsCount: 20
  },

  // MEN'S ACCESSORIES
  {
    id: 'prod_men_acc_1',
    name: 'Helios Chronograph Gold Mesh Watch',
    slug: 'helios-gold-chronograph-watch',
    categoryId: 'cat_men',
    categorySlug: 'mens-accessories',
    brand: 'Ayoola Horology',
    description: 'Engineering excellence meets luxury styling. Driven by a precise Japanese quartz chronograph movement, this timepiece features a striking deep obsidian face accented by brushed gold timers, and matches elegantly with a gold-mesh stainless steel strap.',
    price: 55000,
    discountPrice: 48000,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Movement: Seiko Premium Quartz Chronograph',
      'Dial Diameter: 42mm Case with Scratch-resistant Mineral Glass',
      'Water Resistance: 5 ATM (Up to 50 Meters / 165 Feet)',
      'Strap Material: Interwoven Milanese gold steel mesh strap'
    ],
    rating: 4.9,
    isFeatured: true,
    isTrending: true,
    reviewsCount: 19
  },
  {
    id: 'prod_men_acc_2',
    name: 'Vanguard Genuine Saffiano Wallet',
    slug: 'vanguard-saffiano-wallet',
    categoryId: 'cat_men',
    categorySlug: 'mens-accessories',
    brand: 'Ayoola Leather',
    description: 'Keep your financial essentials stored in ultimate security and structural slimness. Featuring RFID-blocking layers sewn between cross-grained Saffiano leather, resisting scratches, water drops, and structural warping.',
    price: 15000,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1627124424074-76576d9da990?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Material: Saffiano scratch-resistant calfskin leather',
      'Compartments: 8 card slots, 2 receipt wings, 1 main bill divider',
      'Security: Certified RFID-blocking weave shield'
    ],
    rating: 4.7,
    isBestSeller: true,
    reviewsCount: 38
  },

  // KITCHEN ACCESSORIES
  {
    id: 'prod_kitchen_1',
    name: 'Royale Imperial 24-Piece Cutlery Set',
    slug: 'royale-imperial-cutlery-set',
    categoryId: 'cat_kitchen',
    categorySlug: 'kitchen-accessories',
    brand: 'Ayoola Home',
    description: 'Elevate your host game and dinner aesthetics. This majestic set features 6 dinner knives, 6 dinner forks, 6 table spoons, and 6 dessert spoons, beautifully finished in a gorgeous matte gold titanium plating. Resists tarnish, scratching, and high heating.',
    price: 45000,
    discountPrice: 39500,
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543510473-ac2c35329a28?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594794112135-1600e5a9ee53?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Material: Premium food-grade 18/10 Stainless Steel',
      'Plating: Matte Gold Titanium physical vapor deposition',
      'Includes: 6 x Knives, 6 x Forks, 6 x Spoons, 6 x Teaspoons',
      'Dishwasher Safe: Yes, recommended gentle cycle'
    ],
    rating: 4.8,
    isFeatured: true,
    isNewArrival: true,
    reviewsCount: 28
  },
  {
    id: 'prod_kitchen_2',
    name: 'Aura Marble & Gold Spice Carousel',
    slug: 'aura-marble-spice-carousel',
    categoryId: 'cat_kitchen',
    categorySlug: 'kitchen-accessories',
    brand: 'Ayoola Home',
    description: 'A structural centerpiece for your kitchen island. Features an elegant solid white Carrara marble rotating base supporting 12 gold-rimmed glass spice jars with shaker screens and hermetic vacuum lids.',
    price: 28000,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1594794112135-1600e5a9ee53?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      'Base: 360-degree smooth lazy susan rotating marble turntable',
      'Jars: 12 High-borosilicate clear glass canisters with gold labels',
      'Total Height: 24cm, Turntable diameter: 20cm'
    ],
    rating: 4.7,
    isTrending: true,
    reviewsCount: 14
  }
];

export const INITIAL_COUPONS = [
  {
    id: 'coup_ayoola10',
    code: 'AYOOLA10',
    discountType: 'percentage' as const,
    discountValue: 10,
    minOrderAmount: 15000,
    active: true
  },
  {
    id: 'coup_gold5k',
    code: 'GOLD5K',
    discountType: 'fixed' as const,
    discountValue: 5000,
    minOrderAmount: 40000,
    active: true
  },
  {
    id: 'coup_welcome',
    code: 'WELCOME5',
    discountType: 'percentage' as const,
    discountValue: 5,
    active: true
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev_1',
    productId: 'prod_bag_1',
    userName: 'Chioma Adeniyi',
    userEmail: 'chioma.a@example.com',
    rating: 5,
    comment: 'The Aurelia Crimson handbag is gorgeous! The leather smells genuine and the gold hardware is extremely bright and heavy. Highly recommend!',
    date: '2026-06-15'
  },
  {
    id: 'rev_2',
    productId: 'prod_bag_1',
    userName: 'Funmi Oyetunji',
    userEmail: 'funmi.o@example.com',
    rating: 4,
    comment: 'Excellent bag, arrived in Oyo State within 3 days. Very spacious, inside holds my tablet and purse. Clasp takes some effort to open initially but works perfectly now.',
    date: '2026-06-20'
  },
  {
    id: 'rev_3',
    productId: 'prod_shoe_1',
    userName: 'Kelechi Egwu',
    userEmail: 'k.egwu@example.com',
    rating: 5,
    comment: 'Very comfortable heel! Usually pointed pumps hurt my toes, but the padding in these makes them extremely soft. Perfect height too!',
    date: '2026-06-18'
  },
  {
    id: 'rev_4',
    productId: 'prod_sneaker_1',
    userName: 'Rosheed Alabi',
    userEmail: 'r.alabi@example.com',
    rating: 5,
    comment: 'The quality on these sneakers rivals high-end luxury brands costing $800+. The leather and suede panels are premium. Fit is true to size.',
    date: '2026-06-25'
  },
  {
    id: 'rev_5',
    productId: 'prod_men_acc_1',
    userName: 'Tunde Babalola',
    userEmail: 'tunde.b@example.com',
    rating: 5,
    comment: 'Helios chronograph is a beautiful piece. Heavy, accurate, and the gold mesh strap receives compliments everywhere. Paystack payment was incredibly smooth.',
    date: '2026-06-26'
  },
  {
    id: 'rev_6',
    productId: 'prod_kitchen_1',
    userName: 'Ngozi Okafor',
    userEmail: 'ngozi.o@example.com',
    rating: 5,
    comment: 'Exceptional cutlery. Made our anniversary dinner table look like a 5-star hotel in Abuja. Hand washing keeps them bright and stainless.',
    date: '2026-06-22'
  }
];
