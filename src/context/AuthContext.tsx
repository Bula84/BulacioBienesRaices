'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSession, onAuthStateChange, signIn, signOut, signUp, isAuthConfigured } from '@/lib/auth';
import { getUserRole } from '@/lib/supabase';

export type Role = 'pending' | 'admin' | 'superadmin' | null;

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isConfigured: boolean;
    role: Role;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isPending: boolean;
    login: (email: string, password: string) => Promise<{ error: string | null; role: Role }>;
    register: (email: string, password: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
    refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Espejo de la sesión en una cookie para que el middleware (src/proxy.ts)
 * pueda bloquear /admin antes de renderizar. No reemplaza a RLS.
 */
const SESSION_COOKIE = 'bb_session';
const setSessionCookie = (activa: boolean) => {
    if (typeof document === 'undefined') return;
    document.cookie = activa
        ? `${SESSION_COOKIE}=1; path=/; max-age=604800; samesite=lax`
        : `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<Role>(null);
    const [isConfigured] = useState(isAuthConfigured());

    // Derived permissions
    const isSuperAdmin = role === 'superadmin';
    const isAdmin = role === 'admin' || role === 'superadmin';
    const isPending = role === 'pending';

    // Fetch user role from database
    const fetchRole = async (userId: string) => {
        const userRole = await getUserRole(userId);
        if (userRole) {
            setRole(userRole.role as Role);
        } else {
            setRole(null);
        }
    };

    const refreshRole = async () => {
        if (user) {
            await fetchRole(user.id);
        }
    };

    useEffect(() => {
        // Get initial session
        const initAuth = async () => {
            const { session: currentSession } = await getSession();
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setSessionCookie(Boolean(currentSession));

            if (currentSession?.user) {
                await fetchRole(currentSession.user.id);
            }

            setLoading(false);
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = onAuthStateChange(async (newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setSessionCookie(Boolean(newSession));

            if (newSession?.user) {
                await fetchRole(newSession.user.id);
            } else {
                setRole(null);
            }

            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const result = await signIn(email, password);
        if (result.error) {
            return { error: result.error.message, role: null };
        }

        // Resolvemos el rol ahora mismo para poder redireccionar bien
        // (admins a /admin, el resto de vuelta al sitio).
        let resolvedRole: Role = null;
        if (result.user?.id) {
            const userRole = await getUserRole(result.user.id);
            resolvedRole = (userRole?.role as Role) ?? null;
            setRole(resolvedRole);
        }

        // Marcamos la cookie ANTES del redirect para que /admin no rebote.
        setSessionCookie(true);

        return { error: null, role: resolvedRole };
    };

    const register = async (email: string, password: string) => {
        const result = await signUp(email, password);
        if (result.error) {
            return { error: result.error.message };
        }
        return { error: null };
    };

    const logout = async () => {
        await signOut();
        setUser(null);
        setSession(null);
        setRole(null);
        setSessionCookie(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                isConfigured,
                role,
                isAdmin,
                isSuperAdmin,
                isPending,
                login,
                register,
                logout,
                refreshRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
