// import React, { useState, useEffect } from 'react';
// import { 
//   Search, User, ShoppingBag, Heart, Menu, X, ChevronDown, 
//   Award, Leaf, TrendingUp, Sparkles, Gift, Star, MapPin,
//   Phone, Mail, Clock, Truck, Shield, Percent, Flame,
//   Eye, EyeOff, LogIn, UserPlus, Settings, HelpCircle,
//   Package, RotateCcw, CreditCard, HeadphonesIcon
// } from 'lucide-react';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isWishlistOpen, setIsWishlistOpen] = useState(false);
//   const [activeMegaMenu, setActiveMegaMenu] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [scrolled, setScrolled] = useState(false);
//   const [showLocationPopup, setShowLocationPopup] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState('Delhi NCR');
//   const [cartItems, setCartItems] = useState(3);
//   const [wishlistItems, setWishlistItems] = useState(5);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const categories = [
//     {
//       id: 'face',
//       name: 'FACE',
//       icon: '✨',
//       image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=50',
//       description: 'Complete face care solutions',
//       featured: [
//         { name: 'Face Wash', sales: '12k+', image: '🧼' },
//         { name: 'Face Cream', sales: '8k+', image: '🧴' },
//         { name: 'Sunscreen', sales: '15k+', image: '☀️' },
//         { name: 'Face Serum', sales: '10k+', image: '💧' },
//         { name: 'Face Mask', sales: '7k+', image: '🎭' },
//         { name: 'Face Scrub', sales: '5k+', image: '🌀' }
//       ],
//       trending: [
//         { name: 'Vitamin C Face Wash', discount: '30%', rating: '4.8' },
//         { name: 'Hyaluronic Serum', discount: '25%', rating: '4.9' },
//         { name: 'Matte Sunscreen', discount: '20%', rating: '4.7' }
//       ],
//       brands: ['GlowNatural', 'The Ordinary', 'Cetaphil', 'Neutrogena']
//     },
//     {
//       id: 'hair',
//       name: 'HAIR',
//       icon: '💁‍♀️',
//       image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=50',
//       description: 'Strong & shiny hair',
//       featured: [
//         { name: 'Shampoo', sales: '20k+', image: '🧴' },
//         { name: 'Conditioner', sales: '15k+', image: '💆' },
//         { name: 'Hair Oil', sales: '18k+', image: '🫒' },
//         { name: 'Hair Mask', sales: '9k+', image: '🎭' },
//         { name: 'Hair Serum', sales: '12k+', image: '💧' },
//         { name: 'Hair Color', sales: '6k+', image: '🎨' }
//       ],
//       trending: [
//         { name: 'Onion Hair Oil', discount: '35%', rating: '4.9' },
//         { name: 'Protein Shampoo', discount: '20%', rating: '4.8' },
//         { name: 'Anti-Hairfall Serum', discount: '25%', rating: '4.7' }
//       ],
//       brands: ['GlowNatural', 'Mamaearth', 'WOW', 'Biotique']
//     },
//     {
//       id: 'makeup',
//       name: 'MAKEUP',
//       icon: '💄',
//       image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=50',
//       description: 'Enhance your beauty',
//       featured: [
//         { name: 'Foundation', sales: '14k+', image: '🎨' },
//         { name: 'Lipstick', sales: '25k+', image: '💄' },
//         { name: 'Kajal', sales: '30k+', image: '🖤' },
//         { name: 'Eyeliner', sales: '18k+', image: '✒️' },
//         { name: 'Mascara', sales: '12k+', image: '💕' },
//         { name: 'Compact', sales: '16k+', image: '📦' }
//       ],
//       trending: [
//         { name: 'Matte Lipstick', discount: '40%', rating: '4.9' },
//         { name: 'Waterproof Kajal', discount: '25%', rating: '4.8' },
//         { name: 'BB Cream', discount: '30%', rating: '4.7' }
//       ],
//       brands: ['GlowNatural', 'Lakme', 'Maybelline', 'Sugar']
//     },
//     {
//       id: 'body',
//       name: 'BODY',
//       icon: '🧴',
//       image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=50',
//       description: 'Pamper your body',
//       featured: [
//         { name: 'Body Lotion', sales: '22k+', image: '🧴' },
//         { name: 'Body Wash', sales: '17k+', image: '🚿' },
//         { name: 'Body Scrub', sales: '8k+', image: '🌀' },
//         { name: 'Soap', sales: '35k+', image: '🧼' },
//         { name: 'Body Oil', sales: '11k+', image: '🫒' },
//         { name: 'Deodorant', sales: '28k+', image: '🌸' }
//       ],
//       trending: [
//         { name: 'Coffee Scrub', discount: '30%', rating: '4.8' },
//         { name: 'Cocoa Butter', discount: '25%', rating: '4.7' },
//         { name: 'Aloe Vera Gel', discount: '20%', rating: '4.9' }
//       ],
//       brands: ['GlowNatural', 'Nivea', 'Vaseline', 'Dove']
//     },
//     {
//       id: 'baby',
//       name: 'BABY',
//       icon: '👶',
//       image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=50',
//       description: 'Gentle care for little ones',
//       featured: [
//         { name: 'Baby Lotion', sales: '15k+', image: '🧴' },
//         { name: 'Baby Oil', sales: '12k+', image: '🫒' },
//         { name: 'Baby Shampoo', sales: '10k+', image: '🧴' },
//         { name: 'Diaper Cream', sales: '8k+', image: '🍑' },
//         { name: 'Baby Powder', sales: '14k+', image: '✨' },
//         { name: 'Baby Soap', sales: '11k+', image: '🧼' }
//       ],
//       trending: [
//         { name: 'Diaper Rash Cream', discount: '20%', rating: '4.9' },
//         { name: 'Gentle Wash', discount: '15%', rating: '4.8' },
//         { name: 'Baby Powder', discount: '10%', rating: '4.7' }
//       ],
//       brands: ['GlowNatural', 'Johnson\'s', 'Himalaya', 'Chicco']
//     },
//     {
//       id: 'oil',
//       name: 'OIL',
//       icon: '🫒',
//       image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=50',
//       description: 'Natural oils for all',
//       featured: [
//         { name: 'Coconut Oil', sales: '40k+', image: '🥥' },
//         { name: 'Almond Oil', sales: '25k+', image: '🌰' },
//         { name: 'Jojoba Oil', sales: '12k+', image: '🌱' },
//         { name: 'Argan Oil', sales: '18k+', image: '🌿' },
//         { name: 'Castor Oil', sales: '22k+', image: '🌱' },
//         { name: 'Tea Tree Oil', sales: '15k+', image: '🌲' }
//       ],
//       trending: [
//         { name: 'Cold Pressed Coconut', discount: '25%', rating: '4.9' },
//         { name: 'Organic Almond', discount: '20%', rating: '4.8' },
//         { name: 'Pure Argan', discount: '30%', rating: '4.9' }
//       ],
//       brands: ['GlowNatural', 'Parachute', 'Forest Essential', 'Khadi']
//     }
//   ];

