import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Helper to calculate total price
  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
      // Get the current price (discount price if available)
      const price = item.product?.discountPrice > 0 
        ? item.product.discountPrice 
        : item.product?.price || 0;
      
      // Calculate item total
      const itemTotal = price * (item.quantity || 1);
      
      console.log('Calculating:', {
        product: item.product?.name,
        price,
        quantity: item.quantity,
        itemTotal,
        runningTotal: total + itemTotal
      });
      
      return total + itemTotal;
    }, 0);
  };

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], totalPrice: 0 });
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching cart...');
      const response = await api.get('/api/cart');
      console.log('Cart response:', response.data);
      
      const cartData = response.data.cart || response.data;
      const items = cartData.items || [];
      
      // Calculate total price
      const totalPrice = calculateTotalPrice(items);
      
      setCart({
        items: items,
        totalPrice: totalPrice
      });
      
      console.log('Cart updated:', { items, totalPrice });
    } catch (error) {
      console.error('Error fetching cart:', error);
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
      console.log('Adding to cart:', { productId, quantity });
      const response = await api.post('/api/cart', { productId, quantity });
      console.log('Add to cart response:', response.data);
      
      const cartData = response.data.cart || response.data;
      const items = cartData.items || [];
      
      // Calculate total price
      const totalPrice = calculateTotalPrice(items);
      
      setCart({
        items: items,
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

  // Update quantity - FIXED VERSION
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return false;
    
    try {
      console.log('Updating quantity:', { productId, newQuantity });
      
      // Call backend API
      const response = await api.put(`/api/cart/${productId}`, { quantity: newQuantity });
      console.log('Update response:', response.data);
      
      // Get updated cart from response
      const cartData = response.data.cart || response.data;
      const updatedItems = cartData.items || [];
      
      // Calculate new total price
      const newTotalPrice = calculateTotalPrice(updatedItems);
      
      // Update state with new values
      setCart({
        items: updatedItems,
        totalPrice: newTotalPrice
      });
      
      console.log('Cart updated:', { items: updatedItems, totalPrice: newTotalPrice });
      
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.response?.data?.message || 'Failed to update quantity');
      return false;
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      console.log('Removing from cart:', productId);
      const response = await api.delete(`/api/cart/${productId}`);
      console.log('Remove response:', response.data);
      
      const cartData = response.data.cart || response.data;
      const updatedItems = cartData.items || [];
      
      // Calculate new total price
      const newTotalPrice = calculateTotalPrice(updatedItems);
      
      setCart({
        items: updatedItems,
        totalPrice: newTotalPrice
      });
      
      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      console.log('Clearing cart');
      await api.delete('/api/cart');
      setCart({ items: [], totalPrice: 0 });
      toast.success('Cart cleared');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return false;
    }
  };

  // Cart count
  const cartCount = cart.items?.reduce((sum, item) => {
    return sum + (item.quantity || 0);
  }, 0) || 0;

  const value = {
    cart,
    loading,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};