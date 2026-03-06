import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, PRICE_RANGES } from '../../utils/constants';

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (categoryId) => {
    onFilterChange('category', categoryId === filters.category ? '' : categoryId);
  };

  const handlePriceRangeChange = (range) => {
    onFilterChange('minPrice', range.min);
    onFilterChange('maxPrice', range.max);
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('_');
    onFilterChange('sortBy', sortBy);
    onFilterChange('sortOrder', sortOrder);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-semibold text-zinc-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat.id} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.category === cat.id}
                onChange={() => handleCategoryChange(cat.id)}
                className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900"
              />
              <span className="ml-2 text-sm text-zinc-600">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Ranges */}
      <div>
        <h4 className="font-semibold text-zinc-900 mb-3">Price Range</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, index) => (
            <label key={index} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                onChange={() => handlePriceRangeChange(range)}
                className="w-4 h-4 text-zinc-900 border-zinc-300 focus:ring-zinc-900"
              />
              <span className="ml-2 text-sm text-zinc-600">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h4 className="font-semibold text-zinc-900 mb-3">Sort By</h4>
        <select
          value={`${filters.sortBy}_${filters.sortOrder}`}
          onChange={handleSortChange}
          className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        >
          <option value="createdAt_desc">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="views_desc">Most Popular</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>

      {/* Special Filters */}
      <div>
        <h4 className="font-semibold text-zinc-900 mb-3">Special</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isTrending === 'true'}
              onChange={(e) => onFilterChange('isTrending', e.target.checked ? 'true' : '')}
              className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900"
            />
            <span className="ml-2 text-sm text-zinc-600">Trending Products</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isOffer === 'true'}
              onChange={(e) => onFilterChange('isOffer', e.target.checked ? 'true' : '')}
              className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900"
            />
            <span className="ml-2 text-sm text-zinc-600">Special Offers</span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.category || filters.minPrice || filters.isTrending || filters.isOffer) && (
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <FiltersContent />
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center px-4 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters & Sort
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <FiltersContent />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;