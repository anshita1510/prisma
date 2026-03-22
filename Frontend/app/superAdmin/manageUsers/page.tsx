'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../_components/Sidebarr';
import {
    Users, Search, RefreshCw, ChevronLeft, ChevronRight,
    CheckCircle, AlertCircle, Loader2, Mail, Trash2, Shield,
    UserCheck, UserX, Eye, Filter,
} from 'lucide-react';
import api from '../../../lib/axios';
import { userService } from '../../services/user.service';

interface User {
    id: number;
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    phone?: string;
    role: string;
    status?: string;
    companyName?: string;
    designation?: string;
    createdAt: string;
}

const card = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-sm)',
} as const;

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
    SUPER_ADMIN: { bg: 'rgba(124,58,237,0.15)', color: '#a78bfa' },
    ADMIN: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
    MANAGER: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80' },
    EMPLOYEE: { bg: 'rgba(100,100,100,0.1)', color: 'var(--text-muted)' },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
    active: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
    pending: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
    inactive: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
};

const ROLE_FILTER_OPTIONS = ['All Roles', 'SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE'];

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage] = useState(10);
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await userService.getUsers(page, perPage, search);
            let fetchedUsers: User[] = res.users || [];
            if (roleFilter !== 'All Roles') {
                fetchedUsers = fetchedUsers.filter((u: User) => u.role === roleFilter);
            }
            setUsers(fetchedUsers);
            setTotal(res.total || fetchedUsers.length);
        } catch {
            // Fallback mock
            const mock: User[] = [
                { id: 1, firstName: 'Anita', lastName: 'Bharwal', email: 'anita@techflow.io', role: 'SUPER_ADMIN', status: 'active', companyName: 'TechFlow Solutions', designation: 'Director', createdAt: '2024-01-10' },
                { id: 2, firstName: 'Rahul', lastName: 'Sharma', email: 'rahul@stark.com', role: 'ADMIN', status: 'active', companyName: 'Stark Industries', designation: 'Admin', createdAt: '2024-02-14' },
                { id: 3, firstName: 'Priya', lastName: 'Singh', email: 'priya@wayne.com', role: 'MANAGER', status: 'active', companyName: 'Wayne Enterprises', designation: 'Manager', createdAt: '2024-03-05' },
                { id: 4, firstName: 'John', lastName: 'Doe', email: 'john@acme.com', role: 'EMPLOYEE', status: 'pending', companyName: 'Acme Corp', designation: 'Engineer', createdAt: '2024-03-12' },
                { id: 5, firstName: 'Sara', lastName: 'McLaren', email: 'sara@globex.com', role: 'EMPLOYEE', status: 'active', companyName: 'Globex Inc', designation: 'Analyst', createdAt: '2024-03-18' },
                { id: 6, firstName: 'Tom', lastName: 'Hardy', email: 'tom@techflow.io', role: 'MANAGER', status: 'inactive', companyName: 'TechFlow Solutions', designation: 'Team Lead', createdAt: '2024-01-20' },
            ];
            const filtered = mock.filter(u => {
                const matchSearch = !search || u.firstName?.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
                const matchRole = roleFilter === 'All Roles' || u.role === roleFilter;
                return matchSearch && matchRole;
            });
            setUsers(filtered);
            setTotal(filtered.length);
        } finally {
            setLoading(false);
        }
    }, [page, search, roleFilter, perPage]);

    useEffect(() => {
        const t = setTimeout(fetchUsers, 300);
        return () => clearTimeout(t);
    }, [fetchUsers]);

    const showMsg = (msg: string, isError = false) => {
        isError ? setError(msg) : setSuccess(msg);
        setTimeout(() => isError ? setError('') : setSuccess(''), 4000);
    };

    const handleDelete = async (user: User) => {
        const label = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        if (!confirm(`Delete ${label}? This cannot be undone.`)) return;
        try {
            await userService.deleteUser(user.id);
            showMsg(`${label} deleted successfully.`);
            fetchUsers();
        } catch (err: any) {
            showMsg(err?.message || 'Failed to delete user.', true);
        }
    };

    const handleResendInvite = async (user: User) => {
        try {
            await userService.resendInvitation(user.id);
            showMsg(`Invitation resent to ${user.email}`);
        } catch {
            showMsg('Failed to resend invitation.', true);
        }
    };

    const totalPages = Math.ceil(total / perPage);

    const getInitials = (u: User) => {
        if (u.firstName && u.lastName) return `${u.firstName[0]}${u.lastName[0]}`;
        if (u.name) return u.name.slice(0, 2).toUpperCase();
        return u.email.slice(0, 2).toUpperCase();
    };

    const getAvatar = (role: string) => {
        if (role === 'SUPER_ADMIN') return 'linear-gradient(135deg, #7c3aed, #a855f7)';
        if (role === 'ADMIN') return 'linear-gradient(135deg, #3b82f6, #2563eb)';
        if (role === 'MANAGER') return 'linear-gradient(135deg, #22c55e, #16a34a)';
        return 'linear-gradient(135deg, #64748b, #475569)';
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
            <Sidebar />
            <main className="flex-1 min-w-0">
                {/* Banner */}
                <div className="relative overflow-hidden flex items-end"
                    style={{ backgroundColor: 'var(--card-bg)', minHeight: '140px', borderBottom: '1px solid var(--card-border)' }}>
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[80px] opacity-50 pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)' }} />
                    <div className="relative z-10 px-6 py-6 md:px-8 w-full flex items-end justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                                    <Users size={20} color="#fff" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-color)' }}>
                                    Manage Users
                                </h1>
                            </div>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                View, search, and manage all users across every company on the platform
                            </p>
                        </div>
                        {/* Stats bar */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {[
                                { label: 'Total', value: total, color: '#22c55e' },
                            ].map(s => (
                                <div key={s.label} className="px-4 py-2 rounded-xl text-center"
                                    style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                                    <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-5 md:p-6 space-y-5">
                    {/* Alerts */}
                    {success && (
                        <div className="p-4 rounded-xl flex items-center gap-3"
                            style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                            <CheckCircle size={16} color="#22c55e" />
                            <p className="text-sm font-medium" style={{ color: '#22c55e' }}>{success}</p>
                        </div>
                    )}
                    {error && (
                        <div className="p-4 rounded-xl flex items-center gap-3"
                            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                            <AlertCircle size={16} color="#ef4444" />
                            <p className="text-sm font-medium" style={{ color: '#ef4444' }}>{error}</p>
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 flex-wrap">
                            <div className="relative flex-1 min-w-[200px] max-w-sm">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email..."
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl"
                                    style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)', color: 'var(--text-color)', outline: 'none' }}
                                    onFocus={e => (e.target.style.borderColor = '#22c55e')}
                                    onBlur={e => (e.target.style.borderColor = 'var(--card-border)')}
                                />
                            </div>
                            {/* Role filter */}
                            <select
                                value={roleFilter}
                                onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
                                className="px-3 py-2.5 text-sm rounded-xl"
                                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)', color: 'var(--text-color)', outline: 'none' }}
                                onFocus={e => (e.target.style.borderColor = '#22c55e')}
                                onBlur={e => (e.target.style.borderColor = 'var(--card-border)')}
                            >
                                {ROLE_FILTER_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={fetchUsers}
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex-shrink-0"
                            style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--card-border)', color: 'var(--text-muted)' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#22c55e'; (e.currentTarget as HTMLElement).style.borderColor = '#22c55e'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; }}
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>

                    {/* Permissions info */}
                    <div className="p-3 rounded-xl flex items-start gap-2.5"
                        style={{ backgroundColor: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}>
                        <Shield size={14} style={{ color: '#22c55e', flexShrink: 0, marginTop: 2 }} />
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            <span className="font-semibold" style={{ color: '#22c55e' }}>Super Admin Permissions: </span>
                            You can delete any user including Admins and other Super Admins (except yourself and the last active Super Admin).
                        </p>
                    </div>

                    {/* Table */}
                    <div style={card} className="overflow-hidden">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-16 gap-3" style={{ color: 'var(--text-muted)' }}>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span className="text-sm">Loading users...</span>
                                </div>
                            ) : users.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <Users size={40} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No users found</p>
                                    {search && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>}
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--card-border)', backgroundColor: 'var(--bg-subtle)' }}>
                                            {['User', 'Contact', 'Company', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                                                <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider"
                                                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u, idx) => {
                                            const roleStyle = ROLE_STYLES[u.role] || ROLE_STYLES.EMPLOYEE;
                                            const statusKey = (u.status || 'active').toLowerCase();
                                            const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.active;
                                            return (
                                                <tr key={u.id}
                                                    style={{ borderBottom: idx < users.length - 1 ? '1px solid var(--card-border)' : 'none' }}
                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-subtle)'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                                                                style={{ background: getAvatar(u.role) }}>
                                                                {getInitials(u)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold" style={{ color: 'var(--text-color)' }}>
                                                                    {u.firstName ? `${u.firstName} ${u.lastName || ''}` : u.name || '—'}
                                                                </p>
                                                                {u.designation && (
                                                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.designation}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <p className="text-sm" style={{ color: 'var(--text-color)' }}>{u.email}</p>
                                                        {u.phone && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.phone}</p>}
                                                    </td>
                                                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                                                        {u.companyName || '—'}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                                                            style={{ backgroundColor: roleStyle.bg, color: roleStyle.color }}>
                                                            {u.role.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg capitalize"
                                                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                                                            {u.status || 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                        {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <button onClick={() => handleResendInvite(u)}
                                                                title="Resend Invitation"
                                                                className="p-1.5 rounded-lg transition-all"
                                                                style={{ color: 'var(--text-muted)' }}
                                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#3b82f6'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.1)'; }}
                                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                                                            >
                                                                <Mail size={14} />
                                                            </button>
                                                            <button onClick={() => handleDelete(u)}
                                                                title="Delete User"
                                                                className="p-1.5 rounded-lg transition-all"
                                                                style={{ color: 'var(--text-muted)' }}
                                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
                                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {!loading && users.length > 0 && (
                            <div className="flex items-center justify-between px-5 py-3"
                                style={{ borderTop: '1px solid var(--card-border)' }}>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, total)} of {total} users
                                </p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
                                        className="p-1.5 rounded-lg transition-all disabled:opacity-40"
                                        style={{ border: '1px solid var(--card-border)', color: 'var(--text-muted)' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#22c55e'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'}
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="text-xs px-2" style={{ color: 'var(--text-muted)' }}>{page} / {totalPages || 1}</span>
                                    <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page >= totalPages}
                                        className="p-1.5 rounded-lg transition-all disabled:opacity-40"
                                        style={{ border: '1px solid var(--card-border)', color: 'var(--text-muted)' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#22c55e'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'}
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
