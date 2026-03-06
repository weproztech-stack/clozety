// Format price in Indian Rupees
export const formatPrice = (price) => {
  if (!price && price !== 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Calculate discount percentage
export const calculateDiscount = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

// Truncate text
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

// Get primary image
export const getPrimaryImage = (images) => {
  if (!images || images.length === 0) return null;
  return images.find(img => img.isPrimary) || images[0];
};

// Extract products from API response
export const extractProducts = (data) => {
  return data?.data?.data || data?.data || data || [];
};

// Build query string
export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  return query.toString() ? `?${query.toString()}` : '';
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Generate star rating
export const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push('★');
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push('½');
    } else {
      stars.push('☆');
    }
  }
  return stars.join('');
};