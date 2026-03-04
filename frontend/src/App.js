import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col pt-16">
          <Toaster
            position="top-center"
            toastOptions={{
              className: 'font-medium text-sm',
              style: {
                background: '#18181b', // zinc-900
                color: '#fff',
                borderRadius: '8px',
              }
            }}
          />
          <Navbar />
          <main className="flex-grow flex flex-col relative w-full h-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;