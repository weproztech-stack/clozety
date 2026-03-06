import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Minus, Plus } from 'lucide-react';
import { formatPrice, calculateDiscount, getPrimaryImage } from '../../utils/helpers';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const QuickViewModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(getPrimaryImage(product.images));
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const discountPercent = calculateDiscount(product.price, product.discountPrice);
  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const inWishlist = isInWishlist(product._id);

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < product.stock) {
      setQuantity(q => q + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity);
    onClose();
  };

  const handleWishlistToggle = async () => {
    if (inWishlist) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          
          {/* Image Gallery */}
          <div className="p-6 border-r border-zinc-200">
            <div className="aspect-square mb-4 bg-zinc-100 rounded-lg overflow-hidden">
              <img
                src={selectedImage?.imageUrl || product.images?.[0]?.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage?._id === image._id ? 'border-zinc-900' : 'border-transparent'
                    }`}
                  >
                    <img src={image.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6">
            <Link 
              to={`/product/${product.slug || product._id}`}
              className="text-sm text-zinc-500 hover:text-zinc-900 mb-2 block"
            >
              View Full Details →
            </Link>

            <h2 className="text-2xl font-bold text-zinc-900 mb-2">
              {product.name}
            </h2>

            {product.shortDescription && (
              <p className="text-zinc-600 mb-4 line-clamp-2">
                {product.shortDescription}
              </p>
            )}

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-zinc-900">
                {formatPrice(finalPrice)}
              </span>
              {product.discountPrice > 0 && (
                <>
                  <span className="text-lg text-zinc-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center text-sm text-zinc-500 mb-6">
              <div className="flex text-yellow-400 mr-2">
                {'★'.repeat(4)}{'☆'.repeat(1)}
              </div>
              <span>24 reviews</span>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-600 text-sm">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-600 text-sm">
                  ✕ Out of Stock
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center border border-zinc-300 rounded-lg w-fit">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className="px-3 py-2 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`w-full flex items-center justify-center px-6 py-3 border-2 rounded-lg font-semibold transition-colors ${
                  inWishlist
                    ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;