import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-100 rounded-full mb-4">
          <Search className="w-10 h-10 text-zinc-400" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 mb-2">No products match your filters</h2>
        <p className="text-sm text-zinc-600 max-w-md mx-auto">
          Try adjusting your filters or search term to find what you are looking for.
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
    >
      {products.map(product => (
        <motion.div key={product._id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;