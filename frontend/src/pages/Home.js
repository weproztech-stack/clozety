// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Shield, Truck, Clock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/home/Footer';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: ShoppingBag,
      title: 'Quality Products',
      description: 'Best quality products at affordable prices'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: '100% secure payments and data protection'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick delivery to your doorstep'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round the clock customer support'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Our Store
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover amazing products at great prices
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-xl mb-4">Welcome back, {user?.name}!</p>
                <Link
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
                  className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-4 bg-indigo-100 rounded-full mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product cards will be populated from API */}
            {/* You can add a FeaturedProducts component here */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;