'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateProjectData } from '@/app/types/project';
import { projectService } from '@/app/services/projectService';

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
}

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    departmentId: 0,
    memberIds: []
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Load departments and employees
      // You'll need to create these API endpoints
      loadDepartments();
      loadEmployees();
    }
  }, [isOpen]);

  const loadDepartments = async () => {
    // Implement API call to get departments
    // This is a placeholder - you'll need to create this endpoint
  };

  const loadEmployees = async () => {
    // Implement API call to get employees
    // This is a placeholder - you'll need to create this endpoint
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await projectService.createProject({
        ...formData,
        memberIds: selectedMembers
      });
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating project:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      departmentId: 0,
      memberIds: []
    });
    setSelectedMembers([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.departmentId.toString()}
              onValueChange={(value) => setFormData({ ...formData, departmentId: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Team Members</Label>
            <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
              {employees.map((employee) => (
                <label key={employee.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(employee.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers([...selectedMembers, employee.id]);
                      } else {
                        setSelectedMembers(selectedMembers.filter(id => id !== employee.id));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">
                    {employee.name} ({employee.designation})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}