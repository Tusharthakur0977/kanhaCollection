import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group transform hover:scale-105 hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110">
            <Heart className="w-4 h-4 text-red-500" />
          </button>
        </div>
        {product.featured && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
            Featured
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-orange-600">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            {product.quantity} in stock
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;