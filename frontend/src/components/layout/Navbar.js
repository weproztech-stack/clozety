import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  LogOut, 
  Heart, 
  Search, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CATEGORIES } from '../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-xl backdrop-blur-md' : 'bg-white/90 backdrop-blur-sm shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent group-hover:from-zinc-800 group-hover:to-zinc-500 transition-all">
                CLOZETY
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-zinc-900 group-hover:w-full transition-all duration-300"></span>
              </Link>
              
              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button className="flex items-center text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors group">
                  Categories
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showCategories && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-100 py-2 z-50"
                    >
                      {CATEGORIES.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/shop?category=${cat.id}`}
                          className="flex items-center px-4 py-3 hover:bg-zinc-50 text-sm text-zinc-700 transition-colors"
                          onClick={() => setShowCategories(false)}
                        >
                          <span className="mr-3 text-xl">{cat.icon}</span>
                          <span className="font-medium">{cat.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/shop" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors relative group">
                Shop All
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-zinc-900 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/new-arrivals" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors relative group">
                New Arrivals
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-zinc-900 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/offers" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors relative group">
                Special Offers
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Button */}
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-zinc-600 hover:text-zinc-900 transition-colors relative"
              >
                <Search className="w-5 h-5" />
                {isSearchOpen && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-zinc-900 rounded-full"></span>
                )}
              </motion.button>

              {/* Wishlist */}
              <Link to="/wishlist" className="text-zinc-600 hover:text-zinc-900 transition-colors relative hidden md:block group">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="text-zinc-600 hover:text-zinc-900 transition-colors relative group">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-zinc-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="hidden md:flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-zinc-800 to-zinc-600 rounded-full flex items-center justify-center text-white text-sm font-bold hover:scale-110 transition-transform">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </Link>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout} 
                    className="hidden md:block text-zinc-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <Link to="/login" className="hidden md:flex items-center text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors group">
                  <User className="w-5 h-5 mr-1 group-hover:scale-110 transition-transform" />
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-zinc-600 hover:text-zinc-900"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-zinc-200 bg-white overflow-hidden"
            >
              <div className="max-w-3xl mx-auto py-4 px-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for products, brands, and more..."
                    className="w-full pl-12 pr-20 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    autoFocus
                  />
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
                  <button 
                    type="submit"
                    className="absolute right-3 top-2 px-4 py-1.5 bg-zinc-900 text-white rounded-lg text-sm hover:bg-zinc-800 transition-colors font-medium"
                  >
                    Search
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-zinc-200 bg-white overflow-y-auto max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)]"
            >
              <div className="px-4 py-4">
                <div className="flex flex-col space-y-3">
                  <Link to="/" className="text-zinc-700 py-2 hover:text-zinc-900 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Home
                  </Link>
                  <Link to="/shop" className="text-zinc-700 py-2 hover:text-zinc-900 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Shop All
                  </Link>
                  <Link to="/new-arrivals" className="text-zinc-700 py-2 hover:text-zinc-900 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    New Arrivals
                  </Link>
                  <Link to="/offers" className="text-red-600 py-2 hover:text-red-700 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Special Offers
                  </Link>
                  <Link to="/wishlist" className="text-zinc-700 py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <Heart className="w-5 h-5 mr-2" />
                    Wishlist ({wishlist.length})
                  </Link>
                  
                  <div className="border-t border-zinc-200 pt-4">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
                      onClick={() => setIsMobileCategoriesOpen(prev => !prev)}
                    >
                      <span>Categories</span>
                      <ChevronDown
                        className={`ml-2 w-4 h-4 transition-transform ${
                          isMobileCategoriesOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isMobileCategoriesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2 space-y-2"
                        >
                          {CATEGORIES.map(cat => (
                            <Link
                              key={cat.id}
                              to={`/shop?category=${cat.id}`}
                              className="flex items-center py-2 text-zinc-700 hover:text-zinc-900 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="mr-3 text-xl">{cat.icon}</span>
                              <span className="text-sm">{cat.name}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {user ? (
                    <div className="border-t border-zinc-200 pt-4">
                      <Link 
                        to="/profile" 
                        className="flex items-center justify-between py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 mb-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>My Account</span>
                      </Link>
                      <Link to="/profile" className="flex items-center text-zinc-700 py-2 hover:text-zinc-900 transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white mr-3">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center text-red-500 py-2 w-full hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="border-t border-zinc-200 pt-4 space-y-3">
                      <Link 
                        to="/login" 
                        className="block w-full text-center py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        to="/register" 
                        className="block w-full text-center py-3 border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;