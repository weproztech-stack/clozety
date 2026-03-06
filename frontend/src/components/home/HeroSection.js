import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = () => {
  const [currentText, setCurrentText] = useState(0);

  const rotatingTexts = [
    "Premium Fashion Collection",
    "Up to 70% Off on Select Items",
    "Free Shipping on Orders ₹999+",
    "New Arrivals Every Week"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-zinc-900 to-zinc-800 text-white overflow-hidden min-h-[600px] flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Animated Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-zinc-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-zinc-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-zinc-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-sm font-medium">Welcome to CLOZETY</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-white">
                Perfect Style
              </span>
            </h1>
            
            <div className="h-16">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentText}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg md:text-xl text-zinc-300 max-w-lg"
                >
                  {rotatingTexts[currentText]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/shop" 
                className="group inline-flex items-center px-6 py-3 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-100 transition-all transform hover:-translate-y-1 hover:shadow-xl"
              >
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/offers" 
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all transform hover:-translate-y-1"
              >
                View Offers
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-zinc-400">Happy Customers</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-zinc-400">Products</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-zinc-400">Brands</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Image Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400" 
                  alt="Fashion"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1469337930095-2db4fdf4f6c6?w=400" 
                  alt="Fashion"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="overflow-hidden rounded-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1490481266501-7c523e2d0f4b?w=400" 
                  alt="Fashion"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400" 
                  alt="Fashion"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;