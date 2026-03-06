import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import ProductSkeleton from '../products/ProductSkeleton';
import api from '../../utils/api';
import { extractProducts } from '../../utils/helpers';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await api.get('/api/products?sortBy=createdAt&sortOrder=desc&limit=4&status=active');
      const productsData = extractProducts(response.data);
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching new arrivals:', err);
      setError('Failed to load new arrivals');
      
      // Fallback data
      setProducts([
        {
          _id: '9',
          name: 'Denim Jacket',
          price: 4499,
          discountPrice: 0,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500', isPrimary: true }],
          slug: 'denim-jacket',
          stock: 15
        },
        {
          _id: '10',
          name: 'Leather Boots',
          price: 5999,
          discountPrice: 0,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500', isPrimary: true }],
          slug: 'leather-boots',
          stock: 10
        },
        {
          _id: '11',
          name: 'Cashmere Sweater',
          price: 7999,
          discountPrice: 0,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500', isPrimary: true }],
          slug: 'cashmere-sweater',
          stock: 8
        },
        {
          _id: '12',
          name: 'Designer Perfume',
          price: 8999,
          discountPrice: 0,
          images: [{ imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500', isPrimary: true }],
          slug: 'designer-perfume',
          stock: 12
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-6 h-6 text-zinc-900" />
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900">
                New Arrivals
              </h2>
            </div>
            <p className="text-lg text-zinc-600">
              Fresh styles just added to our collection
            </p>
          </div>
          
          <Link 
            to="/shop?sortBy=createdAt_desc" 
            className="hidden md:flex items-center text-zinc-900 font-semibold hover:text-zinc-600 transition-colors group"
          >
            View All New
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
              onClick={fetchNewArrivals}
              className="px-6 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
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
            to="/shop?sortBy=createdAt_desc" 
            className="inline-flex items-center text-zinc-900 font-semibold hover:text-zinc-600 transition-colors group"
          >
            View All New Arrivals
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;