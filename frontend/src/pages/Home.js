import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoryShowcase from '../components/home/CategoryShowcase';
import BentoFeatures from '../components/home/BentoFeatures';
import TrendingProducts from '../components/home/TrendingProducts';
import OfferProducts from '../components/home/OfferProducts';
import NewArrivals from '../components/home/NewArrivals';
import BrandStrip from '../components/home/BrandStrip';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryShowcase />
      <BentoFeatures />
      <TrendingProducts />
      <OfferProducts />
      <NewArrivals />
      <BrandStrip />
    </div>
  );
};

export default Home;