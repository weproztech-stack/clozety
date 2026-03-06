import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import api from '../utils/api';
import { formatPrice } from '../utils/helpers';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders/my');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Orders', path: '/orders' }
      ]} />

      <h1 className="text-3xl font-bold text-zinc-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Package className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 mb-2">No orders yet</h2>
          <p className="text-zinc-500 mb-6">Looks like you haven't placed any orders.</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
          >
            Start Shopping
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link 
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-zinc-500">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-zinc-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.slice(0, 2).map(item => (
                    <div key={item.product._id} className="flex justify-between text-sm">
                      <span className="text-zinc-600">{item.product.name} x {item.quantity}</span>
                      <span className="font-medium text-zinc-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-zinc-500">+{order.items.length - 2} more items</p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <span className="text-sm text-zinc-500">Total Amount</span>
                    <p className="text-lg font-bold text-zinc-900">{formatPrice(order.totalAmount)}</p>
                  </div>
                  <div className="flex items-center text-zinc-900 text-sm font-medium">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;