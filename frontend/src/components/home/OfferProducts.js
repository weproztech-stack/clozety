import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import ProductSkeleton from '../products/ProductSkeleton';
import api from '../../utils/api';
import { extractProducts } from '../../utils/helpers';

const OfferProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfferProducts();
  }, []);

  const fetchOfferProducts = async () => {
    try {
      const response = await api.get('/api/products?type=OFFER&limit=4&status=active');
      const productsData = extractProducts(response.data);
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to load offer products');
      
      // Fallback data
      setProducts([
        {
          _id: '5',
          name: 'Running Shoes',
          price: 3999,
          discountPrice: 2499,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', isPrimary: true }],
          slug: 'running-shoes',
          stock: 12
        },
        {
          _id: '6',
          name: 'Backpack',
          price: 2499,
          discountPrice: 1499,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', isPrimary: true }],
          slug: 'backpack',
          stock: 25
        },
        {
          _id: '7',
          name: 'Sunglasses',
          price: 1999,
          discountPrice: 999,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', isPrimary: true }],
          slug: 'sunglasses',
          stock: 30
        },
        {
          _id: '8',
          name: 'Wrist Watch',
          price: 5999,
          discountPrice: 3999,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500', isPrimary: true }],
          slug: 'wrist-watch',
          stock: 7
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="w-6 h-6 text-red-500" />
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
                Special Offers
              </h2>
            </div>
            <p className="text-lg text-zinc-600">
              Limited time deals with up to 50% off
            </p>
          </div>
          
          <Link 
            to="/shop?type=OFFER" 
            className="hidden md:flex items-center text-red-500 font-semibold hover:text-red-600 transition-colors group"
          >
            View All Offers
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchOfferProducts}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="md:hidden text-center mt-8">
          <Link 
            to="/shop?type=OFFER" 
            className="inline-flex items-center text-red-500 font-semibold hover:text-red-600 transition-colors group"
          >
            View All Offers
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OfferProducts;