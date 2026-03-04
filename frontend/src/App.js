// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/Products/ProductsList';
import AddProduct from './pages/Products/AddProduct';
import EditProduct from './pages/Products/EditProduct';
import ProductDetails from './pages/Products/ProductDetails';
import UsersList from './pages/Users/UsersList';
import UserDetails from './pages/Users/UserDetails';
import OrdersList from './pages/Orders/OrdersList';
import OrderDetails from './pages/Orders/OrderDetails';
import CategoriesList from './pages/Categories/CategoriesList';
import AddCategory from './pages/Categories/AddCategory';

// User Pages (if you have separate user dashboard)
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/Users/UserProfile';
import UserOrders from './pages/Users/UserOrders';
import UserLayout from './pages/Users/UserLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes - Only accessible by admin */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="categories/add" element={<AddCategory />} />
          </Route>

          
          <Route path="/user" element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }>



            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="orders" element={<UserOrders />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;