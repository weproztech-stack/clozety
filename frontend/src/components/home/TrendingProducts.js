import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import ProductSkeleton from '../products/ProductSkeleton';
import api from '../../utils/api';
import { extractProducts } from '../../utils/helpers';

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      const response = await api.get('/api/products?sortBy=views&sortOrder=desc&limit=4&status=active');
      const productsData = extractProducts(response.data);
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching trending:', err);
      setError('Failed to load trending products');
      
      // Fallback data
      setProducts([
        {
          _id: '1',
          name: 'Wireless Headphones',
          price: 2999,
          discountPrice: 1999,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', isPrimary: true }],
          slug: 'wireless-headphones',
          stock: 10
        },
        {
          _id: '2',
          name: 'Men\'s Casual Shirt',
          price: 1499,
          discountPrice: 999,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', isPrimary: true }],
          slug: 'mens-casual-shirt',
          stock: 15
        },
        {
          _id: '3',
          name: 'Leather Wallet',
          price: 1299,
          discountPrice: 799,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', isPrimary: true }],
          slug: 'leather-wallet',
          stock: 20
        },
        {
          _id: '4',
          name: 'Smart Watch',
          price: 4999,
          discountPrice: 3499,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', isPrimary: true }],
          slug: 'smart-watch',
          stock: 8
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-2 mb-3 border-b border-zinc-200 pb-2">
              <TrendingUp className="w-5 h-5 text-zinc-900" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-zinc-900">
                Trending Now
              </h2>
            </div>
            <p className="text-sm sm:text-base text-zinc-600 mt-1">
              Most popular products loved by our customers
            </p>
          </div>
          
          <Link 
            to="/shop?sortBy=views_desc" 
            className="hidden md:flex items-center text-zinc-900 font-semibold hover:text-zinc-600 transition-colors group"
          >
            View All
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchTrendingProducts}
              className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 transition-all duration-200 hover:scale-[1.02]"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="md:hidden text-center mt-8">
          <Link 
            to="/shop?sortBy=views_desc" 
            className="inline-flex items-center text-zinc-900 font-semibold hover:text-zinc-600 transition-colors group"
          >
            View All Trending Products
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;