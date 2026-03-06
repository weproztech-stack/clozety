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
  Truck
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-300">
      {/* Features Bar */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Truck className="w-6 h-6 text-zinc-400" />
              <div>
                <h4 className="text-white font-semibold">Free Shipping</h4>
                <p className="text-sm text-zinc-400">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Shield className="w-6 h-6 text-zinc-400" />
              <div>
                <h4 className="text-white font-semibold">Secure Payment</h4>
                <p className="text-sm text-zinc-400">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <CreditCard className="w-6 h-6 text-zinc-400" />
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
            <p className="text-sm text-zinc-400 mb-4">
              Your premier destination for modern fashion. Quality products, exceptional service, and timeless style.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-sm text-zinc-400 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="text-sm text-zinc-400 hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-sm text-zinc-400 hover:text-white transition-colors">Returns Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/shop?category=electronics" className="text-sm text-zinc-400 hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/shop?category=fashion" className="text-sm text-zinc-400 hover:text-white transition-colors">Fashion</Link></li>
              <li><Link to="/shop?category=home" className="text-sm text-zinc-400 hover:text-white transition-colors">Home & Living</Link></li>
              <li><Link to="/shop?category=books" className="text-sm text-zinc-400 hover:text-white transition-colors">Books</Link></li>
              <li><Link to="/shop?category=beauty" className="text-sm text-zinc-400 hover:text-white transition-colors">Beauty</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-400">123 Fashion Street, Mumbai - 400001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-zinc-400" />
                <span className="text-sm text-zinc-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-zinc-400" />
                <span className="text-sm text-zinc-400">support@clozety.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-zinc-800 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-white font-semibold mb-2">Subscribe to Our Newsletter</h4>
            <p className="text-sm text-zinc-400 mb-4">Get 10% off on your first order</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
              />
              <button className="px-6 py-2 bg-white text-zinc-900 rounded-lg font-semibold hover:bg-zinc-100 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} CLOZETY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;