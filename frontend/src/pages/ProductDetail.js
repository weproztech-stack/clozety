import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ProductCard from '../components/products/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProductDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      // Check if slug is MongoDB ObjectId
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);

      let response;
      if (isObjectId) {
        // If it's an ID, use ID endpoint
        response = await api.get(`/api/products/${slug}`);
      } else {
        // If it's a slug, use slug endpoint
        response = await api.get(`/api/products/slug/${slug}`);
      }

      const productData = response.data.data || response.data;
      setProduct(productData);
      setSelectedImage(productData.images?.find(img => img.isPrimary) || productData.images?.[0]);

      // Fetch related products
      if (productData.categories?.length > 0) {
        try {
          const categoryId = productData.categories[0]._id;
          const relatedRes = await api.get(`/api/products?category=${categoryId}&limit=4`);
          setRelatedProducts(relatedRes.data.data || []);
        } catch (err) {
          console.error('Error fetching related products:', err);
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < product.stock) {
      setQuantity(q => q + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
    toast.success('Added to cart');
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product._id);
      toast.success('Added to wishlist');
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="animate-pulse">
          <div className="h-4 bg-zinc-200 rounded w-48 mb-8"></div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-zinc-200 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-zinc-200 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
              <div className="h-12 bg-zinc-200 rounded w-1/3"></div>
              <div className="h-24 bg-zinc-200 rounded"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !product) {
    return (
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-zinc-900 mb-4">Product Not Found</h2>
        <p className="text-zinc-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
        <Link to="/shop" className="px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors">
          Continue Shopping
        </Link>
      </motion.div>
    );
  }

  const discountPercent = calculateDiscount(product.price, product.discountPrice);
  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const inWishlist = isInWishlist(product._id);

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', path: '/' },
          { label: 'Shop', path: '/shop' },
          { label: product.categories?.[0]?.name || 'Product', path: `/shop?category=${product.categories?.[0]?._id}` },
          { label: product.name, path: '#' }
        ]}
      />

      {/* Product Main */}
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mt-8 items-start">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-zinc-100 rounded-2xl overflow-hidden mb-4 relative group cursor-zoom-in">
            <LazyLoadImage
              alt={product.name}
              effect="blur"
              src={selectedImage?.imageUrl || product.images?.[0]?.imageUrl}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              wrapperClassName="w-full h-full object-cover"
            />

            {/* Navigation Buttons */}
            {product.images?.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const currentIndex = product.images.findIndex(img => img._id === selectedImage?._id);
                    const prevIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
                    setSelectedImage(product.images[prevIndex]);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const currentIndex = product.images.findIndex(img => img._id === selectedImage?._id);
                    const nextIndex = currentIndex === product.images.length - 1 ? 0 : currentIndex + 1;
                    setSelectedImage(product.images[nextIndex]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage?._id === image._id ? 'border-zinc-900' : 'border-transparent hover:border-zinc-300'
                    }`}
                >
                  <img src={image.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-zinc-900 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-sm text-zinc-500">(24 customer reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-zinc-900">
                {formatPrice(finalPrice)}
              </span>
              {product.discountPrice > 0 && (
                <>
                  <span className="text-xl text-zinc-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <p className="text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                In Stock ({product.stock} available)
              </p>
            ) : (
              <p className="text-red-600 flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                Out of Stock
              </p>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-zinc-600 mb-6">{product.shortDescription}</p>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center border border-zinc-300 rounded-lg w-fit">
              <button
                onClick={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
                className="px-4 py-2 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-16 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange('increase')}
                disabled={quantity >= product.stock}
                className="px-4 py-2 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-3 border-2 rounded-lg transition-all hover:scale-105 ${inWishlist
                ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                }`}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Shipping Info */}
          <div className="border-t border-zinc-200 pt-6 space-y-4">
            <div className="flex items-center text-sm text-zinc-600">
              <Truck className="w-5 h-5 mr-3 text-zinc-400" />
              Free shipping on orders above ₹999
            </div>
            <div className="flex items-center text-sm text-zinc-600">
              <Shield className="w-5 h-5 mr-3 text-zinc-400" />
              100% secure payment
            </div>
            <div className="flex items-center text-sm text-zinc-600">
              <RotateCcw className="w-5 h-5 mr-3 text-zinc-400" />
              30-day easy returns
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 border-t border-zinc-200 pt-8">
        <div className="flex border-b border-zinc-200 mb-6">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === tab
                ? 'text-zinc-900 border-b-2 border-zinc-900'
                : 'text-zinc-500 hover:text-zinc-700'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="prose max-w-none">
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-zinc-600"
              >
                {product.description || 'No description available.'}
              </motion.div>
            )}

            {activeTab === 'specifications' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 font-medium text-zinc-900 w-1/4">Brand</td>
                      <td className="py-3 text-zinc-600">{product.brand || 'CLOZETY'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium text-zinc-900">SKU</td>
                      <td className="py-3 text-zinc-600">{product.sku || 'N/A'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium text-zinc-900">Category</td>
                      <td className="py-3 text-zinc-600">{product.categories?.map(c => c.name).join(', ') || 'Uncategorized'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-medium text-zinc-900">Stock</td>
                      <td className="py-3 text-zinc-600">{product.stock} units</td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-12"
              >
                <p className="text-zinc-500">Customer reviews coming soon!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {relatedProducts.map(related => (
              <ProductCard key={related._id} product={related} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetail;