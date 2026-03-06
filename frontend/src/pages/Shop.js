import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import ProductSkeleton from '../components/products/ProductSkeleton';
import Breadcrumb from '../components/common/Breadcrumb';
import api from '../utils/api';
import { buildQueryString, extractProducts } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0
  });

  // Parse URL params
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    return {
      category: params.get('category') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      sortBy: params.get('sortBy') || 'createdAt',
      sortOrder: params.get('sortOrder') || 'desc',
      search: params.get('search') || '',
      page: parseInt(params.get('page')) || 1,
      limit: 12
    };
  });

  useEffect(() => {
    fetchProducts();
  }, [location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryString = buildQueryString(filters);
      const response = await api.get(`/api/products${queryString}`);
      
      setProducts(extractProducts(response.data));
      setPagination({
        total: response.data.pagination?.total || 0,
        page: response.data.pagination?.page || 1,
        limit: response.data.pagination?.limit || 12,
        pages: response.data.pagination?.pages || 0
      });
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    const queryString = buildQueryString(newFilters);
    navigate(`/shop${queryString}`);
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    
    const queryString = buildQueryString(newFilters);
    navigate(`/shop${queryString}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      search: '',
      page: 1,
      limit: 12
    };
    setFilters(emptyFilters);
    navigate('/shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: filters.search ? `Search: ${filters.search}` : 'Shop', path: '/shop' }
        ]} 
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <ProductFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900">
              {filters.search ? `Search Results for "${filters.search}"` : 'All Products'}
            </h1>
            <p className="text-sm text-zinc-500">
              {pagination.total} products found
            </p>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="px-6 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductGrid products={products} />
                
                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-8">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-zinc-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-zinc-600">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 border border-zinc-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Shop;