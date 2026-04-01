"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Hash, UserCheck, Briefcase, Send, RotateCcw, ChevronDown, RefreshCw } from 'lucide-react';
import { userService, CreateUserData, Company } from '../services/user.service';

interface CreateUserFormProps {
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  currentUserCompany?: Company;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

interface CreateUserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  designation: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  companyName?: string;
  companyId?: string | number;
}

export default function CreateUserForm({
  currentUserRole,
  currentUserCompany,
  onSuccess,
  onError
}: CreateUserFormProps) {
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    designation: '',
    role: 'EMPLOYEE',
    companyName: currentUserCompany?.name || '',
    companyId: currentUserCompany?.id || ''
  });

  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  // Load companies for SuperAdmin
  useEffect(() => {
    if (currentUserRole === 'SUPER_ADMIN') {
      loadCompanies();
    }
  }, [currentUserRole]);

  // Refresh companies when component receives focus (to catch newly created companies)
  useEffect(() => {
    const handleFocus = () => {
      if (currentUserRole === 'SUPER_ADMIN') {
        loadCompanies();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [currentUserRole]);

  const loadCompanies = async () => {
    if (currentUserRole !== 'SUPER_ADMIN') return;

    setLoadingCompanies(true);
    try {
      const response = await userService.getCompanies();
      setCompanies(response.companies);
    } catch (error: any) {
      console.error('Failed to load companies:', error);
      onError?.('Failed to load companies: ' + error.message);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanySelect = (company: Company) => {
    setFormData(prev => ({
      ...prev,
      companyId: company.id,
      companyName: company.name
    }));
    setShowCompanyDropdown(false);
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.firstName || !formData.lastName ||
      !formData.phone || !formData.designation) {
      onError?.('Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      onError?.('Please enter a valid email address');
      return false;
    }

    // For SuperAdmin, company selection is required
    if (currentUserRole === 'SUPER_ADMIN' && !formData.companyId) {
      onError?.('Please select a company');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔍 Form submission started');
    console.log('🔍 Current form data:', JSON.stringify(formData, null, 2));
    console.log('🔍 Current user role:', currentUserRole);

    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setLoading(true);

    try {
      const userData: CreateUserData = {
        email: formData.email.toLowerCase().trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        designation: formData.designation,
        role: formData.role,
      };

      // Add company data based on user role
      if (currentUserRole === 'SUPER_ADMIN') {
        userData.companyId = formData.companyId;
        userData.companyName = formData.companyName;
      }
      // For Admin/Manager, company info is handled on backend from their user details

      console.log('🔍 Final user data to send:', JSON.stringify(userData, null, 2));

      const response = await userService.createUser(userData);

      if (response.success) {
        onSuccess?.(`User created successfully! An invitation email has been sent to ${formData.email}.`);
        resetForm();
      }

    } catch (err: any) {
      console.error('❌ Form submission error:', err);
      onError?.(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      designation: '',
      role: 'EMPLOYEE',
      companyName: currentUserCompany?.name || '',
      companyId: currentUserCompany?.id || ''
    });
  };

  const isCompanyFieldDisabled = currentUserRole !== 'SUPER_ADMIN';

  return (
    <div className="p-2" style={{ color: 'var(--text-color)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>Create New User</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {currentUserRole === 'SUPER_ADMIN'
              ? 'Add a new user to any company in the system.'
              : `Add a new user to ${currentUserCompany?.name || 'your company'}.`
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Address */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            <Mail className="w-4 h-4" />
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="name@company.com"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            style={{ backgroundColor: 'var(--input-bg, var(--card-bg))', borderColor: 'var(--card-border)', color: 'var(--text-color)' }}
            required
          />
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              <User className="w-4 h-4" />
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First name"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              style={{ backgroundColor: 'var(--input-bg, var(--card-bg))', borderColor: 'var(--card-border)', color: 'var(--text-color)' }}
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              <User className="w-4 h-4" />
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last name"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              style={{ backgroundColor: 'var(--input-bg, var(--card-bg))', borderColor: 'var(--card-border)', color: 'var(--text-color)' }}
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            <Phone className="w-4 h-4" />
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 555 000 0000"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            style={{ backgroundColor: 'var(--input-bg, var(--card-bg))', borderColor: 'var(--card-border)', color: 'var(--text-color)' }}
            required
          />
        </div>

        {/* Company Selection - Only for SuperAdmin */}
        {currentUserRole === 'SUPER_ADMIN' && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              <Building className="w-4 h-4" />
              Company *
              <button
                type="button"
                onClick={loadCompanies}
                className="ml-auto text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                disabled={loadingCompanies}
              >
                <RefreshCw className={`w-3 h-3 ${loadingCompanies ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-left flex items-center justify-between"
                style={{ backgroundColor: 'var(--input-bg, var(--card-bg))', borderColor: 'var(--card-border)', color: 'var(--text-color)' }}
                disabled={loadingCompanies}
              >
                <span style={{ color: formData.companyName ? 'var(--text-color)' : 'var(--text-muted)' }}>
                  {loadingCompanies ? 'Loading companies...' : (formData.companyName || 'Select a company')}
                </span>
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </button>

              {showCompanyDropdown && (
                <div className="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                  {loadingCompanies ? (
                    <div className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>Loading companies...</div>
                  ) : companies.length === 0 ? (
                    <div className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                      No companies found. Create a company first in the "Manage Companies" tab.
                    </div>
                  ) : (
                    companies.map((company) => (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => handleCompanySelect(company)}
                        className="w-full px-4 py-3 text-left hover:bg-black/5 focus:bg-black/5 focus:outline-none"
                      >
                        <div className="font-medium" style={{ color: 'var(--text-color)' }}>{company.name}</div>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {company.code} • {company.userCount || 0} users
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {companies.length === 0 && !loadingCompanies && (
              <p className="text-xs text-amber-600 mt-1">
                💡 No companies available. Go to "Manage Companies" tab to create one first.
              </p>
            )}
          </div>
        )}

        {/* Company Info Display - For Admin/Manager */}
        {currentUserRole !== 'SUPER_ADMIN' && currentUserCompany && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              <Building className="w-4 h-4" />
              Company
            </label>
            <div className="w-full px-4 py-3 border rounded-lg" style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
              <div className="font-medium" style={{ color: 'var(--text-color)' }}>{currentUserCompany.name}</div>
              <div className="text-sm">{currentUserCompany.code}</div>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Users will be added to your company automatically
            </p>
          </div>
        )}

        {/* Designation and Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              <Briefcase className="w-4 h-4" />
              Designation *
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              style={{ backgroundColor: 'var(--input-bg, var(--card-bg))', borderColor: 'var(--card-border)', color: 'var(--text-color)' }}
              required
            >
              <option value="">Select designation</option>
              <option value="Director">Director</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Senior Software Engineer">Senior Software Engineer</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Manager">Manager</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Designer">Designer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="HR">HR</option>
              <option value="Admin">Admin</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              <UserCheck className="w-4 h-4" />
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              style={{ backgroundColor: 'var(--input-bg, var(--card-bg))', borderColor: 'var(--card-border)', color: 'var(--text-color)' }}
              required
            >
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="HR">HR</option>
              <option value="MANAGER">MANAGER</option>
              {(currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN') && (
                <option value="ADMIN">ADMIN</option>
              )}
              {currentUserRole === 'SUPER_ADMIN' && (
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              )}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating User...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Create User & Send Invitation
              </>
            )}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center gap-2 px-6 py-3 border rounded-lg hover:opacity-80 transition-colors font-medium"
            style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 rounded-lg border" style={{ backgroundColor: 'var(--accent-subtle)', borderColor: 'var(--accent-color)', opacity: 0.9 }}>
        <h3 className="font-medium mb-2" style={{ color: 'var(--accent-color)' }}>What happens next?</h3>
        <ul className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
          <li>• The user will receive an invitation email with setup instructions</li>
          <li>• They can set their password and complete their profile</li>
          <li>• The user will be assigned to the {currentUserRole === 'SUPER_ADMIN' ? 'selected' : 'your'} company and role</li>
          <li>• You can manage their permissions and access from the user management section</li>
        </ul>
      </div>
    </div>
  );
}