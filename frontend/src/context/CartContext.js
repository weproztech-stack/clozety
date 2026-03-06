import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cart calculate karne ka function
  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
      const price = item.product?.discountPrice > 0 
        ? item.product.discountPrice 
        : item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Cart fetch karna
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], totalPrice: 0 });
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get('/api/cart');
      const cartData = response.data.cart || response.data;
      
      // Total price calculate karo
      const totalPrice = calculateTotalPrice(cartData.items || []);
      
      setCart({
        items: cartData.items || [],
        totalPrice: totalPrice
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [user, fetchCart]);

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      const response = await api.post('/api/cart', { productId, quantity });
      const cartData = response.data.cart || response.data;
      
      // Total price calculate karo
      const totalPrice = calculateTotalPrice(cartData.items || []);
      
      setCart({
        items: cartData.items || [],
        totalPrice: totalPrice
      });
      
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      return false;
    }
  };

  // Quantity update
  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) return false;
      
      const response = await api.put(`/api/cart/${productId}`, { quantity: newQuantity });
      const cartData = response.data.cart || response.data;
      
      // Total price calculate karo
      const totalPrice = calculateTotalPrice(cartData.items || []);
      
      setCart({
        items: cartData.items || [],
        totalPrice: totalPrice
      });
      
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      return false;
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await api.delete(`/api/cart/${productId}`);
      const cartData = response.data.cart || response.data;
      
      // Total price calculate karo
      const totalPrice = calculateTotalPrice(cartData.items || []);
      
      setCart({
        items: cartData.items || [],
        totalPrice: totalPrice
      });
      
      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      toast.error('Failed to remove item');
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await api.delete('/api/cart');
      setCart({ items: [], totalPrice: 0 });
      toast.success('Cart cleared');
      return true;
    } catch (error) {
      toast.error('Failed to clear cart');
      return false;
    }
  };

  // Cart count
  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      cartCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};