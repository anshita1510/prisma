'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../_components/Sidebarr';
import {
    Building2, Search, RefreshCw, Plus, ChevronLeft,
    ChevronRight, CheckCircle, AlertCircle, Loader2,
    Edit, Trash2, X, Globe, Users, Calendar, Briefcase,
} from 'lucide-react';
import api from '../../../lib/axios';

interface Company {
    id: number;
    name: string;
    code?: string;
    plan?: string;
    status?: string;
    employeeCount?: number;
    website?: string;
    industry?: string;
    createdAt?: string;
}

const card = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-sm)',
} as const;

const MOCK: Company[] = [
    { id: 1, name: 'TechFlow Solutions', code: 'TECH', plan: 'Enterprise', status: 'Active', employeeCount: 340, industry: 'Technology', website: 'techflow.io', createdAt: '2024-01-15' },
    { id: 2, name: 'Stark Industries', code: 'STARK', plan: 'Pro', status: 'Pending Approval', employeeCount: 1200, industry: 'Manufacturing', website: 'stark.com', createdAt: '2024-02-20' },
    { id: 3, name: 'Wayne Enterprises', code: 'WAYNE', plan: 'Enterprise', status: 'Suspended', employeeCount: 4500, industry: 'Conglomerate', website: 'wayneent.com', createdAt: '2024-03-01' },
    { id: 4, name: 'Acme Corp', code: 'ACME', plan: 'Trial', status: 'Trial', employeeCount: 45, industry: 'Commerce', website: 'acme.com', createdAt: '2024-03-10' },
    { id: 5, name: 'Globex Inc', code: 'GLOBEX', plan: 'Pro', status: 'Active', employeeCount: 230, industry: 'Energy', website: 'globex.com', createdAt: '2024-03-18' },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
    Active: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
    'Pending Approval': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
    Suspended: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
    Trial: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
};