//   const trendingSearches = [
//     { term: 'Vitamin C Serum', searches: '12k' },
//     { term: 'Onion Hair Oil', searches: '8.5k' },
//     { term: 'Sunscreen SPF 50', searches: '15k' },
//     { term: 'Matte Lipstick', searches: '10k' },
//     { term: 'Face Mask', searches: '7k' }
//   ];

//   const locations = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];

//   return (
//     <>
//       {/* Top Bar - Very Professional */}
//       <div className={`bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden ${scrolled ? 'h-8' : 'h-10'} transition-all duration-300`}>
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBtLTI4IDBhMjggMjggMCAxIDEgNTYgMCAyOCAyOCAwIDEgMS01NiAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-20"></div>
//         <div className="max-w-7xl mx-auto px-4 h-full">
//           <div className="flex justify-between items-center h-full text-xs font-light">
//             <div className="flex items-center space-x-6">
//               <div className="flex items-center space-x-2 group cursor-pointer">
//                 <Truck size={14} className="text-emerald-400 group-hover:scale-110 transition" />
//                 <span className="hidden md:inline">Free Shipping above ₹499</span>
//                 <span className="md:hidden">Free Shipping</span>
//               </div>
//               <div className="w-px h-3 bg-white/20"></div>
//               <div className="flex items-center space-x-2 group cursor-pointer">
//                 <RotateCcw size={14} className="text-amber-400 group-hover:scale-110 transition" />
//                 <span className="hidden md:inline">7 Days Easy Returns</span>
//                 <span className="md:hidden">Easy Returns</span>
//               </div>
//               <div className="w-px h-3 bg-white/20 hidden md:block"></div>
//               <div className="items-center space-x-2 hidden md:flex group cursor-pointer">
//                 <Shield size={14} className="text-emerald-400 group-hover:scale-110 transition" />
//                 <span>100% Authentic</span>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2 border-r border-white/20 pr-4">
//                 <MapPin size={14} className="text-pink-400" />
//                 <button 
//                   onClick={() => setShowLocationPopup(true)}
//                   className="hover:text-pink-300 transition flex items-center space-x-1"
//                 >
//                   <span>{selectedLocation}</span>
//                   <ChevronDown size={12} />
//                 </button>
//               </div>
//               <div className="hidden lg:flex items-center space-x-4">
//                 <a href="#" className="hover:text-pink-300 transition flex items-center space-x-1">
//                   <Percent size={14} />
//                   <span>Offers</span>
//                 </a>
//                 <a href="#" className="hover:text-pink-300 transition flex items-center space-x-1">
//                   <HeadphonesIcon size={14} />
//                   <span>Help</span>
//                 </a>
//                 <a href="#" className="hover:text-pink-300 transition flex items-center space-x-1">
//                   <Package size={14} />
//                   <span>Track Order</span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Location Popup */}
//       {showLocationPopup && (
//         <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-fadeIn">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold text-gray-800">Choose your location</h3>
//               <button onClick={() => setShowLocationPopup(false)}>
//                 <X size={20} className="text-gray-500 hover:text-gray-700" />
//               </button>
//             </div>
//             <p className="text-sm text-gray-500 mb-4">To get accurate delivery time and offers</p>
//             <div className="grid grid-cols-2 gap-3">
//               {locations.map((loc) => (
//                 <button
//                   key={loc}
//                   onClick={() => {
//                     setSelectedLocation(loc);
//                     setShowLocationPopup(false);
//                   }}
//                   className={`p-3 rounded-lg border text-sm transition ${
//                     selectedLocation === loc 
//                       ? 'border-pink-500 bg-pink-50 text-pink-600' 
//                       : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
//                   }`}
//                 >
//                   {loc}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Header */}
//       <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-xl' : 'shadow-md'}`}>
//         {/* Top Header Section */}
//         <div className="border-b border-gray-100">
//           <div className="max-w-7xl mx-auto px-4">
//             <div className="flex items-center justify-between h-16 lg:h-20">
              
