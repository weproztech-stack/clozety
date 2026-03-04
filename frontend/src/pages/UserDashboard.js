// pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, User, Clock, ChevronRight } from 'lucide-react';
import { userApi } from '../services/api';
import Loader from '../components/common/Loader';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    wishlistCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [ordersRes] = await Promise.all([
        userApi.getMyOrders()
      ]);
      
      const orders = ordersRes.data || [];
      setRecentOrders(orders.slice(0, 5));
      
      // Calculate stats
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.orderStatus === 'pending').length,
        totalSpent: orders.reduce((sum, order) => sum + order.totalPrice, 0),
        wishlistCount: 0 // You can implement wishlist later
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent.toFixed(2)}`,
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: 'Wishlist',
      value: stats.wishlistCount,
      icon: User,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-indigo-100">Manage your orders and profile from your dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link
            to="/user/orders"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b last:border-0">
                    <td className="py-3 text-sm font-medium">#{order._id.slice(-8)}</td>
                    <td className="py-3 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm font-medium">${order.totalPrice}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/user/orders/${order._id}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet</p>
            <Link
              to="/products"
              className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link
          to="/user/profile"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <User className="w-8 h-8 text-indigo-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Profile Settings</h3>
          <p className="text-sm text-gray-600">Update your personal information</p>
        </Link>
        
        <Link
          to="/user/orders"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <ShoppingBag className="w-8 h-8 text-indigo-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Order History</h3>
          <p className="text-sm text-gray-600">View all your orders</p>
        </Link>
        
        <Link
          to="/products"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <Package className="w-8 h-8 text-indigo-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Continue Shopping</h3>
          <p className="text-sm text-gray-600">Browse our products</p>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;