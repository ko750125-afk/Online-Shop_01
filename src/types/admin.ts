export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  category?: string;
}

export interface OrderRecord {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  address: string;
  total_amount: number;
  items: OrderItem[];
  status: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
}
