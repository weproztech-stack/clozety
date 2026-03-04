import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await register(name, email, password);

        setIsSubmitting(false);
        if (result.success) {
            navigate('/');
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center bg-zinc-50 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">

            {/* Decorative blurred background blobs */}
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-zinc-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full glass-card p-10 rounded-2xl relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Create an account</h2>
                    <p className="mt-2 text-sm text-zinc-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-zinc-900 hover:underline transition-all">
                            Sign in
                        </Link>
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-zinc-400" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 block w-full outline-none border border-zinc-200 rounded-lg py-3 px-4 text-zinc-900 bg-white/50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all sm:text-sm"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Email address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-zinc-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 block w-full outline-none border border-zinc-200 rounded-lg py-3 px-4 text-zinc-900 bg-white/50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-zinc-400" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 block w-full outline-none border border-zinc-200 rounded-lg py-3 px-4 text-zinc-900 bg-white/50 focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all sm:text-sm"
                                placeholder="••••••••"
                                minLength={8}
                            />
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">Must be at least 8 characters</p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
