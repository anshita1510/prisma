import api from '../../lib/axios';

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  designation: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  companyName?: string;
  companyId?: string | number;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  designation: string;
  role: string;
  companyName?: string;
  companyId?: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface GetUsersResponse {
  success: boolean;
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface Company {
  id: number;
  name: string;
  code: string;
  userCount?: number;
  employeeCount?: number;
  departmentCount?: number;
}

export interface GetCompaniesResponse {
  success: boolean;
  companies: Company[];
}

export interface GetCurrentCompanyResponse {
  success: boolean;
  company: Company;
}

export interface CreateCompanyData {
  name: string;
  industry?: string;
  description?: string;
  technology?: string;
  plan?: string;
}

export interface CreateCompanyResponse {
  success: boolean;
  company: Company;
  message: string;
}


export interface Ceo {
  id: number;
  ceoId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  isActive: boolean;
  isVerified: boolean;
  companyId?: number;
  companyName?: string;
  companyCode?: string;
  createdAt: string;
}

export interface CreateCeoData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyId: number;
  password: string;
}

export interface CreateCeoResponse {
  success: boolean;
  message: string;
  ceo: {
    id: number;
    ceoId: string;
    email: string;
    name: string;
    company: string;
    companyCode: string;
  };
}

export interface GetCeosResponse {
  success: boolean;
  ceos: Ceo[];
  total: number;
  page: number;
  limit: number;
}

export interface CompanyFull extends Company {
  industry?: string;
  plan?: string;
  isActive?: boolean;
  createdAt?: string;
}


export interface Ceo {
  id: number;
  ceoId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  isActive: boolean;
  isVerified: boolean;
  companyId?: number;
  companyName?: string;
  companyCode?: string;
  createdAt: string;
}

export interface CreateCeoData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyId: number;
  password: string;
}

export interface CreateCeoResponse {
  success: boolean;
  message: string;
  ceo: { id: number; ceoId: string; email: string; name: string; company: string; companyCode: string };
}

export interface GetCeosResponse {
  success: boolean;
  ceos: Ceo[];
  total: number;
  page: number;
  limit: number;
}

export interface CompanyFull extends Company {
  industry?: string;
  plan?: string;
  isActive?: boolean;
  createdAt?: string;
}

class UserService {
  /**
   * Create a new user (SuperAdmin only)
   */
  async createUser(userData: CreateUserData): Promise<CreateUserResponse> {
    try {
      console.log('🔍 Frontend: Sending user data:', JSON.stringify(userData, null, 2));
      console.log('🔍 Frontend: Current token:', localStorage.getItem('token') ? 'Present' : 'Missing');

      // Use a longer timeout specifically for user creation
      const response = await api.post('/api/users/register', userData, {
        timeout: 45000 // 15 seconds
      });
      console.log('✅ Frontend: User creation successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Create user error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error headers:", error.response?.headers);
      console.error("❌ Request config:", error.config);

      const errorMessage = error.code === 'ECONNABORTED'
        ? 'Request timed out. Please check the server is running and try again.'
        : error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create user';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all users (Admin/SuperAdmin only)
   */
  async getUsers(page: number = 1, limit: number = 10, search?: string): Promise<GetUsersResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const response = await api.get(`/api/users?${params}`);
      return response.data;
    } catch (error: any) {
      console.error("Get users error:", error);
      throw error;
    }
  }

  /**
   * Update user (Admin/SuperAdmin only)
   */
  async updateUser(userId: number, userData: Partial<CreateUserData>): Promise<CreateUserResponse> {
    try {
      const response = await api.put(`/api/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      console.error("Update user error:", error);
      throw error;
    }
  }

  /**
   * Delete user (SuperAdmin only)
   */
  async deleteUser(userId: number): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🔍 Frontend: Attempting to delete user", userId);
      console.log("🔍 Frontend: API URL", `/api/users/${userId}`);

      const response = await api.delete(`/api/users/${userId}`);

      console.log("🔍 Frontend: Delete response data", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Delete user error:", error);
      throw error;
    }
  }

  /**
   * Resend invitation email
   */
  async resendInvitation(userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/api/users/${userId}/resend-invitation`);
      return response.data;
    } catch (error: any) {
      console.error("Resend invitation error:", error);
      throw error;
    }
  }

  /**
   * Generate unique employee ID
   */
  generateEmployeeId(firstName: string, lastName: string): string {
    const prefix = "EMP";
    const initials = `${firstName.substring(0, 2)}${lastName.substring(0, 2)}`.toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${initials}${randomNum}`;
  }

  /**
   * Generate company ID from company name (for display purposes)
   * Note: Actual company codes are now auto-generated by the backend
   */
  generateCompanyId(companyName: string): string {
    const cleanName = companyName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 4);

    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${cleanName}${randomSuffix}`;
  }

  /**
   * Get all companies (SuperAdmin only)
   */
  async getCompanies(): Promise<GetCompaniesResponse> {
    try {
      const response = await api.get('/api/companies');
      return response.data;
    } catch (error: any) {
      console.error("Get companies error:", error);
      throw error;
    }
  }

  /**
   * Get current user's company (Admin/Manager)
   */
  async getCurrentUserCompany(): Promise<GetCurrentCompanyResponse> {
    try {
      const response = await api.get('/api/companies/current');
      return response.data;
    } catch (error: any) {
      console.error("Get current company error:", error);
      throw error;
    }
  }

  /**
   * Create a new company (SuperAdmin only)
   */
  async createCompany(companyData: CreateCompanyData): Promise<CreateCompanyResponse> {
    try {
      const response = await api.post('/api/companies', companyData);
      return response.data;
    } catch (error: any) {
      console.error("Create company error:", error);
      throw error;
    }
  }

  /**
   * Update company (SuperAdmin only)
   */
  async updateCompany(companyId: number, companyData: Partial<CreateCompanyData & { isActive: boolean }>): Promise<CreateCompanyResponse> {
    try {
      const response = await api.put(`/api/companies/${companyId}`, companyData);
      return response.data;
    } catch (error: any) {
      console.error("Update company error:", error);
      throw error;
    }
  }

  /**
   * Validate employee ID format
   */
  validateEmployeeId(employeeId: string): boolean {
    // Allow letters, numbers, hyphens, and underscores
    const regex = /^[A-Za-z0-9_-]+$/;
    return regex.test(employeeId) && employeeId.length >= 3 && employeeId.length <= 20;
  }

  async createCeo(data: CreateCeoData): Promise<CreateCeoResponse> {
    const response = await api.post('/api/ceos', data);
    return response.data;
  }

  async getCeos(page = 1, limit = 20, search?: string): Promise<GetCeosResponse> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append('search', search);
    const response = await api.get(`/api/ceos?${params}`);
    return response.data;
  }

  async deleteCeo(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/api/ceos/${id}`);
    return response.data;
  }

  async getCompanyById(id: number): Promise<{ success: boolean; company: CompanyFull }> {
    const response = await api.get(`/api/companies/${id}`);
    return response.data;
  }

  async deleteCompany(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/api/companies/${id}`);
    return response.data;
  }
}

export const userService = new UserService();
