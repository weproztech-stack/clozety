import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import ProductSkeleton from '../components/products/ProductSkeleton';
import Breadcrumb from '../components/common/Breadcrumb';
import api from '../utils/api';
import { extractProducts } from '../utils/helpers';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: categoryId,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [categoryId]);

  const fetchCategoryAndProducts = async () => {
    setLoading(true);
    try {
      // Fetch category details
      const categoryRes = await api.get(`/api/categories/${categoryId}`);
      setCategory(categoryRes.data);

      // Fetch products for this category
      const productsRes = await api.get(`/api/products?category=${categoryId}`);
      setProducts(extractProducts(productsRes.data));
    } catch (err) {
      setError('Failed to load category products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const fetchProducts = async (filterParams) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filterParams).toString();
      const response = await api.get(`/api/products?${queryParams}`);
      setProducts(extractProducts(response.data));
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb 
        items={[
          { label: 'Home', path: '/' },
          { label: 'Categories', path: '/categories' },
          { label: category?.name || 'Category', path: '#' }
        ]} 
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">{category?.name}</h1>
        {category?.description && (
          <p className="text-zinc-600">{category.description}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <ProductFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={() => navigate(`/category/${categoryId}`)}
        />

        <div className="flex-1">
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={fetchCategoryAndProducts}
                className="px-6 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-zinc-500">
                  {products.length} products found
                </p>
              </div>
              <ProductGrid products={products} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;