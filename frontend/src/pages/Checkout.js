import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/common/Breadcrumb';
import { formatPrice } from '../utils/helpers';
import { Truck, Shield, CreditCard } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
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
    if (!user) {
      navigate('/login');
      return;
    }
    if (!cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
    fetchAddresses();
  }, [user, cart]);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/api/users/addresses');
      setAddresses(response.data.addresses || []);
      const defaultAddr = response.data.addresses?.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/users/addresses', newAddress);
      setAddresses([...addresses, response.data.address]);
      setSelectedAddress(response.data.address);
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
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          street: selectedAddress.addressLine1,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip: selectedAddress.pincode,
          country: 'India'
        },
        paymentMethod,
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price
        })),
        totalPrice: cart.totalPrice
      };

      const response = await api.post('/api/orders', orderData);
      
      if (paymentMethod === 'online') {
        // Redirect to payment gateway
        const paymentResponse = await api.post('/api/payments', {
          orderId: response.data.order._id,
          amount: cart.totalPrice + (cart.totalPrice * 0.18)
        });
        window.location.href = paymentResponse.data.paymentUrl;
      } else {
        // Cash on delivery
        await clearCart();
        navigate(`/orders/${response.data.order._id}`);
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.totalPrice || 0;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Cart', path: '/cart' },
        { label: 'Checkout', path: '/checkout' }
      ]} />

      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    s <= step ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {s}
                </motion.div>
                <div className={`ml-2 text-sm font-medium ${
                  s <= step ? 'text-zinc-900' : 'text-zinc-500'
                }`}>
                  {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                </div>
                {s < 3 && <div className="w-16 h-px bg-zinc-300 mx-4"></div>}
              </div>
            ))}
          </div>

          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-zinc-900">Shipping Address</h2>
              
              {/* Existing Addresses */}
              <div className="space-y-3">
                {addresses.map(address => (
                  <label key={address._id} className="flex items-start p-4 border rounded-lg cursor-pointer hover:border-zinc-900 transition-colors">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?._id === address._id}
                      onChange={() => setSelectedAddress(address)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900">{address.fullName}</p>
                      <p className="text-sm text-zinc-600">{address.addressLine1}</p>
                      {address.addressLine2 && (
                        <p className="text-sm text-zinc-600">{address.addressLine2}</p>
                      )}
                      <p className="text-sm text-zinc-600">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="text-sm text-zinc-600">Phone: {address.phone}</p>
                    </div>
                  </label>
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
                    Save Address
                  </button>
                </form>
              </details>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedAddress}
                className="w-full px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </motion.div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-zinc-900">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-zinc-900 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-zinc-900">Cash on Delivery</p>
                    <p className="text-sm text-zinc-600">Pay when you receive your order</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-zinc-900 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-zinc-900">Online Payment</p>
                    <p className="text-sm text-zinc-600">Pay via Credit/Debit Card, UPI, NetBanking</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-zinc-300 rounded-lg font-semibold hover:bg-zinc-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800"
                >
                  Continue to Review
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review Order */}
          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-zinc-900">Review Order</h2>
              
              {/* Shipping Address */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-zinc-900 mb-2">Shipping Address</h3>
                <p className="text-sm text-zinc-600">{selectedAddress?.fullName}</p>
                <p className="text-sm text-zinc-600">{selectedAddress?.addressLine1}</p>
                {selectedAddress?.addressLine2 && (
                  <p className="text-sm text-zinc-600">{selectedAddress.addressLine2}</p>
                )}
                <p className="text-sm text-zinc-600">
                  {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
                </p>
                <p className="text-sm text-zinc-600">Phone: {selectedAddress?.phone}</p>
              </div>

              {/* Payment Method */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-zinc-900 mb-2">Payment Method</h3>
                <p className="text-sm text-zinc-600">
                  {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
              </div>

              {/* Order Items */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-zinc-900 mb-2">Order Items</h3>
                <div className="space-y-3">
                  {cart.items?.map(item => (
                    <div key={item.product._id} className="flex justify-between text-sm">
                      <span className="text-zinc-600">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-medium text-zinc-900">
                        {formatPrice((item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cart.items?.map(item => (
                <div key={item.product._id} className="flex justify-between text-sm">
                  <span className="text-zinc-600">{item.product.name} x {item.quantity}</span>
                  <span className="font-medium text-zinc-900">
                    {formatPrice((item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
              
              <div className="border-t border-zinc-200 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Subtotal</span>
                  <span className="font-medium text-zinc-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-zinc-600">Tax (GST 18%)</span>
                  <span className="font-medium text-zinc-900">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-zinc-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-zinc-200 mt-3 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-zinc-900">Total</span>
                    <span className="font-bold text-zinc-900 text-lg">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3 pt-4 border-t border-zinc-200">
              <div className="flex items-center text-sm text-zinc-600">
                <Truck className="w-4 h-4 mr-2 text-zinc-400" />
                Free shipping on all orders
              </div>
              <div className="flex items-center text-sm text-zinc-600">
                <Shield className="w-4 h-4 mr-2 text-zinc-400" />
                100% secure payment
              </div>
              <div className="flex items-center text-sm text-zinc-600">
                <CreditCard className="w-4 h-4 mr-2 text-zinc-400" />
                Easy returns within 30 days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;