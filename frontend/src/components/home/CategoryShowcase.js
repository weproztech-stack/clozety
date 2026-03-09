import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../utils/constants';
import { motion } from 'framer-motion';

const CATEGORY_IMAGES = {
  'body-care': 'https://images.unsplash.com/photo-1608248593842-8021c6ba6e20?w=600&q=80',
  'skin-care': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80',
  'hair-care': 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80',
  'makeup': 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=600&q=80',
  'face-care': 'https://images.unsplash.com/photo-1570194065650-89190299f1fa?w=600&q=80',
  'natural-organic': 'https://images.unsplash.com/photo-1615397323145-a7b69324e930?w=600&q=80',
  'fragrance': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80',
  'mens-grooming': 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&q=80',
  'bath-shower': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
  'beauty-tools': 'https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?w=600&q=80'
};

const CategoryShowcase = () => {
  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm tracking-widest uppercase text-zinc-500 font-medium mb-2">
              Curated Edit
            </h2>
            <h3 className="text-4xl font-serif text-zinc-900">
              Shop by Category
            </h3>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-flex items-center text-sm font-medium uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
          >
            View Entire Collection
          </Link>
        </div>

        {/* Scrollable container for horizontal scrolling on desktop/mobile */}
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="min-w-[280px] md:min-w-[320px] lg:min-w-[380px] h-[450px] snap-center shrink-0 relative group rounded-2xl overflow-hidden cursor-pointer"
            >
              <Link to={`/shop?category=${category.id}`} className="block w-full h-full">
                {/* Image */}
                <img
                  src={CATEGORY_IMAGES[category.id] || CATEGORY_IMAGES['skin-care']}
                  alt={category.name}
                  className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                  <h4 className="text-2xl font-serif text-white mb-2">{category.name}</h4>
                  <div className="w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-1/2 mb-4" />
                  <span className="text-sm text-zinc-300 font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    Explore
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center text-sm font-medium uppercase tracking-wider text-zinc-900 border-b border-zinc-900 pb-1"
          >
            View Entire Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;