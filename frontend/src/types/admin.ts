export interface Admin {
  id: string;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  last_login: string | null;
}

export interface AdminLogin {
  username: string;
  password: string;
}

export interface AdminRegister {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  admin: Admin;
}

export interface DashboardStats {
  counts: {
    contacts: number;
    gallery_images: number;
    service_requests: number;
    quotes: number;
  };
  recent_contacts: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    created_at: string;
  }>;
  recent_uploads: Array<{
    id: string;
    title: string;
    category: string;
    image_url: string;
    uploaded_at: string;
  }>;
  gallery_categories: Array<{
    name: string;
    count: number;
  }>;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  subcategory: string | null;
  featured: boolean;
  views: number;
  likes: number;
  uploaded_at: string;
}