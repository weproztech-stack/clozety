import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

const CategoryShowcase = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br p-6 text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                backgroundImage: `linear-gradient(135deg, ${category.color.split(' ')[1]} 0%, ${category.color.split(' ')[3]} 100%)`
              }}
            >
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-semibold text-white text-sm">
                {category.name}
              </h3>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/shop" 
            className="inline-flex items-center text-zinc-900 font-semibold hover:text-zinc-600 transition-colors group"
          >
            View All Categories
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;