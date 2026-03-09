import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield,
  Truck,
  ChevronRight
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-300">
      {/* Features Bar */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center md:justify-start space-x-3 group text-center md:text-left">
              <Truck className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
              <div>
                <h4 className="text-white font-semibold">Free Shipping</h4>
                <p className="text-sm text-zinc-400">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 group text-center md:text-left">
              <Shield className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
              <div>
                <h4 className="text-white font-semibold">Secure Payment</h4>
                <p className="text-sm text-zinc-400">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 group text-center md:text-left">
              <CreditCard className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
              <div>
                <h4 className="text-white font-semibold">Easy Returns</h4>
                <p className="text-sm text-zinc-400">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">CLOZETY</h3>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
              Your premier destination for modern fashion. Quality products, exceptional service, and timeless style.
            </p>
            <div className="flex space-x-4 justify-center sm:justify-start">
              <a href="#" className="text-zinc-400 hover:text-white transition-all hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-all hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-all hover:scale-110">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 leading-relaxed">
              {['About Us', 'Contact Us', 'FAQs', 'Shipping Info', 'Returns Policy'].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 leading-relaxed">
              {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={`/shop?category=${item.toLowerCase()}`} 
                    className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 leading-relaxed">
              <li className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5 group-hover:text-white transition-colors" />
                <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">123 Fashion Street, Mumbai - 400001</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">support@clozety.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-zinc-800 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-white font-semibold mb-2">Subscribe to Our Newsletter</h4>
            <p className="text-sm text-zinc-400 mb-4 leading-relaxed">Get 10% off on your first order</p>
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all"
              />
              <button className="w-full sm:w-auto px-6 py-2 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-100 transition-all hover:scale-105">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} CLOZETY. All rights reserved. Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;