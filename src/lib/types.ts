export interface Category {
  id: string;
  name: string;
  name_hi: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Medicine {
  id: string;
  category_id: string | null;
  name: string;
  name_hi: string;
  description: string | null;
  benefits: string | null;
  ingredients: string | null;
  dosage: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_name: string;
  phone: string;
  email: string | null;
  age: number | null;
  gender: string | null;
  address: string | null;
  problem: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string | null;
  pincode: string | null;
  payment_method: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  medicine_id: string | null;
  medicine_name: string;
  medicine_image: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}
