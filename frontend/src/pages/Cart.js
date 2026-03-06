import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import Breadcrumb from '../components/common/Breadcrumb';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const [updatingId, setUpdatingId] = useState(null);

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    
    setUpdatingId(productId);
    await updateQuantity(productId, newQuantity);
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-200 rounded w-48 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Cart', path: '/cart' }]} />
        
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-zinc-100 rounded-full mb-6">
            <ShoppingBag className="w-12 h-12 text-zinc-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Your Cart is Empty</h2>
          <p className="text-zinc-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 transition-colors"
          >
            Start Shopping
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Calculate real-time totals
  const subtotal = cart.totalPrice;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Cart', path: '/cart' }]} />

      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Shopping Cart ({cart.items.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const itemPrice = item.product?.discountPrice > 0 
              ? item.product.discountPrice 
              : item.product?.price || 0;
            const itemTotal = itemPrice * item.quantity;
            const isUpdating = updatingId === item.product?._id;

            return (
              <div key={item.product?._id} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
                {/* Product Image */}
                <Link to={`/product/${item.product?.slug}`} className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/100'}
                    alt={item.product?.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1">
                  <Link to={`/product/${item.product?.slug}`} className="font-semibold text-zinc-900 hover:text-zinc-600">
                    {item.product?.name}
                  </Link>
                  <p className="text-sm text-zinc-500 mt-1">{item.product?.category?.name || 'Product'}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-zinc-300 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.product?._id, item.quantity, -1)}
                        disabled={item.quantity <= 1 || isUpdating}
                        className="px-3 py-1 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {isUpdating ? '...' : item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product?._id, item.quantity, 1)}
                        disabled={item.quantity >= (item.product?.stock || 0) || isUpdating}
                        className="px-3 py-1 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-zinc-900">
                        {formatPrice(itemTotal)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product?._id)}
                        className="text-red-500 hover:text-red-600"
                        disabled={isUpdating}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  {item.product?.discountPrice > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="text-zinc-400 line-through mr-2">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <span className="text-green-600">
                        You save {formatPrice((item.product.price - item.product.discountPrice) * item.quantity)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-medium text-zinc-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Tax (GST 18%)</span>
                <span className="font-medium text-zinc-900">{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-zinc-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-zinc-900">Total</span>
                  <span className="font-bold text-zinc-900 text-lg">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Inclusive of all taxes</p>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full flex items-center justify-center px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 transition-colors mb-3"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="w-full flex items-center justify-center px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg font-semibold hover:bg-zinc-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;