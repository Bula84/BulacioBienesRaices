'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Shield,
    ShieldCheck,
    Clock,
    Check,
    X,
    Trash2,
    RefreshCw,
    Search,
    Crown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAllUserRoles, updateUserRole, deleteUserRole, UserRole } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function UsuariosPage() {
    const router = useRouter();
    const { user, isSuperAdmin } = useAuth();
    const [users, setUsers] = useState<UserRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'admin' | 'superadmin'>('all');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Redirect if not superadmin
    useEffect(() => {
        if (!isSuperAdmin) {
            router.push('/admin');
        }
    }, [isSuperAdmin, router]);

    const loadUsers = async () => {
        setLoading(true);
        const data = await getAllUserRoles();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleApprove = async (userId: string, newRole: 'admin' | 'superadmin') => {
        if (!user) return;
        setActionLoading(userId);

        const result = await updateUserRole(userId, newRole, user.id);
        if (result) {
            await loadUsers();
        }
        setActionLoading(null);
    };

    const handleReject = async (userId: string) => {
        setActionLoading(userId);
        const result = await deleteUserRole(userId);
        if (result) {
            await loadUsers();
        }
        setActionLoading(null);
    };

    const handleRevoke = async (userId: string) => {
        setActionLoading(userId);
        const result = await updateUserRole(userId, 'pending');
        if (result) {
            await loadUsers();
        }
        setActionLoading(null);
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || u.role === filter;
        return matchesSearch && matchesFilter;
    });

    const pendingCount = users.filter(u => u.role === 'pending').length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const superadminCount = users.filter(u => u.role === 'superadmin').length;

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'superadmin':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-teal-500/20 text-teal-400 border border-teal-500/30">
                        <Crown className="w-3 h-3" />
                        SuperAdmin
                    </span>
                );
            case 'admin':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" />
                        Admin
                    </span>
                );
            case 'pending':
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Clock className="w-3 h-3" />
                        Pendiente
                    </span>
                );
        }
    };

    if (!isSuperAdmin) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
                    <p className="text-neutral-400">Aprueba o revoca permisos de administrador</p>
                </div>
                <button
                    onClick={loadUsers}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                    className="p-4 rounded-2xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{users.length}</p>
                            <p className="text-sm text-neutral-400">Total</p>
                        </div>
                    </div>
                </div>
                <div
                    className="p-4 rounded-2xl cursor-pointer hover:bg-amber-500/10 transition-colors"
                    style={{
                        background: filter === 'pending' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: filter === 'pending' ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/20">
                            <Clock className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
                            <p className="text-sm text-neutral-400">Pendientes</p>
                        </div>
                    </div>
                </div>
                <div
                    className="p-4 rounded-2xl cursor-pointer hover:bg-emerald-500/10 transition-colors"
                    style={{
                        background: filter === 'admin' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: filter === 'admin' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onClick={() => setFilter(filter === 'admin' ? 'all' : 'admin')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/20">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-emerald-400">{adminCount}</p>
                            <p className="text-sm text-neutral-400">Admins</p>
                        </div>
                    </div>
                </div>
                <div
                    className="p-4 rounded-2xl cursor-pointer hover:bg-teal-500/10 transition-colors"
                    style={{
                        background: filter === 'superadmin' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: filter === 'superadmin' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onClick={() => setFilter(filter === 'superadmin' ? 'all' : 'superadmin')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500/20">
                            <Crown className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-teal-400">{superadminCount}</p>
                            <p className="text-sm text-neutral-400">SuperAdmins</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar por email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
            </div>

            {/* Users Table */}
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-2 border-neutral-600 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-neutral-400">Cargando usuarios...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                        <p className="text-neutral-400">No se encontraron usuarios</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-neutral-400">Email</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-neutral-400">Rol</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-neutral-400">Registrado</th>
                                    <th className="text-right py-4 px-6 text-sm font-medium text-neutral-400">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((userRole, index) => (
                                    <motion.tr
                                        key={userRole.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <span className="text-white font-medium">{userRole.email}</span>
                                            {userRole.user_id === user?.id && (
                                                <span className="ml-2 text-xs text-teal-400">(Tú)</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            {getRoleBadge(userRole.role)}
                                        </td>
                                        <td className="py-4 px-6 text-neutral-400 text-sm">
                                            {new Date(userRole.created_at).toLocaleDateString('es-AR')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                {actionLoading === userRole.user_id ? (
                                                    <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
                                                ) : userRole.user_id === user?.id ? (
                                                    <span className="text-xs text-neutral-500">No puedes modificarte</span>
                                                ) : userRole.role === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(userRole.user_id, 'admin')}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                                            title="Aprobar como Admin"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                            Admin
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprove(userRole.user_id, 'superadmin')}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-colors"
                                                            title="Aprobar como SuperAdmin"
                                                        >
                                                            <Crown className="w-3 h-3" />
                                                            Super
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(userRole.user_id)}
                                                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                            title="Rechazar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {userRole.role === 'admin' && (
                                                            <button
                                                                onClick={() => handleApprove(userRole.user_id, 'superadmin')}
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-colors"
                                                                title="Promover a SuperAdmin"
                                                            >
                                                                <Crown className="w-3 h-3" />
                                                                Promover
                                                            </button>
                                                        )}
                                                        {userRole.role === 'superadmin' && (
                                                            <button
                                                                onClick={() => handleApprove(userRole.user_id, 'admin')}
                                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                                                title="Degradar a Admin"
                                                            >
                                                                <ShieldCheck className="w-3 h-3" />
                                                                Degradar
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleRevoke(userRole.user_id)}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                                                            title="Revocar acceso"
                                                        >
                                                            <X className="w-3 h-3" />
                                                            Revocar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
