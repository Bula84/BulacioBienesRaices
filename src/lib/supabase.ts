import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types for our database tables
export interface Propiedad {
    id: string;
    title: string;
    description?: string;
    full_description?: string; // Extended description for detail page
    price: number;
    operation: 'venta' | 'alquiler';
    type: string;
    m2: number;
    m2_covered?: number; // Covered area
    bedrooms?: number;
    bathrooms?: number;
    parking?: number; // Parking spaces
    floors?: number; // Number of floors
    year_built?: number;
    coords_lat: number;
    coords_lng: number;
    image_url: string;
    images?: string[]; // Gallery images
    video_url?: string; // Video tour URL (YouTube, Vimeo, or direct MP4)
    address?: string;
    city?: string;
    neighborhood?: string;
    zip_code?: string;
    // Amenities
    has_pool?: boolean;
    has_garden?: boolean;
    has_terrace?: boolean;
    has_balcony?: boolean;
    has_gym?: boolean;
    has_security?: boolean;
    has_elevator?: boolean;
    has_laundry?: boolean;
    has_storage?: boolean;
    has_ac?: boolean;
    has_heating?: boolean;
    pets_allowed?: boolean;
    // Contact
    contact_phone?: string;
    contact_whatsapp?: string;
    contact_email?: string;
    // Meta
    user_id?: string;
    created_at: string;
    updated_at?: string;
}

export interface Noticia {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    image_url: string;
    author?: string;
    user_id?: string;
    created_at: string;
}

export interface Servicio {
    id: string;
    name: string;
    skill_tags: string[];
    contact: string;
    phone?: string;
    email?: string;
    rating: number;
    image_url: string;
    category: string;
    description?: string;
    user_id?: string;
    created_at: string;
}

export interface UserRole {
    id: string;
    user_id: string;
    email: string;
    role: 'pending' | 'admin' | 'superadmin';
    approved_by?: string;
    approved_at?: string;
    created_at: string;
}

// Initialize Supabase client (handles missing credentials for demo mode)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if credentials exist
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Export for use in other modules
export { supabase };


// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;

// ===== PROPIEDADES =====

export async function getPropiedades(filters?: {
    operation?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
}): Promise<Propiedad[]> {
    if (!supabase) return [];

    let query = supabase.from('propiedades').select('*');

    if (filters?.operation) {
        query = query.eq('operation', filters.operation);
    }
    if (filters?.type) {
        query = query.eq('type', filters.type);
    }
    if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
    }
    if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching propiedades:', error.message || error);
        return [];
    }

    return data || [];
}

export async function getPropiedad(id: string): Promise<Propiedad | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('propiedades')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching propiedad:', error);
        return null;
    }

    return data as Propiedad;
}

export async function createPropiedad(propiedad: Omit<Propiedad, 'id' | 'created_at'>): Promise<Propiedad | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('propiedades')
        .insert(propiedad)
        .select()
        .single();

    if (error) {
        console.error('Error creating propiedad:', error);
        return null;
    }

    return data as Propiedad;
}

export async function updatePropiedad(id: string, propiedad: Partial<Propiedad>): Promise<Propiedad | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('propiedades')
        .update(propiedad)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating propiedad:', error);
        return null;
    }

    return data as Propiedad;
}

export async function deletePropiedad(id: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('propiedades')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting propiedad:', error);
        return false;
    }

    return true;
}

// ===== NOTICIAS =====

export async function getNoticias(): Promise<Noticia[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching noticias:', error);
        return [];
    }

    return data as Noticia[];
}

export async function getNoticia(id: string): Promise<Noticia | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching noticia:', error);
        return null;
    }

    return data as Noticia;
}

export async function createNoticia(noticia: Omit<Noticia, 'id' | 'created_at'>): Promise<Noticia | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('noticias')
        .insert(noticia)
        .select()
        .single();

    if (error) {
        console.error('Error creating noticia:', error);
        return null;
    }

    return data as Noticia;
}

