'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../_components/Sidebarr';
import {
    Crown, User, Mail, Phone, Building2,
    Briefcase, Eye, EyeOff, CheckCircle, AlertCircle,
    Loader2, Sparkles,
} from 'lucide-react';
import api from '../../../lib/axios';

interface Company {
    id: number;
    name: string;
    code?: string;
}

const card = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-sm)',
} as const;

export default function CreateCeoPage() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyId: '',
        designation: 'CEO',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [companiesLoading, setCompaniesLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setCompaniesLoading(true);
        try {
            const res = await api.get('/api/companies');
            setCompanies(res.data?.companies || res.data || []);
        } catch {
            setCompanies([
                { id: 1, name: 'TechFlow Solutions' },
                { id: 2, name: 'Stark Industries' },
                { id: 3, name: 'Wayne Enterprises' },
                { id: 4, name: 'Globex Inc' },
            ]);
        } finally {
            setCompaniesLoading(false);
        }
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.firstName.trim()) errs.firstName = 'First name is required';
        if (!form.lastName.trim()) errs.lastName = 'Last name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
        if (!form.companyId) errs.companyId = 'Please select a company';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 8) errs.password = 'Minimum 8 characters';
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                companyId: parseInt(form.companyId),
                designation: form.designation || 'CEO',
                role: 'ADMIN',
                password: form.password,
                isCeo: true,
            };
            await api.post('/api/users/create', payload);
            setSuccess(`CEO account for ${form.firstName} ${form.lastName} created successfully!`);
            setForm({ firstName: '', lastName: '', email: '', phone: '', companyId: '', designation: 'CEO', password: '', confirmPassword: '' });
            setFieldErrors({});
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to create CEO. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
    };

    const inputStyle = (hasError: boolean) => ({
        width: '100%',
        padding: '10px 14px',
        borderRadius: '10px',
        border: `1px solid ${hasError ? '#ef4444' : 'var(--card-border)'}`,
        backgroundColor: 'var(--input-bg)',
        color: 'var(--text-color)',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
    } as React.CSSProperties);

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
            <Sidebar />
            <main className="flex-1 min-w-0">
                {/* Header Banner */}
                <div className="relative overflow-hidden flex items-end"
                    style={{ backgroundColor: 'var(--card-bg)', minHeight: '140px', borderBottom: '1px solid var(--card-border)' }}>
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none blur-[80px] opacity-50"
                        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)' }} />
                    <div className="relative z-10 px-6 py-6 md:px-8 w-full flex items-end justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                    <Crown size={20} color="#fff" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-color)' }}>
                                    Create CEO Account
                                </h1>
                            </div>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                Assign a CEO-level administrator to a company in the platform
                            </p>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
                            style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                            Super Admin Action
                        </span>
                    </div>
                </div>

                <div className="p-5 md:p-8 max-w-3xl">
                    {/* Success / Error messages */}
                    {success && (
                        <div className="mb-6 p-4 rounded-xl flex items-center gap-3"
                            style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                            <CheckCircle size={18} color="#22c55e" />
                            <p className="text-sm font-medium" style={{ color: '#22c55e' }}>{success}</p>
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl flex items-center gap-3"
                            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                            <AlertCircle size={18} color="#ef4444" />
                            <p className="text-sm font-medium" style={{ color: '#ef4444' }}>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={card} className="p-6 md:p-8 space-y-6">
                            {/* Section: Personal Info */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <User size={15} style={{ color: 'var(--text-muted)' }} />
                                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                        Personal Information
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-color)' }}>
                                            First Name <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <input
                                            style={inputStyle(!!fieldErrors.firstName)}
                                            placeholder="e.g. John"
                                            value={form.firstName}
                                            onChange={e => handleChange('firstName', e.target.value)}
                                            onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                                            onBlur={e => (e.target.style.borderColor = fieldErrors.firstName ? '#ef4444' : 'var(--card-border)')}
                                        />
                                        {fieldErrors.firstName && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-color)' }}>
                                            Last Name <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <input
                                            style={inputStyle(!!fieldErrors.lastName)}
                                            placeholder="e.g. Smith"
                                            value={form.lastName}
                                            onChange={e => handleChange('lastName', e.target.value)}
                                            onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                                            onBlur={e => (e.target.style.borderColor = fieldErrors.lastName ? '#ef4444' : 'var(--card-border)')}
                                        />
                                        {fieldErrors.lastName && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.lastName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-color)' }}>
                                            Email Address <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                            <input
                                                type="email"
                                                style={{ ...inputStyle(!!fieldErrors.email), paddingLeft: '36px' }}
                                                placeholder="ceo@company.com"
                                                value={form.email}
                                                onChange={e => handleChange('email', e.target.value)}
                                                onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                                                onBlur={e => (e.target.style.borderColor = fieldErrors.email ? '#ef4444' : 'var(--card-border)')}
                                            />
                                        </div>
                                        {fieldErrors.email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-color)' }}>
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                            <input
                                                type="tel"
                                                style={{ ...inputStyle(false), paddingLeft: '36px' }}
                                                placeholder="+1 (555) 000-0000"
                                                value={form.phone}
                                                onChange={e => handleChange('phone', e.target.value)}
                                                onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                                                onBlur={e => (e.target.style.borderColor = 'var(--card-border)')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', backgroundColor: 'var(--card-border)' }} />

                            {/* Section: Company */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Building2 size={15} style={{ color: 'var(--text-muted)' }} />
                                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                        Company Assignment
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-color)' }}>
                                            Assign to Company <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <div className="relative">
                                            <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                                            <select
                                                style={{ ...inputStyle(!!fieldErrors.companyId), paddingLeft: '36px', appearance: 'none', cursor: 'pointer' }}
                                                value={form.companyId}
                                                onChange={e => handleChange('companyId', e.target.value)}
                                                onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                                                onBlur={e => (e.target.style.borderColor = fieldErrors.companyId ? '#ef4444' : 'var(--card-border)')}
                                            >
                                                <option value="">
                                                    {companiesLoading ? 'Loading companies...' : 'Select a company'}
                                                </option>
                                                {companies.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {fieldErrors.companyId && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.companyId}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-color)' }}>
                                            Designation
                                        </label>
                                        <div className="relative">
                                            <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                            <input
                                                style={{ ...inputStyle(false), paddingLeft: '36px' }}
                                                placeholder="CEO"
                                                value={form.designation}
                                                onChange={e => handleChange('designation', e.target.value)}
                                                onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                                                onBlur={e => (e.target.style.borderColor = 'var(--card-border)')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', backgroundColor: 'var(--card-border)' }} />

                            {/* Section: Password */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles size={15} style={{ color: 'var(--text-muted)' }} />
                                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                        Account Credentials
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-color)' }}>
                                            Password <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                style={{ ...inputStyle(!!fieldErrors.password), paddingRight: '40px' }}
                                                placeholder="Min. 8 characters"
                                                value={form.password}
                                                onChange={e => handleChange('password', e.target.value)}
                                                onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                                                onBlur={e => (e.target.style.borderColor = fieldErrors.password ? '#ef4444' : 'var(--card-border)')}
                                            />
                                            <button type="button" onClick={() => setShowPassword(s => !s)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                                style={{ color: 'var(--text-muted)' }}>
                                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                        {fieldErrors.password && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-color)' }}>
                                            Confirm Password <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirm ? 'text' : 'password'}
                                                style={{ ...inputStyle(!!fieldErrors.confirmPassword), paddingRight: '40px' }}
                                                placeholder="Re-enter password"
                                                value={form.confirmPassword}
                                                onChange={e => handleChange('confirmPassword', e.target.value)}
                                                onFocus={e => (e.target.style.borderColor = '#f59e0b')}
                                                onBlur={e => (e.target.style.borderColor = fieldErrors.confirmPassword ? '#ef4444' : 'var(--card-border)')}
                                            />
                                            <button type="button" onClick={() => setShowConfirm(s => !s)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                                style={{ color: 'var(--text-muted)' }}>
                                                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                        {fieldErrors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{fieldErrors.confirmPassword}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Info callout */}
                            <div className="p-4 rounded-xl flex items-start gap-3"
                                style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                                <Crown size={16} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <p className="text-sm font-semibold" style={{ color: '#f59e0b' }}>CEO Role Privileges</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                        CEO accounts will have full administrative access to their assigned company, including user management, analytics, and configuration.
                                    </p>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setForm({ firstName: '', lastName: '', email: '', phone: '', companyId: '', designation: 'CEO', password: '', confirmPassword: '' }); setFieldErrors({}); setSuccess(''); setError(''); }}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                    style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-color)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all"
                                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.35)' }}
                                >
                                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Crown size={15} />}
                                    {loading ? 'Creating...' : 'Create CEO Account'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
