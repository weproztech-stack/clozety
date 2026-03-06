import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/products/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';

const Wishlist = () => {
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Wishlist', path: '/wishlist' }
      ]} />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">My Wishlist</h1>
        <span className="text-zinc-500">{wishlist.length} items</span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-zinc-100 rounded-full mb-6">
            <Heart className="w-12 h-12 text-zinc-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Your Wishlist is Empty</h2>
          <p className="text-zinc-600 mb-8">Save your favorite items here and shop them later.</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800 transition-colors"
          >
            Explore Products
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(item => (
            <ProductCard 
              key={item.product?._id || item._id} 
              product={item.product || item} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;