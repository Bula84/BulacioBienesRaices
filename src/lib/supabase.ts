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
    // Agent / AI
    expensas?: number;
    requisitos?: string;
    calendar_id?: string;
    agent_enabled?: boolean;
    // Meta
    user_id?: string;
    created_at: string;
    updated_at?: string;
    is_featured?: boolean;
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
    images?: string[]; // Gallery of past jobs/projects
    video_url?: string; // Video presentation
    category: string;
    description?: string;
    full_description?: string; // Long description for detail page
    budget_info?: string; // Information on how budgets are offered
    techniques?: string[]; // Techniques managed
    certifications?: string[]; // Certifications and courses
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

export interface Publicacion {
    id: string;
    title: string;
    content: string;
    image_url?: string;
    video_url?: string;
    propiedad_id?: string;
    // Facebook
    facebook_status: 'pending' | 'published' | 'failed' | 'skipped';
    facebook_post_id?: string;
    facebook_published_at?: string;
    facebook_error?: string;
    // Instagram
    instagram_status: 'pending' | 'published' | 'failed' | 'skipped';
    instagram_post_id?: string;
    instagram_published_at?: string;
    instagram_error?: string;
    // TikTok
    tiktok_status: 'pending' | 'published' | 'failed' | 'skipped';
    tiktok_post_id?: string;
    tiktok_published_at?: string;
    tiktok_error?: string;
    // Scheduling
    scheduled_for?: string;
    user_id?: string;
    created_at: string;
    updated_at?: string;
}

export interface SocialMediaConfig {
    id: string;
    platform: 'facebook' | 'instagram' | 'tiktok';
    access_token?: string;
    refresh_token?: string;
    page_id?: string;
    account_id?: string;
    expires_at?: string;
    is_active: boolean;
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
    isFeatured?: boolean;
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
    if (filters?.isFeatured) {
        query = query.eq('is_featured', true);
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

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        // Not a valid UUID, return null silently (will show demo data)
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('propiedades')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            // Don't log for single row not found errors
            if (error.code !== 'PGRST116') {
                console.error('Error fetching propiedad:', error.message || error);
            }
            return null;
        }

        return data as Propiedad;
    } catch (e) {
        console.error('Error in getPropiedad:', e);
        return null;
    }
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

    const { data, error } = await supabase
        .from('propiedades')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error deleting propiedad:', error);
        return false;
    }

    if (!data || data.length === 0) {
        console.error('No se pudo eliminar la propiedad. RLS puede estar bloqueando.');
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

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        return null;
    }

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

    const { data, error } = await supabase
        .from('servicios')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error deleting servicio:', error);
        return false;
    }

    if (!data || data.length === 0) {
        console.error('No se pudo eliminar el servicio. Verifica permisos.');
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

// =====================================================
// PUBLICACIONES (Social Media Posts)
// =====================================================

export async function getPublicaciones(): Promise<Publicacion[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('publicaciones')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching publicaciones:', error.message || error);
        return [];
    }

    return data || [];
}

export async function getPublicacionesByUser(userId: string): Promise<Publicacion[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('publicaciones')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching publicaciones:', error.message || error);
        return [];
    }

    return data || [];
}

export async function createPublicacion(publicacion: Omit<Publicacion, 'id' | 'created_at'>): Promise<Publicacion | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('publicaciones')
        .insert(publicacion)
        .select()
        .single();

    if (error) {
        console.error('Error creating publicacion:', error.message || error);
        return null;
    }

    return data as Publicacion;
}

export async function updatePublicacion(id: string, updates: Partial<Publicacion>): Promise<Publicacion | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('publicaciones')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating publicacion:', error.message || error);
        return null;
    }

    return data as Publicacion;
}

export async function deletePublicacion(id: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('publicaciones')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting publicacion:', error.message || error);
        return false;
    }

    return true;
}

// Trigger social media publishing via Edge Function
export async function publishToSocialMedia(publicacionId: string): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return { success: false, error: 'No database connection' };

    try {
        const { data, error } = await supabase.functions.invoke('publish-social-media', {
            body: { publicacion_id: publicacionId }
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, ...data };
    } catch {
        return { success: false, error: 'Failed to invoke publishing function' };
    }
}

// ===== SITE CONFIG =====

export interface ContactInfo {
    phone: string;
    email: string;
    whatsapp: string;
    address: string;
    business_hours: string;
}

