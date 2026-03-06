import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="w-12 h-12 mx-auto mb-6 text-zinc-400" />
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Subscribe to Our Newsletter
        </h2>
        
        <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
          Join 10,000+ subscribers and get exclusive offers, new arrivals, and insider-only discounts straight to your inbox.
        </p>

        {subscribed ? (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 inline-flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Thanks for subscribing! Check your email.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-100 transition-colors"
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-zinc-400 mt-3">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;