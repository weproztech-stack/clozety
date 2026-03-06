import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-zinc-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
        <div className="flex items-center gap-2">
          <div className="h-6 bg-zinc-200 rounded w-20"></div>
          <div className="h-4 bg-zinc-200 rounded w-16"></div>
        </div>
        <div className="h-10 bg-zinc-200 rounded"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;