'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { dynamicProjectService } from '@/app/services/dynamicProjectService';
import { taskGenerationService, type GeneratedTask } from '@/app/services/taskGenerationService';
import { CheckCircle2, Calendar, Users, Briefcase, User, Zap, Tag } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: number;
  projectName?: string;
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

export function CreateTaskModal({ isOpen, onClose, onSuccess, projectId, projectName }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    assignedToId: '',
  });
  const [generatedTask, setGeneratedTask] = useState<GeneratedTask | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      }
      loadProjectMembers();
    }
  }, [isOpen]);

  const loadProjectMembers = async () => {
    setDataLoading(true);
    try {
      const result = await dynamicProjectService.getProjectMembers(projectId);
      
      if (result.success && result.data) {
        const memberEmployees = result.data
          .filter((member: any) => member.employee)
          .map((member: any) => member.employee);
        setEmployees(memberEmployees);
        console.log('✅ Project members loaded:', memberEmployees.length);
      } else {
        console.warn('⚠️ No project members found');
        setEmployees([]);
      }
    } catch (error) {
      console.error('❌ Error loading project members:', error);
      setEmployees([]);
    } finally {
      setDataLoading(false);
    }
  };

  const handleGeneratePreview = () => {
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!formData.dueDate) {
      setError('Due date is required');
      return;
    }

    setError('');

    try {
      const assignedUser = formData.assignedToId 
        ? employees.find(e => e.id === parseInt(formData.assignedToId))
        : null;

      const generated = taskGenerationService.generateTask({
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        assignedToId: formData.assignedToId ? parseInt(formData.assignedToId) : undefined,
        projectId: projectId,
        projectName: projectName,
        assignedUserName: assignedUser?.name,
      });

      setGeneratedTask(generated);
      setShowPreview(true);
      console.log('✅ Task preview generated:', generated);
    } catch (error) {
      console.error('❌ Error generating preview:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate preview');
    }
  };

  const handleSubmit = async () => {
    if (!generatedTask) {
      setError('Please generate preview first');
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
      const createdById = userData.employeeId;

      if (!createdById) {
        setError('Employee ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      // Map generated status to valid backend status
      let backendStatus: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED' = 'TODO';
      if (generatedTask.status === 'IN_PROGRESS') {
        backendStatus = 'IN_PROGRESS';
      } else if (generatedTask.status === 'COMPLETED') {
        backendStatus = 'COMPLETED';
      } else if (generatedTask.status === 'CANCELLED') {
        backendStatus = 'CANCELLED';
      }
      // OVERDUE and TODO both map to TODO

      const taskData = {
        title: generatedTask.title,
        description: generatedTask.description,
        projectId: projectId,
        priority: generatedTask.priority,
        status: backendStatus,
        assignedToId: generatedTask.assignedToId,
        dueDate: generatedTask.dueDate,
        startDate: generatedTask.startDate,
        estimatedHours: generatedTask.estimatedHours,
        createdById: createdById,
      };

      console.log('📤 Submitting task creation with data:', taskData);

      const result = await dynamicProjectService.createTask(taskData);
      
      console.log('📥 API Response:', result);

      if (result.success) {
        console.log('✅ Task created successfully:', result.data);
        onSuccess();
        onClose();
        resetForm();
      } else {
        console.error('❌ Task creation failed:', result.message);
        setError(result.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('❌ Error creating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      dueDate: '',
      assignedToId: '',
    });
    setGeneratedTask(null);
    setShowPreview(false);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'TODO': 'bg-gray-100 text-gray-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'OVERDUE': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            {showPreview ? 'Review Generated Task' : 'Create New Task'}
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
            <span className="text-gray-600">Loading task data...</span>
          </div>
        ) : showPreview && generatedTask ? (
          // Preview Mode
          <div className="space-y-6 px-2">
            {/* Task Preview */}
            <div className="space-y-4">
              {/* Title & Status */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">{generatedTask.title}</h2>
                  <Badge className={getStatusColor(generatedTask.status)}>
                    {generatedTask.status}
                  </Badge>
                </div>
                <p className="text-gray-700">{generatedTask.description}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-600 font-medium">Priority</p>
                  <Badge className={getPriorityColor(generatedTask.priority)}>
                    {generatedTask.priority}
                  </Badge>
                </div>

                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-600 font-medium">Estimated Hours</p>
                  <p className="text-lg font-bold text-green-900">{generatedTask.estimatedHours}h</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <p className="text-xs text-orange-600 font-medium">Days Until Due</p>
                  <p className="text-lg font-bold text-orange-900">{generatedTask.metadata.daysUntilDue}</p>
                </div>

                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <p className="text-xs text-red-600 font-medium">Urgency Score</p>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-red-600" />
                    <p className="text-lg font-bold text-red-900">{generatedTask.metadata.urgencyScore}</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Timeline
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {generatedTask.startDate && (
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium text-gray-900">{generatedTask.startDate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium text-gray-900">{generatedTask.dueDate}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {generatedTask.tags.length > 0 && (
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    Auto-Generated Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {generatedTask.tags.map((tag) => (
                      <Badge key={tag} className="bg-indigo-200 text-indigo-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignment */}
              {generatedTask.assignedUserName && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    Assigned To
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{generatedTask.assignedUserName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Creator Info */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-600" />
                  Task Creator
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{user?.designation || 'Team Member'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPreview(false)}
                disabled={loading}
                className="px-6"
              >
                Edit
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
                  'Create Task'
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Input Mode
          <div className="space-y-6 px-2">
            {/* Task Basic Info Section */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Task Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="font-medium">Task Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Implement user authentication"
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
                    placeholder="Describe the task details, requirements, and any relevant keywords (UI/UX, Backend, API, Database, Authentication, Performance, etc.)"
                    rows={4}
                    disabled={loading}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">💡 Tip: Include keywords like 'urgent', 'bug fix', 'UI design', 'API integration' for better auto-detection</p>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                Timeline
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="font-medium">Start Date</Label>
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
                  <Label htmlFor="dueDate" className="font-medium">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    disabled={loading}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Assignment
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assignedTo" className="font-medium">Assign To</Label>
                  <Select
                    value={formData.assignedToId}
                    onValueChange={(value) => setFormData({ ...formData, assignedToId: value })}
                  >
                    <SelectTrigger disabled={loading} className="mt-1">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Unassigned
                        </span>
                      </SelectItem>
                      {employees.length > 0 && employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {emp.name} ({emp.designation})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.assignedToId && (
                  <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {employees.find(e => e.id === parseInt(formData.assignedToId))?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {employees.find(e => e.id === parseInt(formData.assignedToId))?.designation}
                        </p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 ml-auto" />
                    </div>
                  </div>
                )}
              </div>
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
                onClick={handleGeneratePreview}
                disabled={loading}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </span>
                ) : (
                  'Generate Preview'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
