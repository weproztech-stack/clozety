// client/src/pages/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/${slug}`, {
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Product not found');

      const data = await response.json();
      const productData = data.data || data;
      
      setProduct(productData);
      setSelectedImage(productData.images?.find(img => img.isPrimary) || productData.images?.[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  if (loading) return <div>Loading...</div>;
  if (error || !product) return <div>Product not found</div>;

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPercent = product.discountPrice > 0 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  return (
    <div className="product-detail">
      <div className="product-images">
        <div className="main-image">
          <img src={selectedImage?.imageUrl || product.images?.[0]?.imageUrl} alt={product.name} />
        </div>
        {product.images?.length > 1 && (
          <div className="thumbnails">
            {product.images.map(img => (
              <img 
                key={img._id}
                src={img.imageUrl}
                alt=""
                onClick={() => setSelectedImage(img)}
                className={selectedImage?._id === img._id ? 'active' : ''}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        
        <div className="price">
          <span className="current">{formatPrice(finalPrice)}</span>
          {product.discountPrice > 0 && (
            <>
              <span className="original">{formatPrice(product.price)}</span>
              <span className="discount">{discountPercent}% OFF</span>
            </>
          )}
        </div>

        <div className="stock">
          Status: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </div>

        <div className="description">
          <h3>Description</h3>
          <p>{product.description || product.shortDescription || 'No description available'}</p>
        </div>

        <button 
          className="add-to-cart"
          disabled={product.stock === 0}
          onClick={() => alert('Add to cart coming soon!')}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;