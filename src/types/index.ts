export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'pooja-items' | 'krishna-idols' | 'decorative' | 'books' | 'clothing';
  quantity: number;
  featured?: boolean;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  date: string;
}