//               {/* Mobile Menu Button */}
//               <button 
//                 className="lg:hidden text-gray-600 hover:text-pink-600 transition relative group"
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//               >
//                 <div className={`transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
//                   <Menu size={24} />
//                 </div>
//                 <div className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
//                   <X size={24} className="text-pink-600" />
//                 </div>
//               </button>

//               {/* Logo with Tagline */}
//               <div className="flex-shrink-0 group cursor-pointer">
//                 <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
//                   <span className="bg-gradient-to-r from-amber-700 to-pink-600 bg-clip-text text-transparent">Glow</span>
//                   <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Natural</span>
//                 </h1>
//                 <p className="text-[8px] lg:text-[10px] text-gray-400 tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">
//                   SINCE 2020 • PURE • NATURAL • BEAUTY
//                 </p>
//               </div>

//               {/* Search Bar - Desktop */}
//               <div className="hidden lg:block flex-1 max-w-2xl mx-8">
//                 <div className="relative group">
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 transition duration-300 blur"></div>
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search for products, brands, ingredients..."
//                     className="relative w-full px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-pink-400 bg-gray-50 focus:bg-white transition pr-12 text-gray-700 placeholder-gray-400"
//                   />
//                   <Search className="absolute right-4 top-3.5 text-gray-400 group-focus-within:text-pink-500 transition" size={20} />
                  
//                   {/* Trending Searches Dropdown */}
//                   {searchTerm && (
//                     <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-fadeIn z-50">
//                       <div className="flex items-center justify-between mb-3">
//                         <p className="text-xs font-semibold text-gray-400">TRENDING SEARCHES</p>
//                         <Flame size={14} className="text-orange-500" />
//                       </div>
//                       <div className="space-y-2">
//                         {trendingSearches.map((item) => (
//                           <button
//                             key={item.term}
//                             className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition group"
//                           >
//                             <span className="text-sm text-gray-600 group-hover:text-pink-600">{item.term}</span>
//                             <span className="text-xs text-gray-400">{item.searches} searches</span>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right Icons */}
//               <div className="flex items-center space-x-4 lg:space-x-6">
//                 {/* Mobile Search */}
//                 <button 
//                   className="lg:hidden text-gray-600 hover:text-pink-600 transition"
//                   onClick={() => setIsSearchOpen(!isSearchOpen)}
//                 >
//                   <Search size={22} />
//                 </button>

