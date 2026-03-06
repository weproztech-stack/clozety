export const CATEGORIES = [
  { id: 'body-care', name: 'Body Care', icon: '🧴', color: 'from-purple-500 to-pink-500' },
  { id: 'skin-care', name: 'Skin Care', icon: '✨', color: 'from-blue-500 to-cyan-500' },
  { id: 'hair-care', name: 'Hair Care', icon: '💇', color: 'from-green-500 to-emerald-500' },
  { id: 'makeup', name: 'Makeup', icon: '💄', color: 'from-red-500 to-rose-500' },
  { id: 'face-care', name: 'Face Care', icon: '🧖‍♀️', color: 'from-orange-500 to-yellow-500' },
  { id: 'natural-organic', name: 'Natural & Organic', icon: '🌿', color: 'from-emerald-500 to-green-600' },
  { id: 'fragrance', name: 'Fragrance', icon: '🌸', color: 'from-pink-500 to-fuchsia-500' },
  { id: 'mens-grooming', name: "Men's Grooming", icon: '🧔', color: 'from-gray-600 to-gray-800' },
  { id: 'bath-shower', name: 'Bath & Shower', icon: '🛁', color: 'from-cyan-500 to-blue-500' },
  { id: 'beauty-tools', name: 'Beauty Tools', icon: '🪞', color: 'from-indigo-500 to-purple-500' },
];

export const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'views_desc', label: 'Most Popular' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
  { label: '₹2,500 - ₹5,000', min: 2500, max: 5000 },
  { label: 'Over ₹5,000', min: 5000, max: null },
];

export const BRANDS = [
  { id: 'nike', name: 'Nike', logo: '🏃' },
  { id: 'adidas', name: 'Adidas', logo: '👟' },
  { id: 'puma', name: 'Puma', logo: '🐆' },
  { id: 'zara', name: 'Zara', logo: '👔' },
  { id: 'h&m', name: 'H&M', logo: '🛍️' },
  { id: 'levis', name: "Levi's", logo: '👖' },
];

export const ORDER_STATUS = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
];