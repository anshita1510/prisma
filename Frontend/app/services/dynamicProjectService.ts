import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5004';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Project {
  id: number;
  name: string;
  description?: string;
  code?: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  progressPercentage: number;
  startDate?: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  companyId: number;
  departmentId: number;
  ownerId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: number;
    name: string;
    designation: string;
  };
  department?: {
    id: number;
    name: string;
  };
  members?: ProjectMember[];
  tasks?: Task[];
  _count?: {
    tasks: number;
    members: number;
  };
}

export interface ProjectMember {
  id: number;
  projectId: number;
  employeeId: number;
  role: 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER';
  joinedAt: string;
  isActive: boolean;
  employee?: {
    id: number;
    name: string;
    designation: string;
  };
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  code?: string;
  projectId: number;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  startDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  progressPercentage: number;
  assignedToId?: number;
  createdById: number;
  milestoneId?: number;
  parentTaskId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: number;
    name: string;
    designation: string;
  };
  createdBy?: {
    id: number;
    name: string;
  };
  project?: {
    id: number;
    name: string;
  };
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  code?: string;
  departmentId?: number;
  companyId?: number; // Optional
  ownerId?: number; // Optional
  startDate?: string;
  endDate?: string;
  budget?: number;
  status?: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  memberIds?: number[];
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  code?: string;
  projectId: number;
  status?: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  assignedToId?: number;
  milestoneId?: number;
  parentTaskId?: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  progressPercentage?: number;
  assignedToId?: number;
}

export const dynamicProjectService = {
  // ============ PROJECT OPERATIONS ============

  async getAllProjects(filters?: {
    companyId?: number;
    departmentId?: number;
    status?: string;
    ownerId?: number;
  }) {
    try {
      const params = new URLSearchParams();
      if (filters?.companyId) params.append('companyId', filters.companyId.toString());
      if (filters?.departmentId) params.append('departmentId', filters.departmentId.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.ownerId) params.append('ownerId', filters.ownerId.toString());

      const response = await api.get(`/api/project-management${params.toString() ? `?${params.toString()}` : ''}`);
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Get all projects error:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch projects'
      };
    }
  },

  async getProjectById(projectId: number) {
    try {
      const response = await api.get(`/api/project-management/${projectId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Get project error:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch project'
      };
    }
  },

  async createProject(payload: CreateProjectPayload) {
    try {
      console.log('📤 Creating project:', payload);
      const response = await api.post('/api/project-management', payload);
      console.log('✅ Project created:', response.data.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Create project error:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create project'
      };
    }
  },

  async updateProject(projectId: number, payload: Partial<CreateProjectPayload>) {
    try {
      const response = await api.put(`/api/project-management/${projectId}`, payload);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Update project error:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update project'
      };
    }
  },

  async deleteProject(projectId: number) {
    try {
      const response = await api.delete(`/api/project-management/${projectId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Delete project error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete project'
      };
    }
  },

  // ============ TASK OPERATIONS ============

  async getProjectTasks(projectId: number, filters?: {
    status?: string;
    assignedToId?: number;
  }) {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId.toString());

      const response = await api.get(
        `/api/project-management/${projectId}/tasks${params.toString() ? `?${params.toString()}` : ''}`
      );
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Get project tasks error:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch tasks'
      };
    }
  },

  async createTask(payload: CreateTaskPayload) {
    try {
      console.log('📤 Creating task with payload:', payload);
      console.log('🔗 Endpoint: /api/project-management/' + payload.projectId + '/tasks');

      const response = await api.post(
        `/api/project-management/${payload.projectId}/tasks`,
        payload
      );

      console.log('✅ Task created response:', response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Create task error:', error);
      console.error('📋 Error response:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message || 'Failed to create task'
      };
    }
  },

  async updateTask(taskId: number, payload: UpdateTaskPayload) {
    try {
      const response = await api.put(
        `/api/project-management/tasks/${taskId}`,
        payload
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Update task error:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update task'
      };
    }
  },

  async deleteTask(taskId: number) {
    try {
      const response = await api.delete(`/api/project-management/tasks/${taskId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Delete task error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete task'
      };
    }
  },

  // ============ TEAM MEMBER OPERATIONS ============

  async getProjectMembers(projectId: number) {
    try {
      const response = await api.get(`/api/project-management/${projectId}/members`);
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Get project members error:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch project members'
      };
    }
  },

  async assignTeamMember(projectId: number, employeeId: number, role: 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER') {
    try {
      const response = await api.post(
        `/api/project-management/${projectId}/members`,
        { employeeId, role }
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Assign team member error:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to assign team member'
      };
    }
  },

  async removeTeamMember(projectId: number, employeeId: number) {
    try {
      const response = await api.delete(
        `/api/project-management/${projectId}/members/${employeeId}`
      );
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('❌ Remove team member error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove team member'
      };
    }
  },

  // ============ UTILITY FUNCTIONS ============

  getStatusColor(status: string) {
    switch (status) {
      case 'PLANNING':
        return 'bg-purple-100 text-purple-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'TODO':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'IN_REVIEW':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  getPriorityColor(priority: string) {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};
