import { createClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if credentials exist
const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface AuthError {
    message: string;
}

export interface AuthResult {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}

// Sign up with email and password
export async function signUp(email: string, password: string): Promise<AuthResult> {
    if (!supabase) {
        return { user: null, session: null, error: { message: 'Supabase no está configurado' } };
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { user: null, session: null, error: { message: error.message } };
    }

    return { user: data.user, session: data.session, error: null };
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthResult> {
    if (!supabase) {
        return { user: null, session: null, error: { message: 'Supabase no está configurado' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { user: null, session: null, error: { message: error.message } };
    }

    return { user: data.user, session: data.session, error: null };
}

// Sign out
export async function signOut(): Promise<{ error: AuthError | null }> {
    if (!supabase) {
        return { error: { message: 'Supabase no está configurado' } };
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
        return { error: { message: error.message } };
    }

    return { error: null };
}

// Get current session
export async function getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    if (!supabase) {
        return { session: null, error: { message: 'Supabase no está configurado' } };
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
        return { session: null, error: { message: error.message } };
    }

    return { session: data.session, error: null };
}

// Get current user
export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    if (!supabase) {
        return { user: null, error: { message: 'Supabase no está configurado' } };
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
        return { user: null, error: { message: error.message } };
    }

    return { user: data.user, error: null };
}

// Listen to auth state changes
export function onAuthStateChange(callback: (session: Session | null) => void) {
    if (!supabase) {
        console.warn('Supabase no está configurado');
        return { data: { subscription: { unsubscribe: () => { } } } };
    }

    return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
    });
}

// Check if Supabase is configured
export const isAuthConfigured = () => !!supabase;
