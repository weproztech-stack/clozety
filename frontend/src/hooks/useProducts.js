import { useState, useEffect } from 'react';
import api from '../utils/api';
import { extractProducts } from '../utils/helpers';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0
  });

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `/api/products${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await api.get(url);
      const productsData = extractProducts(response.data);
      
      setProducts(productsData);
      setPagination({
        total: response.data.pagination?.total || response.data.total || productsData.length,
        page: response.data.pagination?.page || response.data.page || 1,
        limit: response.data.pagination?.limit || response.data.limit || 12,
        pages: response.data.pagination?.pages || response.data.pages || Math.ceil(productsData.length / 12)
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(initialParams);
  }, []);

  return { products, loading, error, pagination, fetchProducts };
};