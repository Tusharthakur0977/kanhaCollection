import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { state } = useCart();
  const location = useLocation();
  const itemCount = state.items.reduce((total, item) => total + item.cartQuantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-yellow-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-orange-500" fill="currentColor" />
            </div>
            <span className="text-white font-bold text-xl">Kanha Collection</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/') ? 'bg-white text-orange-600' : 'text-white hover:bg-orange-400'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/products" 
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('/products') ? 'bg-white text-orange-600' : 'text-white hover:bg-orange-400'
              }`}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('/about') ? 'bg-white text-orange-600' : 'text-white hover:bg-orange-400'
              }`}
            >
              About
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/cart" 
              className="relative p-2 text-white hover:bg-orange-400 rounded-md transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link 
              to="/admin" 
              className="p-2 text-white hover:bg-orange-400 rounded-md transition-colors"
            >
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;