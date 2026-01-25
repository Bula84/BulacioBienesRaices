'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSession, onAuthStateChange, signIn, signOut, signUp, isAuthConfigured } from '@/lib/auth';
import { getUserRole, UserRole } from '@/lib/supabase';

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
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    register: (email: string, password: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
    refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
            return { error: result.error.message };
        }
        return { error: null };
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
