import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from '../common/BackToTop';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Layout;