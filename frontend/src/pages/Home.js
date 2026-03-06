import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoryShowcase from '../components/home/CategoryShowcase';
import TrendingProducts from '../components/home/TrendingProducts';
import OfferProducts from '../components/home/OfferProducts';
import NewArrivals from '../components/home/NewArrivals';
import BrandStrip from '../components/home/BrandStrip';
// import Newsletter from '../components/home/Newsletter';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryShowcase />
      <TrendingProducts />
      <OfferProducts />
      <NewArrivals />
      <BrandStrip />
      {/* <Newsletter /> */}
    </div>
  );
};

export default Home; 