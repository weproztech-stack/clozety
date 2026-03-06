export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: '💻', color: 'from-blue-500 to-cyan-500' },
  { id: 'fashion', name: 'Fashion', icon: '👕', color: 'from-purple-500 to-pink-500' },
  { id: 'home', name: 'Home & Living', icon: '🏠', color: 'from-green-500 to-emerald-500' },
  { id: 'books', name: 'Books', icon: '📚', color: 'from-yellow-500 to-orange-500' },
  { id: 'beauty', name: 'Beauty', icon: '💄', color: 'from-red-500 to-rose-500' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: 'from-indigo-500 to-purple-500' },
];

export const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'views_desc', label: 'Most Popular' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

export const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { label: 'Over ₹25,000', min: 25000, max: null },
];

export const BRANDS = [
  { id: 'nike', name: 'Nike', logo: '🏃' },
  { id: 'adidas', name: 'Adidas', logo: '👟' },
  { id: 'puma', name: 'Puma', logo: '🐆' },
  { id: 'zara', name: 'Zara', logo: '👔' },
  { id: 'h&m', name: 'H&M', logo: '🛍️' },
  { id: 'levis', name: "Levi's", logo: '👖' },
];