export async function getContactInfo(): Promise<ContactInfo> {
    const defaults: ContactInfo = {
        phone: '+54 11 1234-5678',
        email: 'contacto@bcbienesraices.com',
        whatsapp: '+5411123456789',
        address: 'Buenos Aires, Argentina',
        business_hours: 'Lunes a Viernes 9:00 - 18:00',
    };
    if (!supabase) return defaults;

    const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'contact_info')
        .single();

    if (error || !data) return defaults;
    return { ...defaults, ...(data.value as ContactInfo) };
}

export async function updateContactInfo(info: ContactInfo): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('site_config')
        .upsert({
            key: 'contact_info',
            value: info,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });

    if (error) {
        console.error('Error actualizando configuración:', error);
        return false;
    }
    return true;
}

// ===== CONFIGURACIÓN GENÉRICA (site_config) =====

/** Lee una clave de `site_config`. Devuelve `null` si no existe. */
export async function getSiteConfig<T = Record<string, unknown>>(key: string): Promise<T | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', key)
        .single();

    if (error || !data) return null;
    return data.value as T;
}

/** Escribe (upsert) una clave de `site_config`. */
export async function setSiteConfig(key: string, value: unknown): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('site_config')
        .upsert({
            key,
            value,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });

    if (error) {
        console.error(`Error guardando site_config[${key}]:`, error);
        return false;
    }
    return true;
}

// ===== MENSAJES DE CONTACTO =====

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
    source: string;
    is_read: boolean;
    created_at: string;
}

export async function submitContactMessage(msg: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('contact_messages')
        .insert(msg);

    if (error) {
        console.error('Error enviando mensaje:', error);
        return false;
    }
    return true;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error obteniendo mensajes:', error);
        return [];
    }
    return data as ContactMessage[];
}

export async function markMessageRead(id: string, is_read: boolean): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('contact_messages')
        .update({ is_read })
        .eq('id', id);

    if (error) return false;
    return true;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

    if (error) return false;
    return true;
}

// ===== AGENTE IA - CHAT =====

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface ChatConversation {
    id: string;
    property_id: string;
    visitor_name?: string;
    visitor_phone?: string;
    visitor_email?: string;
    is_qualified: boolean;
    visit_scheduled: boolean;
    messages: ChatMessage[];
    created_at: string;
    updated_at: string;
}

export async function createChatConversation(propertyId: string): Promise<ChatConversation | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ property_id: propertyId, messages: [] })
        .select()
        .single();

    if (error) {
        console.error('Error creando conversación:', error);
        return null;
    }
    return data as ChatConversation;
}

// ===== SOCIAL MEDIA CONFIG =====

export async function getSocialMediaConfigs(): Promise<SocialMediaConfig[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('social_media_config')
        .select('*')
        .order('platform');

    if (error) {
        console.error('Error fetching social media limits:', error);
        return [];
    }

    return data as SocialMediaConfig[];
}

export async function upsertSocialMediaConfig(config: Partial<SocialMediaConfig>): Promise<boolean> {
    if (!supabase) return false;

    // ensure platform exists
    if (!config.platform) return false;

    const { error } = await supabase
        .from('social_media_config')
        .upsert({
            ...config,
            updated_at: new Date().toISOString()
        }, { onConflict: 'platform' });

    if (error) {
        console.error('Error upserting social media config:', error);
        return false;
    }

    return true;
}

export async function updateChatConversation(id: string, updates: Partial<ChatConversation>): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('chat_conversations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) return false;
    return true;
}

export async function getChatConversations(propertyId?: string): Promise<ChatConversation[]> {
    if (!supabase) return [];

    let query = supabase.from('chat_conversations').select('*').order('updated_at', { ascending: false });
    if (propertyId) query = query.eq('property_id', propertyId);

    const { data, error } = await query;
    if (error) return [];
    return data as ChatConversation[];
}

export async function sendAgentMessage(
    conversationId: string,
    propertyId: string,
    message: string,
    history: ChatMessage[]
): Promise<{ reply: string; qualified?: boolean; visitScheduled?: boolean } | null> {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase.functions.invoke('property-agent', {
            body: {
                conversation_id: conversationId,
                property_id: propertyId,
                message,
                history,
            },
        });

        if (error) {
            console.error('Error agente:', error);
            return null;
        }

        return data;
    } catch (e) {
        console.error('Error invocando agente:', e);
        return null;
    }
}

