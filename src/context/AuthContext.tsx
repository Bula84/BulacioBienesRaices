'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSession, onAuthStateChange, signIn, signOut, signUp, isAuthConfigured } from '@/lib/auth';

// Admin emails - Add your admin email(s) here
const ADMIN_EMAILS = [
    'admin@bcbienesraices.com',
    // Add more admin emails as needed
];

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isConfigured: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    register: (email: string, password: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isConfigured] = useState(isAuthConfigured());

    // Check if current user is an admin
    const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

    useEffect(() => {
        // Get initial session
        const initAuth = async () => {
            const { session: currentSession } = await getSession();
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = onAuthStateChange((newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
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
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                isConfigured,
                isAdmin,
                login,
                register,
                logout,
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

// Export admin emails for configuration
export { ADMIN_EMAILS };
