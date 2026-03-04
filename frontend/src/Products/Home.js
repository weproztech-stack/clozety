// client/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState({
    trending: [],
    offers: [],
    newArrivals: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      // Ek saath sab fetch karo - parallel calls
      const [trendingRes, offersRes, newRes] = await Promise.all([
        // 🔥 TRENDING: Sort by views (baad mein kaam karega), abhi createdAt se
        fetch(`${API_URL}/api/products?sortBy=createdAt&sortOrder=desc&limit=4&status=active`),
        
        // 🔥 OFFERS: Type=OFFER wale products
        fetch(`${API_URL}/api/products?type=OFFER&limit=4&status=active`),
        
        // 🔥 NEW ARRIVALS: Latest products
        fetch(`${API_URL}/api/products?sortBy=createdAt&sortOrder=desc&limit=4&status=active`)
      ]);

      // Parse responses
      const trendingData = await trendingRes.json();
      const offersData = await offersRes.json();
      const newData = await newRes.json();

      console.log('Trending:', trendingData);
      console.log('Offers:', offersData);
      console.log('New:', newData);

      // Extract products from response (aapke response structure ke according)
      const trendingProducts = trendingData.data?.data || trendingData.data || trendingData || [];
      const offerProducts = offersData.data?.data || offersData.data || offersData || [];
      const newProducts = newData.data?.data || newData.data || newData || [];

      setProducts({
        trending: trendingProducts,
        offers: offerProducts,
        newArrivals: newProducts
      });

    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback agar OFFER type se kuch na mile
  const fetchOfferFallback = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products?limit=8&status=active`);
      const data = await response.json();
      const allProducts = data.data?.data || data.data || data || [];
      
      // Frontend par filter: jinka discountPrice > 0
      const discountedProducts = allProducts.filter(p => p.discountPrice > 0);
      
      setProducts(prev => ({
        ...prev,
        offers: discountedProducts.slice(0, 4)
      }));
    } catch (err) {
      console.error('Fallback error:', err);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Product Card Component
  const ProductCard = ({ product }) => {
    const [imageError, setImageError] = useState(false);
    
    // Primary image ya first image
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
    const discountPercent = product.discountPrice > 0 
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
      : 0;

    return (
      <div className="product-card">
        <Link to={`/product/${product.slug || product._id}`} className="product-link">
          <div className="product-image-container">
            <img
              src={imageError ? 'https://via.placeholder.com/300' : (primaryImage?.imageUrl || 'https://via.placeholder.com/300')}
              alt={product.name || 'Product'}
              className="product-image"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {discountPercent > 0 && (
              <span className="discount-badge">{discountPercent}% OFF</span>
            )}
            {product.stock === 0 && (
              <span className="out-of-stock-badge">Out of Stock</span>
            )}
          </div>
          
          <div className="product-info">
            <h3 className="product-name">
              {product.name?.length > 50 
                ? `${product.name.substring(0, 50)}...` 
                : product.name || 'Product Name'}
            </h3>
            
            <div className="product-price">
              <span className="current-price">{formatPrice(finalPrice)}</span>
              {product.discountPrice > 0 && (
                <span className="original-price">{formatPrice(product.price)}</span>
              )}
            </div>
            
            {product.categories?.length > 0 && (
              <div className="product-category">
                {product.categories[0]?.name || 'Category'}
              </div>
            )}
          </div>
        </Link>
        
        <button 
          className="add-to-cart-btn"
          onClick={() => handleAddToCart(product._id)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    );
  };

  const handleAddToCart = (productId) => {
    // Cart functionality baad mein implement karenge
    alert('Add to cart feature coming soon!');
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="product-grid">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="product-card skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text small"></div>
          <div className="skeleton-button"></div>
        </div>
      ))}
    </div>
  );

  // Product Section Component
  const ProductSection = ({ title, products, viewAllLink }) => (
    <section className="product-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <Link to={viewAllLink} className="view-all-link">
          View All <span className="arrow">→</span>
        </Link>
      </div>
      
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <p>No products available in this category.</p>
        </div>
      )}
    </section>
  );

  if (loading) {
    return (
      <div className="home-container">
        <div className="hero-section skeleton-hero"></div>
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchAllProducts} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products at great prices</p>
          <Link to="/products" className="shop-now-btn">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Trending Products */}
      {products.trending.length > 0 && (
        <ProductSection
          title="Trending Products"
          products={products.trending}
          viewAllLink="/products?sortBy=views"
        />
      )}

      {/* Special Offers */}
      {products.offers.length > 0 ? (
        <ProductSection
          title="Special Offers"
          products={products.offers}
          viewAllLink="/products?type=OFFER"
        />
      ) : (
        // Agar offers nahi hain to fallback
        <ProductSection
          title="Special Offers"
          products={products.newArrivals.slice(0, 4)}
          viewAllLink="/products"
        />
      )}

      {/* New Arrivals */}
      {products.newArrivals.length > 0 && (
        <ProductSection
          title="New Arrivals"
          products={products.newArrivals}
          viewAllLink="/products?sortBy=createdAt"
        />
      )}

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          <Link to="/products?category=electronics" className="category-card">
            <h3>Electronics</h3>
          </Link>
          <Link to="/products?category=fashion" className="category-card">
            <h3>Fashion</h3>
          </Link>
          <Link to="/products?category=home" className="category-card">
            <h3>Home & Living</h3>
          </Link>
          <Link to="/products?category=books" className="category-card">
            <h3>Books</h3>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;