// =====================================================
// GESTIÓN LEGAL — casos de cobranza de mora
// =====================================================

export interface LegalCase {
    id: string;
    contact_name: string;
    contact_email: string;
    contact_phone?: string | null;
    contact_role?: string | null;
    debtor_name?: string | null;
    contract_type?: string | null;
    amount?: number | null;
    days_overdue?: number | null;
    stage: 'extrajudicial' | 'judicial' | 'sin_determinar';
    details?: string | null;
    ai_summary?: string | null;
    status: 'nuevo' | 'en_revision' | 'contactado' | 'cerrado';
    is_read: boolean;
    notified_at?: string | null;
    created_at: string;
    updated_at?: string;
}

/** Conversa con el asistente de Gestión Legal (Edge Function `gestion-legal`). */
export async function sendLegalChat(
    message: string,
    history: ChatMessage[]
): Promise<{ reply: string; resumen?: string | null } | null> {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase.functions.invoke('gestion-legal', {
            body: { action: 'chat', message, history },
        });
        if (error) {
            console.error('Error asistente legal:', error);
            return null;
        }
        return data;
    } catch (e) {
        console.error('Error invocando asistente legal:', e);
        return null;
    }
}

/**
 * Deriva el caso al equipo: lo guarda en `legal_cases` y dispara la
 * notificación por email al asesor (Edge Function `gestion-legal`).
 */
export async function submitLegalCase(
    caso: Omit<LegalCase, 'id' | 'status' | 'is_read' | 'created_at' | 'updated_at' | 'stage'> & { stage?: LegalCase['stage'] },
    resumen?: string | null
): Promise<boolean> {
    if (!supabase) return false;

    try {
        const { data, error } = await supabase.functions.invoke('gestion-legal', {
            body: { action: 'submit', caso, resumen: resumen ?? null },
        });
        if (error) {
            console.error('Error derivando caso legal:', error);
            return false;
        }
        return Boolean(data?.ok);
    } catch (e) {
        console.error('Error invocando derivación legal:', e);
        return false;
    }
}

export async function getLegalCases(): Promise<LegalCase[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('legal_cases')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching legal cases:', error.message || error);
        return [];
    }
    return (data as LegalCase[]) || [];
}

export async function updateLegalCase(
    id: string,
    updates: Partial<LegalCase>
): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('legal_cases')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        console.error('Error updating legal case:', error);
        return false;
    }
    return true;
}

// =====================================================
// STORAGE - File Upload
// =====================================================

const STORAGE_BUCKET = 'media';

/**
 * Upload a file to Supabase Storage.
 * @param file The file to upload
 * @param folder Optional folder path (e.g. 'propiedades', 'servicios')
 * @returns The public URL of the uploaded file, or null on error
 */
export async function uploadFile(
    file: File,
    folder: string = 'general'
): Promise<string | null> {
    if (!supabase) return null;

    // Generate a unique file name to avoid collisions
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const safeName = `${timestamp}-${randomStr}.${extension}`;
    const filePath = `${folder}/${safeName}`;

    const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Error uploading file:', error);
        return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

    return urlData?.publicUrl || null;
}

/**
 * Upload multiple files to Supabase Storage.
 * @param files Array of files to upload
 * @param folder Optional folder path
 * @returns Array of public URLs for successfully uploaded files
 */
export async function uploadFiles(
    files: File[],
    folder: string = 'general'
): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
        const url = await uploadFile(file, folder);
        if (url) urls.push(url);
    }

    return urls;
}

/**
 * Delete a file from Supabase Storage by its public URL.
 * @param publicUrl The public URL of the file to delete
 * @returns true if deleted successfully
 */
export async function deleteStorageFile(publicUrl: string): Promise<boolean> {
    if (!supabase) return false;

    try {
        // Extract the file path from the public URL
        const url = new URL(publicUrl);
        const pathParts = url.pathname.split(`/storage/v1/object/public/${STORAGE_BUCKET}/`);
        if (pathParts.length < 2) return false;

        const filePath = decodeURIComponent(pathParts[1]);

        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([filePath]);

        if (error) {
            console.error('Error deleting file:', error);
            return false;
        }

        return true;
    } catch (e) {
        console.error('Error parsing file URL:', e);
        return false;
    }
}
