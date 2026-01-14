
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { projectService } from '@/app/services/projectService';
import { Calendar, Users, Building2, FileText, User, CheckCircle2 } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Department {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
  designation: string;
  department?: {
    id: number;
    name: string;
  };
}

interface CreateProjectData {
  name: string;
  description: string;
  departmentId: number;
  clientName: string;
  startDate: string;
  endDate: string;
  memberIds: number[];
}

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    departmentId: 0,
    clientName: '',
    startDate: '',
    endDate: '',
    memberIds: []
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  const [dataLoading, setDataLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setCompanyId(userData.companyId);
      }
      loadEmployees();
    }
  }, [isOpen]);

  const loadEmployees = async () => {
    setDataLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('User information not found. Please log in again.');
        setDataLoading(false);
        return;
      }

      const userData = JSON.parse(userStr);
      console.log('📥 Loading employees for company:', userData.companyId);
      
      const result = await projectService.getAvailableEmployees(userData.companyId);
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('✅ Employees loaded:', result.data.length);
        setEmployees(result.data);
        // Extract unique departments from employees
        const uniqueDepts = Array.from(
          new Map(
            result.data
              .filter((emp: any) => emp.department)
              .map((emp: any) => [emp.department.id, emp.department])
          ).values()
        );
        setDepartments(uniqueDepts as Department[]);
        setError('');
      } else {
        console.warn('⚠️ No employees found or API error:', result.message);
        setEmployees([]);
        setDepartments([]);
        setError('');
      }
    } catch (error) {
      console.error('❌ Error loading employees:', error);
      setEmployees([]);
      setDepartments([]);
      setError('');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }
    
    if (!formData.departmentId || formData.departmentId === 0) {
      setError('Please select a department');
      return;
    }

    if (!formData.clientName.trim()) {
      setError('Client name is required');
      return;
    }

    if (!formData.startDate) {
      setError('Start date is required');
      return;
    }

    if (!formData.endDate) {
      setError('End date is required');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('User information not found. Please log in again.');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userStr);
      
      // Validate user data
      if (!userData.companyId) {
        setError('Company ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      if (!userData.employeeId) {
        setError('Employee ID not found. Please ensure you have an employee record.');
        setLoading(false);
        return;
      }

      const projectData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        departmentId: formData.departmentId,
        companyId: userData.companyId,
        ownerId: userData.employeeId, // Add the owner ID from the logged-in user
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'PLANNING' as const,
        teamMembers: selectedMembers.length > 0 ? selectedMembers.map(memberId => ({
          employeeId: memberId,
          role: 'MEMBER' as const
        })) : []
      };

      console.log('📤 Submitting project creation with data:', projectData);
      console.log('👤 User context:', {
        userId: userData.id,
        employeeId: userData.employeeId,
        companyId: userData.companyId,
        role: userData.role,
        designation: userData.designation
      });

      const result = await projectService.createProject(projectData);
      
      if (result.success) {
        console.log('✅ Project created successfully:', result.data);
        onSuccess();
        onClose();
        resetForm();
      } else {
        setError(result.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error instanceof Error ? error.message : 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      departmentId: 0,
      clientName: '',
      startDate: '',
      endDate: '',
      memberIds: []
    });
    setSelectedMembers([]);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleMember = (employeeId: number) => {
    setSelectedMembers(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create New Project
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <span className="text-red-500 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {dataLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
            <span className="text-gray-600">Loading project data...</span>
          </div>
        ) : (
          <div className="space-y-6 px-2">
            {/* Project Basic Info Section */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Project Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="font-medium">Project Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Mobile App Development"
                    disabled={loading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the project scope and objectives..."
                    rows={3}
                    disabled={loading}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Company & Department Section */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                Organization Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Company ID</Label>
                  <div className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium">
                    {companyId || 'N/A'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Auto-filled from your organization</p>
                </div>

                <div>
                  <Label htmlFor="department" className="font-medium">Department *</Label>
                  <Select
                    value={formData.departmentId.toString()}
                    onValueChange={(value) => setFormData({ ...formData, departmentId: parseInt(value) })}
                  >
                    <SelectTrigger disabled={loading} className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.length === 0 ? (
                        <SelectItem value="0">No departments available</SelectItem>
                      ) : (
                        departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Client & Timeline Section */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                Client & Timeline
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName" className="font-medium">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g., Acme Corporation"
                    disabled={loading}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="font-medium">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      disabled={loading}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate" className="font-medium">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={loading}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Manager & Team Section */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-orange-600" />
                Project Manager
              </h3>
              
              <div className="px-3 py-3 bg-white border border-orange-200 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{user?.designation || 'Manager'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Team Members
              </h3>
              
              {employees.length === 0 ? (
                <div className="text-sm text-gray-500 py-4 text-center">No employees available</div>
              ) : (
                <div className="space-y-2">
                  <div className="max-h-48 overflow-y-auto border border-indigo-200 rounded-lg bg-white p-3 space-y-2">
                    {employees.map((employee) => (
                      <label 
                        key={employee.id} 
                        className="flex items-center space-x-3 cursor-pointer hover:bg-indigo-50 p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(employee.id)}
                          onChange={() => toggleMember(employee.id)}
                          disabled={loading}
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                          <p className="text-xs text-gray-500">{employee.designation} • {employee.department?.name || 'N/A'}</p>
                        </div>
                        {selectedMembers.includes(employee.id) && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        )}
                      </label>
                    ))}
                  </div>
                  {selectedMembers.length > 0 && (
                    <p className="text-xs text-indigo-600 font-medium mt-2">
                      ✓ {selectedMembers.length} member(s) selected
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={loading}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </span>
                ) : (
                  'Create Project'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}