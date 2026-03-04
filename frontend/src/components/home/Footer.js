import React from 'react';
import { 
  Facebook, Instagram, Twitter, Youtube, Linkedin, 
  Mail, Phone, MapPin, Clock, CreditCard, Shield,
  Heart, Leaf, Award, ChevronRight, Send, Star,
  Truck, RotateCcw, HeadphonesIcon, Gift
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: 'Face', icon: '✨', link: '#' },
    { name: 'Hair', icon: '💁‍♀️', link: '#' },
    { name: 'Makeup', icon: '💄', link: '#' },
    { name: 'Body', icon: '🧴', link: '#' },
    { name: 'Baby', icon: '👶', link: '#' },
    { name: 'Oil', icon: '🫒', link: '#' }
  ];

  const quickLinks = [
    { name: 'About Us', link: '#' },
    { name: 'Contact Us', link: '#' },
    { name: 'Track Order', link: '#' },
    { name: 'Returns & Refunds', link: '#' },
    { name: 'FAQs', link: '#' },
    { name: 'Shipping Policy', link: '#' },
    { name: 'Privacy Policy', link: '#' },
    { name: 'Terms & Conditions', link: '#' }
  ];

  const customerService = [
    { name: 'My Account', link: '#' },
    { name: 'Order History', link: '#' },
    { name: 'Wishlist', link: '#' },
    { name: 'Newsletter', link: '#' },
    { name: 'Store Locator', link: '#' },
    { name: 'Gift Cards', link: '#' },
    { name: 'Offers', link: '#' }
  ];

  const contactInfo = [
    { icon: Phone, text: '+91 98765 43210', link: 'tel:+919876543210' },
    { icon: Mail, text: 'support@glownatural.com', link: 'mailto:support@glownatural.com' },
    { icon: MapPin, text: 'Mumbai, Maharashtra - 400001', link: '#' },
    { icon: Clock, text: 'Mon-Sat: 9:00 AM - 8:00 PM', link: '#' }
  ];

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'Rupay', icon: '🏦' },
    { name: 'UPI', icon: '📱' },
    { name: 'Paytm', icon: '🟠' },
    { name: 'PhonePe', icon: '📲' },
    { name: 'Google Pay', icon: '🟢' },
    { name: 'Cash on Delivery', icon: '💵' }
  ];

  const features = [
    { icon: Truck, text: 'Free Shipping', subtext: 'On orders above ₹499' },
    { icon: RotateCcw, text: '7 Days Return', subtext: 'Easy returns' },
    { icon: Shield, text: '100% Authentic', subtext: 'Genuine products' },
    { icon: HeadphonesIcon, text: '24/7 Support', subtext: 'Dedicated help' }
  ];

  const awards = [
    { year: '2023', title: 'Best Beauty Brand', org: 'Cosmo Awards' },
    { year: '2022', title: 'Customer Choice', org: 'Beauty Insider' },
    { year: '2021', title: 'Natural Excellence', org: 'Green Awards' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Features Strip */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 group cursor-pointer">
                <div className="p-3 bg-gray-800 rounded-full group-hover:bg-pink-600 transition duration-300">
                  <feature.icon size={24} className="text-gray-300 group-hover:text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{feature.text}</p>
                  <p className="text-xs text-gray-400">{feature.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-pink-500">Glow</span>
              <span className="text-purple-400">Natural</span>
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              India's most trusted natural beauty brand. 100% toxin-free, cruelty-free, and made with love.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 mb-6">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition group">
                <Facebook size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition group">
                <Instagram size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition group">
                <Twitter size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition group">
                <Youtube size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition group">
                <Linkedin size={18} className="text-gray-400 group-hover:text-white" />
              </a>
            </div>

            {/* Awards */}
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Award size={18} className="text-pink-500 mr-2" />
                Awards & Recognition
              </h3>
              {awards.map((award, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm mb-2">
                  <span className="text-pink-500 font-bold">{award.year}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{award.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="w-1 h-5 bg-pink-500 rounded-full mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.link} 
                    className="text-sm text-gray-400 hover:text-pink-500 transition flex items-center group"
                  >
                    <ChevronRight size={14} className="mr-1 group-hover:translate-x-1 transition" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="w-1 h-5 bg-purple-500 rounded-full mr-2"></span>
              Customer Service
            </h3>
            <ul className="space-y-2">
              {customerService.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.link} 
                    className="text-sm text-gray-400 hover:text-pink-500 transition flex items-center group"
                  >
                    <ChevronRight size={14} className="mr-1 group-hover:translate-x-1 transition" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-white text-sm font-semibold mb-2 flex items-center">
                <Mail size={14} className="text-pink-500 mr-1" />
                Subscribe to Newsletter
              </h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-pink-500 text-sm"
                />
                <button className="bg-pink-600 px-3 py-2 rounded-r-lg hover:bg-pink-700 transition group">
                  <Send size={16} className="group-hover:translate-x-1 transition" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Get 10% off on your first order
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="w-1 h-5 bg-green-500 rounded-full mr-2"></span>
              Shop by Category
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat, index) => (
                <a 
                  key={index} 
                  href={cat.link}
                  className="text-sm text-gray-400 hover:text-pink-500 transition flex items-center space-x-1 group"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </a>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex space-x-2">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Leaf size={20} className="text-green-500" />
              </div>
              <div className="bg-pink-500/20 p-2 rounded-lg">
                <Heart size={20} className="text-pink-500" />
              </div>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Shield size={20} className="text-purple-500" />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="w-1 h-5 bg-yellow-500 rounded-full mr-2"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.link} 
                    className="flex items-start space-x-3 text-sm text-gray-400 hover:text-pink-500 transition group"
                  >
                    <item.icon size={18} className="text-gray-500 group-hover:text-pink-500 flex-shrink-0" />
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Download App */}
            <div className="mt-6">
              <h4 className="text-white text-sm font-semibold mb-3">Download App</h4>
              <div className="flex space-x-2">
                <a href="#" className="flex-1 bg-black p-2 rounded-lg hover:bg-gray-900 transition">
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.6 12.9c-.1-2.4 1.9-3.6 2-3.7-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.8-3.5.8-.7 0-1.8-.8-3-.8-1.5.1-3 1-3.8 2.4-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2-.1 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.2-2.6-.1 0-2.4-.9-2.4-3.4zM15.3 4.4c.6-.8 1.1-1.9.9-3-.9.1-2 .6-2.6 1.4-.6.7-1.1 1.8-1 2.9.9 0 1.9-.5 2.7-1.3z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-[8px] text-gray-400">Download on</p>
                      <p className="text-xs font-semibold text-white">App Store</p>
                    </div>
                  </div>
                </a>
                <a href="#" className="flex-1 bg-black p-2 rounded-lg hover:bg-gray-900 transition">
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm8 10v-4h4v-2h-4V7h-2v4H7v2h4v4h2z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-[8px] text-gray-400">Get it on</p>
                      <p className="text-xs font-semibold text-white">Google Play</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <CreditCard size={20} className="text-gray-500" />
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 flex items-center space-x-1">
                    <span>{method.icon}</span>
                    <span>{method.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center space-x-4">
              <img src="https://images.dmca.com/Badges/dmca-badge-w100-5x1-07.png" alt="DMCA" className="h-6" />
              <img src="https://www.pcisecuritystandards.org/pci_security/images/pci_logo_sm.png" alt="PCI" className="h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
            <p>© {currentYear} GlowNatural. All rights reserved. Made with <Heart size={12} className="inline text-pink-500 mx-1" /> in India</p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-pink-500 transition">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-pink-500 transition">Terms of Use</a>
              <span>•</span>
              <a href="#" className="hover:text-pink-500 transition">Sitemap</a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 left-4 bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition hover:scale-110 z-50"
      >
        <ChevronRight size={20} className="rotate-[-90deg]" />
      </button>
    </footer>
  );
};

export default Footer;