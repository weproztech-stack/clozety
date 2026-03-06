import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { formatPrice, calculateDiscount, getPrimaryImage } from '../../utils/helpers';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import QuickViewModal from './QuickViewModal';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const primaryImage = getPrimaryImage(product.images);
  const discountPercent = calculateDiscount(product.price, product.discountPrice);
  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const inWishlist = isInWishlist(product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product._id, 1);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product.slug || product._id}`} className="block">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-zinc-100">
            <img
              src={imageError ? 'https://via.placeholder.com/400' : (primaryImage?.imageUrl || 'https://via.placeholder.com/400')}
              alt={product.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              onError={() => setImageError(true)}
              loading="lazy"
            />

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
              >
                {discountPercent}% OFF
              </motion.div>
            )}

            {/* Out of Stock Overlay */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className={`absolute inset-x-0 bottom-0 p-4 flex justify-center gap-2 transform transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <button
                onClick={handleQuickView}
                className="flex-1 bg-white/90 backdrop-blur-sm text-zinc-900 py-2 rounded-lg font-semibold text-sm hover:bg-white transition-colors flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                Quick View
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-zinc-900/90 backdrop-blur-sm text-white py-2 rounded-lg font-semibold text-sm hover:bg-zinc-900 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4 mr-1" />
                Add to Cart
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all transform hover:scale-110 ${
                inWishlist 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 backdrop-blur-sm text-zinc-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-zinc-900 mb-2 line-clamp-2 h-10">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-lg font-bold text-zinc-900">
                {formatPrice(finalPrice)}
              </span>
              {product.discountPrice > 0 && (
                <span className="text-sm text-zinc-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center text-sm text-zinc-500">
              <div className="flex text-yellow-400 mr-1">
                {'★'.repeat(4)}{'☆'.repeat(1)}
              </div>
              <span>(24)</span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal 
          product={product} 
          onClose={() => setShowQuickView(false)} 
        />
      )}
    </>
  );
};

export default ProductCard;