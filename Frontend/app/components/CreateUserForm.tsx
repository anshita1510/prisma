"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Hash, Briefcase, Send, RotateCcw, ChevronDown, RefreshCw, CheckCircle, X } from 'lucide-react';
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

  // Refresh companies when component receives focus
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

    if (currentUserRole === 'SUPER_ADMIN' && !formData.companyId) {
      onError?.('Please select a company');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const userData: CreateUserData = {
        email: formData.email.toLowerCase().trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        designation: formData.designation,
        role: "EMPLOYEE",
      };

      if (currentUserRole === 'SUPER_ADMIN') {
        userData.companyId = formData.companyId;
        userData.companyName = formData.companyName;
      }

      const response = await userService.createUser(userData);

      // Since the request didn't throw an error, it is a success!
      const msg = response?.message || `User Created Successfully! An invitation email has been sent to ${formData.email}.`;

      onSuccess?.(msg);
      resetForm();

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
      companyName: currentUserCompany?.name || '',
      companyId: currentUserCompany?.id || ''
    });
  };

  return (
    <div className="p-2">

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 icon-box">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Create New User</h2>
          <p className="text-sm text-muted-foreground mt-1">
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
            className="w-full px-4 py-3 border bg-input/50 backdrop-blur-sm border-border rounded-lg text-foreground transition-all duration-200 focus:ring-2 focus:ring-PRIMAry/50 focus:border-PRIMAry"
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
            className="w-full px-4 py-3 border bg-input/50 backdrop-blur-sm border-border rounded-lg text-foreground transition-all duration-200 focus:ring-2 focus:ring-PRIMAry/50 focus:border-PRIMAry"
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
                className="w-full px-4 py-3 border bg-input/50 backdrop-blur-sm border-border rounded-lg text-foreground transition-all duration-200 focus:ring-2 focus:ring-PRIMAry/50 focus:border-PRIMAry text-left flex items-center justify-between"
                disabled={loadingCompanies}
              >
                <span className={formData.companyName ? "text-foreground" : "text-muted-foreground"}>
                  {loadingCompanies ? 'Loading companies...' : (formData.companyName || 'Select a company')}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {showCompanyDropdown && (
                <div className="absolute z-50 w-full mt-1 border overflow-y-auto bg-card border-border shadow-lg max-h-60 rounded-lg">
                  {loadingCompanies ? (
                    <div className="px-4 py-3 text-muted-foreground">Loading companies...</div>
                  ) : companies.length === 0 ? (
                    <div className="px-4 py-3 text-muted-foreground">
                      No companies found. Create a company first in the "Manage Companies" tab.
                    </div>
                  ) : (
                    companies.map((company) => (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => handleCompanySelect(company)}
                        className="w-full px-4 py-3 text-left hover:bg-muted focus:bg-muted focus:outline-none transition-colors"
                      >
                        <div className="font-medium text-foreground">{company.name}</div>
                        <div className="text-sm text-muted-foreground">
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

        {currentUserRole !== 'SUPER_ADMIN' && currentUserCompany && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-muted-foreground">
              <Building className="w-4 h-4" />
              Company
            </label>
            <div className="w-full px-4 py-3 border rounded-lg bg-muted/50 border-border">
              <div className="font-medium text-foreground">{currentUserCompany.name}</div>
              <div className="text-sm text-muted-foreground">{currentUserCompany.code}</div>
            </div>
            <p className="text-xs mt-1 text-muted-foreground">
              Users will be added to your company automatically
            </p>
          </div>
        )}

        {/* Designation */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            <Briefcase className="w-4 h-4" />
            Designation *
          </label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border bg-input/50 backdrop-blur-sm border-border rounded-lg text-foreground transition-all duration-200 focus:ring-2 focus:ring-PRIMAry/50 focus:border-PRIMAry"
            required
          >
            <option value="">Select designation</option>
            <option value="INTERN">Intern → Employee</option>
            <option value="SOFTWARE_ENGINEER">Software Engineer → Employee</option>
            <option value="SENIOR_ENGINEER">Senior Engineer → Employee</option>
            <option value="TECH_LEAD">Tech Lead → Manager</option>
            <option value="MANAGER">Manager → Manager</option>
            <option value="HR">HR → Manager</option>
            <option value="DIRECTOR">Director → Manager</option>
          </select>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Role is automatically assigned based on designation.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 btn-PRIMAry-gradient text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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
            className="flex items-center gap-2 px-6 py-3 border btn-outline-theme transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </button>
        </div>
      </form>

      <div className="mt-8 p-6 rounded-xl border bg-PRIMAry/5 border-PRIMAry/20 dark:bg-PRIMAry/10 dark:border-PRIMAry/20 shadow-sm backdrop-blur-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-PRIMAry dark:text-blue-400">
          <CheckCircle className="w-4 h-4" />
          What happens next?
        </h3>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-PRIMAry/50 mt-1.5"></div> The user will receive an invitation email with setup instructions</li>
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-PRIMAry/50 mt-1.5"></div> They can set their password and complete their profile</li>
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-PRIMAry/50 mt-1.5"></div> The user will be assigned to the {currentUserRole === 'SUPER_ADMIN' ? 'selected' : 'your'} company and role</li>
          <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-PRIMAry/50 mt-1.5"></div> You can manage their permissions and access from the user management section</li>
        </ul>
      </div>
    </div>
  );
}