export async function updateNoticia(id: string, noticia: Partial<Noticia>): Promise<Noticia | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('noticias')
        .update(noticia)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating noticia:', error);
        return null;
    }

    return data as Noticia;
}

export async function deleteNoticia(id: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('noticias')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting noticia:', error);
        return false;
    }

    return true;
}

// ===== SERVICIOS =====

export async function getServicios(category?: string): Promise<Servicio[]> {
    if (!supabase) return [];

    let query = supabase.from('servicios').select('*');

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
        console.error('Error fetching servicios:', error);
        return [];
    }

    return data as Servicio[];
}

export async function getServicio(id: string): Promise<Servicio | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching servicio:', error);
        return null;
    }

    return data as Servicio;
}

export async function createServicio(servicio: Omit<Servicio, 'id' | 'created_at'>): Promise<Servicio | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('servicios')
        .insert(servicio)
        .select()
        .single();

    if (error) {
        console.error('Error creating servicio:', error);
        return null;
    }

    return data as Servicio;
}

export async function updateServicio(id: string, servicio: Partial<Servicio>): Promise<Servicio | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('servicios')
        .update(servicio)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating servicio:', error);
        return null;
    }

    return data as Servicio;
}

export async function deleteServicio(id: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('servicios')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting servicio:', error);
        return false;
    }

    return true;
}

// ===== CATEGORIES =====

export async function getServiceCategories(): Promise<string[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('servicios')
        .select('category')
        .order('category');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    // Get unique categories
    const categories = [...new Set(data?.map(item => item.category))];
    return categories.filter(Boolean) as string[];
}

export async function getPropertyTypes(): Promise<string[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('propiedades')
        .select('type')
        .order('type');

    if (error) {
        console.error('Error fetching property types:', error);
        return [];
    }

    const types = [...new Set(data?.map(item => item.type))];
    return types.filter(Boolean) as string[];
}

// ===== USER-SCOPED DATA =====

export async function getPropiedadesByUser(userId: string, filters?: {
    operation?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
}): Promise<Propiedad[]> {
    if (!supabase) return [];

    let query = supabase.from('propiedades').select('*').eq('user_id', userId);

    if (filters?.operation) {
        query = query.eq('operation', filters.operation);
    }
    if (filters?.type) {
        query = query.eq('type', filters.type);
    }
    if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
    }
    if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user propiedades:', error);
        return [];
    }

    return data as Propiedad[];
}

export async function getNoticiasByUser(userId: string): Promise<Noticia[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user noticias:', error);
        return [];
    }

    return data as Noticia[];
}

export async function getServiciosByUser(userId: string, category?: string): Promise<Servicio[]> {
    if (!supabase) return [];

    let query = supabase.from('servicios').select('*').eq('user_id', userId);

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
        console.error('Error fetching user servicios:', error);
        return [];
    }

    return data as Servicio[];
}

// ===== USER ROLES =====

export async function getUserRole(userId: string): Promise<UserRole | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching user role:', error);
        return null;
    }

    return data as UserRole;
}

export async function getAllUserRoles(): Promise<UserRole[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all user roles:', error);
        return [];
    }

    return data as UserRole[];
}

export async function updateUserRole(
    userId: string,
    role: 'pending' | 'admin' | 'superadmin',
    approvedBy?: string
): Promise<UserRole | null> {
    if (!supabase) return null;

    const updateData: Record<string, unknown> = {
        role,
        updated_at: new Date().toISOString(),
    };

    if (role !== 'pending' && approvedBy) {
        updateData.approved_by = approvedBy;
        updateData.approved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from('user_roles')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating user role:', error);
        return null;
    }

    return data as UserRole;
}

export async function createUserRole(
    userId: string,
    email: string,
    role: 'pending' | 'admin' | 'superadmin' = 'pending'
): Promise<UserRole | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('user_roles')
        .insert({
            user_id: userId,
            email,
            role,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating user role:', error);
        return null;
    }

    return data as UserRole;
}

export async function deleteUserRole(userId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

    if (error) {
        console.error('Error deleting user role:', error);
        return false;
    }

    return true;
}