//                 {/* Wishlist */}
//                 <button 
//                   className="hidden md:block text-gray-600 hover:text-pink-600 transition relative group"
//                   onClick={() => setIsWishlistOpen(!isWishlistOpen)}
//                 >
//                   <Heart size={24} className="group-hover:scale-110 transition" />
//                   {wishlistItems > 0 && (
//                     <>
//                       <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
//                         {wishlistItems}
//                       </span>
//                       <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-600 rounded-full animate-ping opacity-50"></span>
//                     </>
//                   )}
//                 </button>

//                 {/* User Menu */}
//                 <div className="relative">
//                   <button 
//                     className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition group"
//                     onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                   >
//                     <div className="relative">
//                       <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
//                         <User size={20} className="text-pink-600" />
//                       </div>
//                       <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                     </div>
//                     <span className="hidden lg:block text-sm font-medium">Hi, Guest</span>
//                     <ChevronDown size={16} className={`hidden lg:block transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
//                   </button>

//                   {/* User Dropdown Menu */}
//                   {isUserMenuOpen && (
//                     <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn z-50">
//                       <div className="px-4 py-3 border-b border-gray-100">
//                         <p className="text-sm font-semibold text-gray-800">Welcome to GlowNatural</p>
//                         <p className="text-xs text-gray-500">Sign in for better experience</p>
//                       </div>
//                       <div className="p-2">
//                         <a href="#" className="flex items-center space-x-3 px-4 py-2 hover:bg-pink-50 rounded-lg transition">
//                           <LogIn size={18} className="text-pink-600" />
//                           <span className="text-sm text-gray-700">Sign In</span>
//                         </a>
//                         <a href="#" className="flex items-center space-x-3 px-4 py-2 hover:bg-pink-50 rounded-lg transition">
//                           <UserPlus size={18} className="text-purple-600" />
//                           <span className="text-sm text-gray-700">Create Account</span>
//                         </a>
//                         <div className="border-t border-gray-100 my-2"></div>
//                         <a href="#" className="flex items-center space-x-3 px-4 py-2 hover:bg-pink-50 rounded-lg transition">
//                           <Package size={18} className="text-gray-600" />
//                           <span className="text-sm text-gray-700">Orders</span>
//                         </a>
//                         <a href="#" className="flex items-center space-x-3 px-4 py-2 hover:bg-pink-50 rounded-lg transition">
//                           <Heart size={18} className="text-gray-600" />
//                           <span className="text-sm text-gray-700">Wishlist</span>
//                         </a>
//                         <a href="#" className="flex items-center space-x-3 px-4 py-2 hover:bg-pink-50 rounded-lg transition">
//                           <Settings size={18} className="text-gray-600" />
//                           <span className="text-sm text-gray-700">Settings</span>
//                         </a>
//                         <div className="border-t border-gray-100 my-2"></div>
//                         <a href="#" className="flex items-center space-x-3 px-4 py-2 hover:bg-pink-50 rounded-lg transition">
//                           <HelpCircle size={18} className="text-gray-600" />
//                           <span className="text-sm text-gray-700">Help Center</span>
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Cart */}
//                 <button 
//                   className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition group relative"
//                   onClick={() => setIsCartOpen(!isCartOpen)}
//                 >
//                   <div className="relative">
//                     <ShoppingBag size={24} className="group-hover:scale-110 transition" />
//                     {cartItems > 0 && (
//                       <>
//                         <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                           {cartItems}
//                         </span>
//                         <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-600 rounded-full animate-ping opacity-50"></span>
//                       </>
//                     )}
//                   </div>
//                   <span className="hidden lg:block text-sm font-medium">
//                     <span className="text-gray-400">Cart</span>
//                     <span className="ml-1 text-pink-600 font-bold">₹1,299</span>
//                   </span>
//                 </button>

