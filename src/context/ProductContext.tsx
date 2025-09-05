import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';
import { initialProducts } from '../data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('krishna-products');
    return stored ? JSON.parse(stored) : initialProducts;
  });

  const addProduct = (product: Product) => {
    const newProducts = [...products, product];
    setProducts(newProducts);
    localStorage.setItem('krishna-products', JSON.stringify(newProducts));
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    const newProducts = products.map(product =>
      product.id === id ? { ...product, ...updatedProduct } : product
    );
    setProducts(newProducts);
    localStorage.setItem('krishna-products', JSON.stringify(newProducts));
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(product => product.id !== id);
    setProducts(newProducts);
    localStorage.setItem('krishna-products', JSON.stringify(newProducts));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};