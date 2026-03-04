import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="flex-grow flex items-center justify-center bg-zinc-50 text-zinc-900">
            <div className="text-center px-4 max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
                    Welcome to <span className="text-zinc-600">CLOZETY</span>
                </h1>

                {user ? (
                    <div className="space-y-6">
                        <p className="text-xl text-zinc-600 mb-8">
                            Hello, <span className="font-semibold text-zinc-900">{user.name}</span>! Welcome back to the premier fashion destination.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link to="/shop" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-zinc-900 hover:bg-zinc-800 transition-colors">
                                Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <p className="text-xl text-zinc-600 mb-8">
                            Discover the latest trends in modern fashion. High quality, minimalist, elegant.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link to="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-colors">
                                Create Account
                            </Link>
                            <Link to="/login" className="inline-flex items-center px-6 py-3 border border-zinc-300 text-base font-medium rounded-lg text-zinc-700 bg-white hover:bg-zinc-50 transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