//                 {/* Cart Dropdown */}
//                 {isCartOpen && (
//                   <div className="absolute top-full right-4 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-fadeIn z-50">
//                     <h3 className="font-semibold text-gray-800 mb-3">Shopping Cart ({cartItems})</h3>
//                     <div className="space-y-3 mb-4">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
//                           🧴
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-800">Vitamin C Face Wash</p>
//                           <p className="text-xs text-gray-500">Qty: 1</p>
//                         </div>
//                         <p className="text-sm font-bold text-pink-600">₹349</p>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                           🫒
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-800">Onion Hair Oil</p>
//                           <p className="text-xs text-gray-500">Qty: 2</p>
//                         </div>
//                         <p className="text-sm font-bold text-pink-600">₹950</p>
//                       </div>
//                     </div>
//                     <div className="border-t border-gray-100 pt-3">
//                       <div className="flex justify-between mb-3">
//                         <span className="text-sm text-gray-600">Subtotal</span>
//                         <span className="text-sm font-bold text-gray-800">₹1,299</span>
//                       </div>
//                       <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition">
//                         View Cart & Checkout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Search Bar */}
//         {isSearchOpen && (
//           <div className="lg:hidden p-4 border-b border-gray-100 bg-gray-50 animate-slideDown">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
//                 autoFocus
//               />
//               <Search className="absolute right-3 top-3 text-gray-400" size={18} />
//             </div>
//           </div>
//         )}

//         {/* Navigation Bar */}
//         <nav className="bg-white border-b border-gray-100">
//           <div className="max-w-7xl mx-auto px-4">
//             <div className="hidden lg:flex items-center justify-between">
//               {/* Left Navigation */}
//               <div className="flex items-center">
//                 <a href="#" className="px-4 py-3 text-gray-700 hover:text-pink-600 font-medium text-sm border-b-2 border-transparent hover:border-pink-500 transition flex items-center space-x-1">
//                   <span>🏠</span>
//                   <span>HOME</span>
//                 </a>
                
//                 {/* Mega Menu Categories */}
//                 {categories.map((category) => (
//                   <div 
//                     key={category.id}
//                     className="relative"
//                     onMouseEnter={() => setActiveMegaMenu(category.id)}
//                     onMouseLeave={() => setActiveMegaMenu(null)}
//                   >
//                     <button className="px-4 py-3 text-gray-700 hover:text-pink-600 font-medium text-sm border-b-2 border-transparent hover:border-pink-500 transition flex items-center space-x-1 group">
//                       <span>{category.icon}</span>
//                       <span>{category.name}</span>
//                       <ChevronDown size={14} className={`group-hover:rotate-180 transition duration-300 ${activeMegaMenu === category.id ? 'rotate-180' : ''}`} />
//                     </button>

//                     {/* Mega Menu */}
//                     {activeMegaMenu === category.id && (
//                       <div className="absolute top-full left-0 w-[700px] bg-white shadow-2xl rounded-2xl p-6 border border-gray-100 animate-fadeIn z-50">
//                         <div className="grid grid-cols-4 gap-6">
//                           {/* Featured Products */}
//                           <div className="col-span-2">
//                             <div className="flex items-center justify-between mb-3">
//                               <h3 className="font-bold text-gray-800">✨ FEATURED</h3>
//                               <span className="text-xs text-pink-600">View All →</span>
//                             </div>
//                             <div className="grid grid-cols-2 gap-3">
//                               {category.featured.map((item) => (
//                                 <a href="#" key={item.name} className="group flex items-center space-x-2 p-2 hover:bg-pink-50 rounded-lg transition">
//                                   <span className="text-2xl">{item.image}</span>
//                                   <div>
//                                     <p className="text-sm font-medium text-gray-700 group-hover:text-pink-600">{item.name}</p>
//                                     <p className="text-xs text-gray-400">{item.sales} sold</p>
//                                   </div>
//                                 </a>
//                               ))}
//                             </div>
//                           </div>

//                           {/* Trending & Brands */}
//                           <div>
//                             <h3 className="font-bold text-gray-800 mb-3 flex items-center">
//                               <Flame size={16} className="text-orange-500 mr-1" />
//                               TRENDING
//                             </h3>
//                             <div className="space-y-2">
//                               {category.trending.map((item) => (
//                                 <a href="#" key={item.name} className="block p-2 hover:bg-pink-50 rounded-lg transition">
//                                   <p className="text-sm font-medium text-gray-700">{item.name}</p>
//                                   <div className="flex items-center space-x-2 mt-1">
//                                     <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">
//                                       {item.discount} OFF
//                                     </span>
//                                     <span className="text-xs text-gray-400">⭐ {item.rating}</span>
//                                   </div>
//                                 </a>
//                               ))}
//                             </div>

