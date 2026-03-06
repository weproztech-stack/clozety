import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-zinc-900 to-zinc-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-white">
                Perfect Style
              </span>
            </h1>
            
            <p className="text-lg text-zinc-300 max-w-lg">
              Explore our curated collection of premium fashion. From casual wear to formal elegance, find what makes you feel confident.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                to="/shop" 
                className="group inline-flex items-center px-6 py-3 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-100 transition-all transform hover:-translate-y-1"
              >
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/offers" 
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
              >
                View Offers
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-zinc-400">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-zinc-400">Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-zinc-400">Brands</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden md:block relative">
            <div className="aspect-square rounded-full bg-gradient-to-br from-zinc-600 to-zinc-900 opacity-20 absolute inset-0 blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800" 
              alt="Fashion Showcase"
              className="relative z-10 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;