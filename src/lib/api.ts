const API_URLS = {
  auth: 'https://functions.poehali.dev/5940ece1-ee87-4d04-bc45-ecc2a87db578',
  listings: 'https://functions.poehali.dev/69ebbd89-2fe1-474c-bbae-d131c9ca87da'
};

export interface User {
  id: number;
  email: string;
  name: string;
  city?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Listing {
  id: number;
  title: string;
  description?: string;
  price: number;
  category: string;
  partType: string;
  city: string;
  imageUrl?: string;
  inStock: boolean;
  views: number;
  seller: string;
  sellerCity?: string;
  createdAt: string;
}

export const api = {
  async register(email: string, password: string, name: string, city: string): Promise<AuthResponse> {
    const res = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password, name, city })
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Ошибка регистрации');
    }
    
    return res.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Ошибка входа');
    }
    
    return res.json();
  },

  async getListings(filters?: {
    category?: string;
    part_type?: string;
    city?: string;
    search?: string;
  }): Promise<Listing[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.part_type) params.set('part_type', filters.part_type);
    if (filters?.city) params.set('city', filters.city);
    if (filters?.search) params.set('search', filters.search);
    
    const url = `${API_URLS.listings}${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error('Ошибка загрузки объявлений');
    }
    
    const data = await res.json();
    return data.listings;
  },

  async createListing(listing: {
    user_id: number;
    title: string;
    description?: string;
    price: number;
    category: string;
    part_type: string;
    city: string;
    image_url?: string;
  }): Promise<{ id: number; message: string }> {
    const res = await fetch(API_URLS.listings, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing)
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Ошибка создания объявления');
    }
    
    return res.json();
  }
};