//                             <h3 className="font-bold text-gray-800 mt-4 mb-2">🏷️ BRANDS</h3>
//                             <div className="space-y-1">
//                               {category.brands.map((brand) => (
//                                 <a href="#" key={brand} className="block text-sm text-gray-600 hover:text-pink-600 py-1">
//                                   {brand}
//                                 </a>
//                               ))}
//                             </div>
//                           </div>

//                           {/* Offer Banner */}
//                           <div>
//                             <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-4 text-white">
//                               <p className="text-xs opacity-90">WEEKEND OFFER</p>
//                               <p className="text-lg font-bold mt-1">UP TO 40% OFF</p>
//                               <p className="text-sm mt-2">On {category.name} Products</p>
//                               <button className="mt-3 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/30 transition">
//                                 Shop Now →
//                               </button>
//                             </div>
//                             <div className="mt-3 p-3 border border-dashed border-pink-200 rounded-lg">
//                               <p className="text-xs text-gray-500">✨ Free gift on orders above ₹999</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Right Special Links */}
//               <div className="flex items-center space-x-2">
//                 <a href="#" className="px-4 py-3 text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center space-x-1 bg-pink-50">
//                   <Percent size={16} />
//                   <span>OFFER ZONE</span>
//                   <span className="ml-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
//                 </a>
//                 <a href="#" className="px-4 py-3 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1">
//                   <Leaf size={16} />
//                   <span>NEW LAUNCHES</span>
//                 </a>
//               </div>
//             </div>

//             {/* Mobile Categories Scroll */}
//             <div className="lg:hidden">
//               <div className="flex items-center space-x-4 overflow-x-auto py-3 hide-scrollbar">
//                 {categories.map((cat) => (
//                   <a key={cat.id} href="#" className="flex flex-col items-center flex-shrink-0 group">
//                     <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition border-2 border-transparent group-hover:border-pink-300">
//                       <span className="text-2xl">{cat.icon}</span>
//                     </div>
//                     <span className="text-xs font-medium text-gray-600 group-hover:text-pink-600">{cat.name}</span>
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Mobile Full Menu */}
//         {isMenuOpen && (
//           <div className="lg:hidden fixed inset-0 bg-white z-50 pt-20">
//             <div className="h-full overflow-y-auto pb-20">
//               <div className="p-4">
//                 {/* User Info */}
//                 <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl mb-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
//                       👤
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Welcome back!</p>
//                       <p className="font-semibold text-gray-800">Guest User</p>
//                     </div>
//                     <button className="ml-auto bg-white px-4 py-2 rounded-lg text-pink-600 text-sm font-medium">
//                       Login
//                     </button>
//                   </div>
//                 </div>

//                 {/* Navigation Links */}
//                 <div className="space-y-4">
//                   <a href="#" className="flex items-center justify-between py-3 border-b border-gray-100">
//                     <span className="font-medium text-gray-800">Home</span>
//                     <span>🏠</span>
//                   </a>
                  
//                   {categories.map((category) => (
//                     <div key={category.id} className="border-b border-gray-100 pb-3">
//                       <h3 className="font-bold text-gray-800 mb-2 flex items-center">
//                         <span className="text-xl mr-2">{category.icon}</span>
//                         {category.name}
//                       </h3>
//                       <div className="grid grid-cols-2 gap-2 pl-8">
//                         {category.featured.slice(0, 6).map((item) => (
//                           <a key={item.name} href="#" className="text-sm text-gray-600 hover:text-pink-600 py-1">
//                             {item.name}
//                           </a>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
                  
//                   <div className="pt-4">
//                     <a href="#" className="flex items-center justify-between py-2 text-pink-600 font-semibold">
//                       <span>✨ Offer Zone</span>
//                       <Percent size={16} />
//                     </a>
//                     <a href="#" className="flex items-center justify-between py-2 text-purple-600 font-semibold">
//                       <span>🌿 New Launches</span>
//                       <Leaf size={16} />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Floating Action Button - Mobile */}
//       <div className="lg:hidden fixed bottom-4 right-4 z-50">
//         <button className="w-14 h-14 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition group">
//           <Sparkles size={24} className="group-hover:rotate-12 transition" />
//         </button>
//       </div>
//     </>
//   );
// };

// export default Header;















// components/layout/Header.jsx

import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ setSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-500 hover:text-gray-600"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center ml-auto">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700 hidden sm:block">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;