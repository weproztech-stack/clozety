import React from 'react';
import { BRANDS } from '../../utils/constants';

const BrandStrip = () => {
  return (
    <section className="py-12 bg-white border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-zinc-500 uppercase tracking-wider mb-8">
          Trusted by leading brands
        </p>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
          {BRANDS.map(brand => (
            <div 
              key={brand.id}
              className="text-4xl filter grayscale hover:grayscale-0 transition-all cursor-pointer transform hover:scale-110"
              title={brand.name}
            >
              {brand.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStrip;