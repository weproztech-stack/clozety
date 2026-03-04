import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-bold tracking-tighter text-zinc-900">
                            CLOZETY
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-8">
                        <Link to="/shop" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Shop</Link>
                        <Link to="/categories" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Categories</Link>
                        <Link to="/about" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">About</Link>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-6">
                        <button className="text-zinc-600 hover:text-zinc-900 transition-colors relative">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute -top-1.5 -right-2 bg-zinc-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                        </button>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                                    <div className="w-8 h-8 bg-zinc-100 rounded-full flex justify-center items-center border border-zinc-200 mr-2">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-bold">{user.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <span className="hidden md:block">{user.name.split(' ')[0]}</span>
                                </Link>
                                <button onClick={handleLogout} className="text-zinc-400 hover:text-red-500 transition-colors" title="Logout">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                                <User className="w-5 h-5 mr-1" />
                                Sign In
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
