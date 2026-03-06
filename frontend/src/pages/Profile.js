import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Package, Heart, LogOut, Edit2, Save } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'addresses') fetchAddresses();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/orders/my');
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/users/addresses');
      setAddresses(response.data.addresses || []);
    } catch (error) {
      toast.error('Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/api/users/me', profileData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/users/addresses', newAddress);
      setAddresses([...addresses, response.data.address]);
      setNewAddress({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
      toast.success('Address added successfully');
    } catch (error) {
      toast.error('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await api.delete(`/api/users/addresses/${addressId}`);
      setAddresses(addresses.filter(addr => addr._id !== addressId));
      toast.success('Address deleted successfully');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Profile', path: '/profile' }
      ]} />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h2 className="font-semibold text-zinc-900">{user?.name}</h2>
              <p className="text-sm text-zinc-500">{user?.email}</p>
            </div>

            <div className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-zinc-900">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-zinc-500">Name</label>
                      <p className="font-medium text-zinc-900">{user?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-zinc-500">Email</label>
                      <p className="font-medium text-zinc-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-zinc-500">Phone</label>
                      <p className="font-medium text-zinc-900">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-zinc-900 mb-6">My Orders</h2>
                
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                    <p className="text-zinc-500">No orders yet</p>
                    <Link to="/shop" className="inline-block mt-4 px-6 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-zinc-500">Order #{order._id.slice(-8)}</p>
                            <p className="text-sm text-zinc-500">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          {order.items.slice(0, 2).map(item => (
                            <div key={item.product._id} className="flex justify-between text-sm">
                              <span className="text-zinc-600">{item.product.name} x {item.quantity}</span>
                              <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-zinc-500">+{order.items.length - 2} more items</p>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t">
                          <span className="font-bold text-zinc-900">Total: ₹{order.totalAmount}</span>
                          <Link 
                            to={`/orders/${order._id}`}
                            className="text-sm text-zinc-900 hover:underline"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Saved Addresses</h2>
                
                <div className="space-y-4 mb-6">
                  {addresses.map(address => (
                    <div key={address._id} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-zinc-900">{address.fullName}</p>
                          <p className="text-sm text-zinc-600">{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p className="text-sm text-zinc-600">{address.addressLine2}</p>
                          )}
                          <p className="text-sm text-zinc-600">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-sm text-zinc-600">Phone: {address.phone}</p>
                          {address.isDefault && (
                            <span className="inline-block mt-2 px-2 py-1 bg-zinc-100 text-zinc-600 text-xs rounded">
                              Default Address
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Address Form */}
                <details className="border rounded-lg p-4">
                  <summary className="font-medium text-zinc-900 cursor-pointer">
                    Add New Address
                  </summary>
                  <form onSubmit={handleAddAddress} className="mt-4 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2 (Optional)"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({...newAddress, addressLine2: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        required
                      />
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-zinc-600">Set as default address</span>
                    </label>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Address'}
                    </button>
                  </form>
                </details>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-xl font-bold text-zinc-900 mb-6">My Wishlist</h2>
                <Link 
                  to="/wishlist"
                  className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
                >
                  View Full Wishlist
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;