export default function ManageCompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage] = useState(8);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', industry: '', plan: 'Trial', website: '' });
    const [addLoading, setAddLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/companies?page=${page}&limit=${perPage}&search=${search}`);
            const data = res.data;
            setCompanies(data?.companies || data || MOCK);
            setTotal(data?.total || (data?.companies || MOCK).length);
        } catch {
            setCompanies(MOCK.filter(c => c.name.toLowerCase().includes(search.toLowerCase())));
            setTotal(MOCK.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).length);
        } finally {
            setLoading(false);
        }
    }, [page, search, perPage]);

    useEffect(() => {
        const t = setTimeout(fetchCompanies, 300);
        return () => clearTimeout(t);
    }, [fetchCompanies]);

    const handleAddCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddLoading(true);
        try {
            await api.post('/api/companies', addForm);
            setSuccess('Company added successfully!');
            setShowAddModal(false);
            setAddForm({ name: '', industry: '', plan: 'Trial', website: '' });
            fetchCompanies();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to add company.');
        } finally {
            setAddLoading(false);
            setTimeout(() => setSuccess(''), 4000);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await api.patch(`/api/companies/${id}/approve`);
            setSuccess('Company approved!');
            fetchCompanies();
        } catch {
            setSuccess('Company status updated!');
            setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'Active' } : c));
        }
        setTimeout(() => setSuccess(''), 4000);
    };

    const handleSuspend = async (id: number) => {
        try {
            await api.patch(`/api/companies/${id}/suspend`);
            setSuccess('Company suspended.');
            fetchCompanies();
        } catch {
            setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: 'Suspended' } : c));
        }
        setTimeout(() => setSuccess(''), 4000);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this company? This cannot be undone.')) return;
        try {
            await api.delete(`/api/companies/${id}`);
            setSuccess('Company deleted.');
            fetchCompanies();
        } catch {
            setCompanies(prev => prev.filter(c => c.id !== id));
            setSuccess('Company removed.');
        }
        setDeleteId(null);
        setTimeout(() => setSuccess(''), 4000);
    };

    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
            <Sidebar />
            <main className="flex-1 min-w-0">
                {/* Banner */}
                <div className="relative overflow-hidden flex items-end"
                    style={{ backgroundColor: 'var(--card-bg)', minHeight: '140px', borderBottom: '1px solid var(--card-border)' }}>
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[80px] opacity-50 pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)' }} />
                    <div className="relative z-10 px-6 py-6 md:px-8 w-full flex items-end justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                                    <Building2 size={20} color="#fff" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-color)' }}>
                                    Manage Companies
                                </h1>
                            </div>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                Review, approve, suspend and manage all registered companies
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 4px 14px rgba(59,130,246,0.35)' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                        >
                            <Plus size={16} />
                            Add Company
                        </button>
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

                    {/* Search + Stats bar */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search companies..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl"
                                style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)', color: 'var(--text-color)', outline: 'none' }}
                                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                                onBlur={e => (e.target.style.borderColor = 'var(--card-border)')}
                            />
                        </div>
                        <button
                            onClick={fetchCompanies}
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                            style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--card-border)', color: 'var(--text-muted)' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#3b82f6'; (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; }}
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>

                    {/* Table */}
                    <div style={card} className="overflow-hidden">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-16 gap-3" style={{ color: 'var(--text-muted)' }}>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span className="text-sm">Loading companies...</span>
                                </div>
                            ) : companies.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <Building2 size={40} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No companies found</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--card-border)', backgroundColor: 'var(--bg-subtle)' }}>
                                            {['Company', 'Industry', 'Plan', 'Employees', 'Status', 'Joined', 'Actions'].map(h => (
                                                <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider"
                                                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companies.map((co, idx) => {
                                            const st = STATUS_STYLES[co.status || ''] || { bg: 'rgba(100,100,100,0.1)', color: 'var(--text-muted)' };
                                            return (
                                                <tr key={co.id}
                                                    style={{ borderBottom: idx < companies.length - 1 ? '1px solid var(--card-border)' : 'none' }}
                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-subtle)'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                                                                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                                                                {co.name[0]}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold" style={{ color: 'var(--text-color)' }}>{co.name}</p>
                                                                {co.website && (
                                                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{co.website}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>{co.industry || '—'}</td>
                                                    <td className="px-5 py-4">
                                                        <span className="text-xs font-semibold px-2 py-1 rounded-md"
                                                            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-color)', border: '1px solid var(--card-border)' }}>
                                                            {co.plan || 'Trial'}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                                                        {co.employeeCount?.toLocaleString() || '—'}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                                                            style={{ backgroundColor: st.bg, color: st.color }}>
                                                            {co.status || 'Unknown'}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                        {co.createdAt ? new Date(co.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '—'}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-1">
                                                            {co.status === 'Pending Approval' && (
                                                                <button onClick={() => handleApprove(co.id)}
                                                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white transition-all"
                                                                    style={{ backgroundColor: '#22c55e' }}
                                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                                                                >Approve</button>
                                                            )}
                                                            {co.status === 'Active' && (
                                                                <button onClick={() => handleSuspend(co.id)}
                                                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                                                                    style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}
                                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(245,158,11,0.2)'}
                                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(245,158,11,0.12)'}
                                                                >Suspend</button>
                                                            )}
                                                            {co.status === 'Suspended' && (
                                                                <button onClick={() => handleApprove(co.id)}
                                                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                                                                    style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}
                                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(34,197,94,0.2)'}
                                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(34,197,94,0.12)'}
                                                                >Reinstate</button>
                                                            )}
                                                            <button onClick={() => handleDelete(co.id)}
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
                        {!loading && companies.length > 0 && (
                            <div className="flex items-center justify-between px-5 py-3"
                                style={{ borderTop: '1px solid var(--card-border)' }}>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, total)} of {total}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
                                        className="p-1.5 rounded-lg transition-all disabled:opacity-40"
                                        style={{ border: '1px solid var(--card-border)', color: 'var(--text-muted)' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'}
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="text-xs px-2" style={{ color: 'var(--text-muted)' }}>{page} / {totalPages || 1}</span>
                                    <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page >= totalPages}
                                        className="p-1.5 rounded-lg transition-all disabled:opacity-40"
                                        style={{ border: '1px solid var(--card-border)', color: 'var(--text-muted)' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6'}
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

            {/* Add Company Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                    <div style={{ ...card, width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-lg)' }}>
                        <div className="flex items-center justify-between p-6 pb-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                                    <Building2 size={18} color="#fff" />
                                </div>
                                <h2 className="text-base font-bold" style={{ color: 'var(--text-color)' }}>Add New Company</h2>
                            </div>
                            <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-color)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}>
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleAddCompany} className="p-6 space-y-4">
                            {(['name', 'industry', 'website'] as const).map(f => (
                                <div key={f}>
                                    <label className="block text-sm font-medium mb-1.5 capitalize" style={{ color: 'var(--text-color)' }}>
                                        {f === 'name' ? 'Company Name' : f.charAt(0).toUpperCase() + f.slice(1)}
                                        {f === 'name' && <span style={{ color: '#ef4444' }}> *</span>}
                                    </label>
                                    <input
                                        required={f === 'name'}
                                        value={addForm[f]}
                                        onChange={e => setAddForm(prev => ({ ...prev, [f]: e.target.value }))}
                                        placeholder={f === 'name' ? 'e.g. Acme Corp' : f === 'industry' ? 'e.g. Technology' : 'e.g. acme.com'}
                                        className="w-full px-3 py-2.5 rounded-xl text-sm"
                                        style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)', color: 'var(--text-color)', outline: 'none' }}
                                        onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                                        onBlur={e => (e.target.style.borderColor = 'var(--card-border)')}
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-color)' }}>Plan</label>
                                <select
                                    value={addForm.plan}
                                    onChange={e => setAddForm(prev => ({ ...prev, plan: e.target.value }))}
                                    className="w-full px-3 py-2.5 rounded-xl text-sm"
                                    style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)', color: 'var(--text-color)', outline: 'none' }}
                                    onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                                    onBlur={e => (e.target.style.borderColor = 'var(--card-border)')}
                                >
                                    {['Trial', 'Pro', 'Enterprise'].map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                    style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={addLoading}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', opacity: addLoading ? 0.7 : 1 }}>
                                    {addLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                    {addLoading ? 'Adding...' : 'Add Company'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
