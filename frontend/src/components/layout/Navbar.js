// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ShoppingBag, User, LogOut } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// const Navbar = () => {
//     const { user, logout } = useAuth();
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     return (
//         <nav className="fixed top-0 w-full z-50 glass">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between h-16 items-center">

//                     {/* Logo */}
//                     <Link to="/" className="flex-shrink-0 flex items-center">
//                         <span className="text-2xl font-bold tracking-tighter text-zinc-900">
//                             CLOZETY
//                         </span>
//                     </Link>

//                     {/* Navigation Links */}
//                     <div className="hidden md:flex space-x-8">
//                         <Link to="/shop" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Shop</Link>
//                         <Link to="/categories" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Categories</Link>
//                         <Link to="/about" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">About</Link>
//                     </div>

//                     {/* Right Icons */}
//                     <div className="flex items-center space-x-6">
//                         <button className="text-zinc-600 hover:text-zinc-900 transition-colors relative">
//                             <ShoppingBag className="w-5 h-5" />
//                             <span className="absolute -top-1.5 -right-2 bg-zinc-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
//                         </button>

//                         {user ? (
//                             <div className="flex items-center space-x-4">
//                                 <Link to="/profile" className="flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
//                                     <div className="w-8 h-8 bg-zinc-100 rounded-full flex justify-center items-center border border-zinc-200 mr-2">
//                                         {user.avatar ? (
//                                             <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
//                                         ) : (
//                                             <span className="text-xs font-bold">{user.name.charAt(0)}</span>
//                                         )}
//                                     </div>
//                                     <span className="hidden md:block">{user.name.split(' ')[0]}</span>
//                                 </Link>
//                                 <button onClick={handleLogout} className="text-zinc-400 hover:text-red-500 transition-colors" title="Logout">
//                                     <LogOut className="w-5 h-5" />
//                                 </button>
//                             </div>
//                         ) : (
//                             <Link to="/login" className="flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
//                                 <User className="w-5 h-5 mr-1" />
//                                 Sign In
//                             </Link>
//                         )}
//                     </div>

//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;



















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

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();

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
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
                CLOZETY
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">
                Home
              </Link>
              
              {/* Categories Dropdown */}
              <div className="relative group">
                <button 
                  className="flex items-center text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors"
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                >
                  Categories
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                
                {showCategories && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-zinc-200 py-2 z-50"
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => setShowCategories(false)}
                  >
                    {CATEGORIES.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.id}`}
                        className="flex items-center px-4 py-2 hover:bg-zinc-50 text-sm text-zinc-700"
                      >
                        <span className="mr-3">{cat.icon}</span>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/shop" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">
                Shop All
              </Link>
              <Link to="/new-arrivals" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">
                New Arrivals
              </Link>
              <Link to="/offers" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                Special Offers
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-5">
              {/* Search Button */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="text-zinc-600 hover:text-zinc-900 transition-colors relative hidden md:block">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-zinc-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="text-zinc-600 hover:text-zinc-900 transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-zinc-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="hidden md:flex items-center text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-zinc-800 to-zinc-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="hidden md:block text-zinc-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden md:flex items-center text-sm font-medium text-zinc-700 hover:text-zinc-900 transition-colors">
                  <User className="w-5 h-5 mr-1" />
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-zinc-600 hover:text-zinc-900"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-zinc-200 bg-white py-4 px-4">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  autoFocus
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
                <button 
                  type="submit"
                  className="absolute right-3 top-2 px-4 py-1.5 bg-zinc-900 text-white rounded-md text-sm hover:bg-zinc-800"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-white py-4 px-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-zinc-700 py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="text-zinc-700 py-2" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
              <Link to="/new-arrivals" className="text-zinc-700 py-2" onClick={() => setIsMenuOpen(false)}>New Arrivals</Link>
              <Link to="/offers" className="text-red-600 py-2" onClick={() => setIsMenuOpen(false)}>Special Offers</Link>
              <Link to="/wishlist" className="text-zinc-700 py-2 flex items-center" onClick={() => setIsMenuOpen(false)}>
                <Heart className="w-5 h-5 mr-2" />
                Wishlist ({wishlist.length})
              </Link>
              
              <div className="border-t border-zinc-200 pt-4">
                <p className="text-sm font-medium text-zinc-500 mb-2">Categories</p>
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.id}`}
                    className="flex items-center py-2 text-zinc-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{cat.icon}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>

              {user ? (
                <div className="border-t border-zinc-200 pt-4">
                  <Link to="/profile" className="flex items-center text-zinc-700 py-2" onClick={() => setIsMenuOpen(false)}>
                    <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white mr-3">
                      {user.name?.charAt(0)}
                    </div>
                    {user.name}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-red-500 py-2 w-full"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-zinc-200 pt-4 space-y-3">
                  <Link 
                    to="/login" 
                    className="block w-full text-center py-2 bg-zinc-900 text-white rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full text-center py-2 border border-zinc-300 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <div className="h-16"></div> {/* Spacer */}
    </>
  );
};

export default Navbar;