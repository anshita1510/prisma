'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sidebar from '../../admin/_components/Sidebar_A';
import { AddTeamMemberModal } from '@/components/team/AddTeamMemberModal';
import { AddManagerTeamMemberModal } from '@/components/team/AddManagerTeamMemberModal';
import { employeeService } from '@/app/services/employeeService';
import { teamService } from '@/app/services/teamService';
import api from '@/lib/axios';
import {
  Users,
  Plus,
  Mail,
  Phone,
  MapPin,
  Search,
  MoreVertical,
  CheckSquare,
  Clock
} from 'lucide-react';

interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  role: string;
  designation: string;
  avatar: string;
  status: 'ACTIVE' | 'AWAY' | 'BUSY' | 'OFFLINE';
  activeTasks: number;
  completedTasks: number;
  location: string;
  phone: string;
  isActive?: boolean;
}

export default function TeamPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');

  useEffect(() => {
    // Get user role from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    setUserRole(user?.role || '');

    // Load appropriate team members based on role
    if (user?.role === 'MANAGER') {
      loadManagerTeamMembers();
    } else {
      loadTeamMembers();
    }

    // Load projects for filtering
    loadProjects();
  }, []);

  const loadTeamMembers = async () => {
    setLoading(true);
    setDebugInfo('Loading team members...');
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const companyId = user?.companyId;

      // Use companyId filter if available, otherwise let backend scope by auth user
      const url = companyId
        ? `/api/employees?companyId=${companyId}`
        : '/api/employees';

      const response = await api.get(url);
      const data = response.data?.data || response.data || [];
      const list = Array.isArray(data) ? data : [];

      const members: TeamMember[] = list.map((emp: any) => ({
        id: emp.id || emp.employeeId,
        name: emp.name || 'Unknown',
        email: emp.email || emp.user?.email || '',
        role: emp.role || emp.user?.role || 'EMPLOYEE',
        designation: emp.designation || 'Employee',
        avatar: employeeService.generateAvatarInitials(emp.name || 'U'),
        status: emp.status || 'ACTIVE',
        activeTasks: emp.activeTasks || 0,
        completedTasks: emp.completedTasks || 0,
        location: emp.location || 'Not specified',
        phone: emp.phone || emp.user?.phone || 'N/A',
        isActive: emp.isActive !== false,
      }));

      setTeamMembers(members);
      setDebugInfo(members.length > 0 ? `✅ Loaded ${members.length} team members` : 'No team members found.');
    } catch (error: any) {
      console.error('❌ Error loading team members:', error);
      setDebugInfo(`Error: ${error?.response?.data?.message || error?.message || 'Failed to load team members'}`);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadManagerTeamMembers = async () => {
    setLoading(true);
    setDebugInfo('Loading your team members...');
    try {
      console.log('🔍 Fetching manager team members...');

      const result = await teamService.getManagerTeamMembers();
      console.log('📊 Team members result:', result);

      if (result.success && result.data && Array.isArray(result.data)) {
        console.log('✅ Found team members:', result.data.length);

        // Transform employees to team members
        const members: TeamMember[] = result.data.map((emp: any) => ({
          id: emp.id || emp.employeeId,
          name: emp.name,
          email: emp.email || emp.user?.email || '',
          role: emp.role || emp.user?.role || 'EMPLOYEE',
          designation: emp.designation || 'Employee',
          avatar: teamService.generateAvatarInitials(emp.name),
          status: emp.status || 'ACTIVE',
          activeTasks: emp.activeTasks || 0,
          completedTasks: emp.completedTasks || 0,
          location: emp.location || 'Not specified',
          phone: emp.phone || emp.user?.phone || 'N/A',
          isActive: emp.isActive !== false,
        }));

        setTeamMembers(members);
        setDebugInfo(`✅ Loaded ${members.length} team members`);
        console.log('✅ Team members loaded:', members.length);
      } else {
        console.warn('⚠️ No team members found or API error');
        setDebugInfo('No team members assigned yet. Add one to get started.');
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('❌ Error loading team members:', error);
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user?.companyId) return;

      const { dynamicProjectService } = await import('@/app/services/dynamicProjectService');
      const result = await dynamicProjectService.getAllProjects({
        companyId: user.companyId
      });

      if (result.success && result.data) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('❌ Error loading projects:', error);
    }
  };

  const handleAddMemberSuccess = (newMember: TeamMember) => {
    console.log('✅ New member added:', newMember);
    // Add the new member to the list
    setTeamMembers(prev => [newMember, ...prev]);
    setDebugInfo(`✅ Team member "${newMember.name}" added successfully!`);
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'AWAY':
        return 'bg-yellow-100 text-yellow-800';
      case 'BUSY':
        return 'bg-red-100 text-red-800';
      case 'OFFLINE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDot = (status: TeamMember['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'AWAY':
        return 'bg-yellow-500';
      case 'BUSY':
        return 'bg-red-500';
      case 'OFFLINE':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    // Search filter
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Project filter
    if (selectedProject !== 'all') {
      const project = projects.find(p => p.id === parseInt(selectedProject));
      if (project && project.members) {
        const isProjectMember = project.members.some((m: any) => m.employeeId === member.id);
        return matchesSearch && isProjectMember;
      }
      return false;
    }

    return matchesSearch;
  });

  const isManager = userRole === 'MANAGER';
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
        <Sidebar />
        <main className="flex-1 min-w-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--primary-color)' }} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-color)' }}>
      <Sidebar />
      <main className="flex-1 min-w-0 pt-[57px] lg:pt-0">
        <div className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                  {isManager ? 'My Team' : 'Enhanced Team'}
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage your team members and their activities</p>
              </div>
              {isManager && (
                <Button
                  className="flex items-center gap-2"
                  onClick={() => setIsAddMemberOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add Team Member
                </Button>
              )}
              {isAdmin && (
                <Button
                  className="flex items-center gap-2"
                  onClick={() => router.push('/admin/manage-users')}
                >
                  <Users className="w-4 h-4" />
                  Manage Users
                </Button>
              )}
            </div>

            {/* Debug Info */}
            {debugInfo && (
              <div className="px-4 py-3 rounded-xl text-sm"
                style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary-color)', border: '1px solid var(--card-border)' }}>
                {debugInfo}
              </div>
            )}

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search team members..." value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)', color: 'var(--text-color)' }} />
              </div>

              {/* Project Filter */}
              {projects.length > 0 && (
                <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}
                  className="px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--card-border)', color: 'var(--text-color)' }}>
                  <option value="all">All Team Members</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id.toString()}>Project: {project.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{teamMembers.length}</p>
                      <p className="text-sm text-gray-600">Total Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {teamMembers.filter(m => m.status === 'ACTIVE').length}
                      </p>
                      <p className="text-sm text-gray-600">Active Now</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {teamMembers.reduce((sum, m) => sum + m.completedTasks, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Tasks Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {teamMembers.reduce((sum, m) => sum + m.activeTasks, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Active Tasks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member, index) => (
                <Card
                  key={member.id}
                  className="card-hover animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {member.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusDot(member.status)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <CardDescription>{member.designation}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Status */}
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{member.location}</span>
                      </div>
                    </div>

                    {/* Task Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-lg font-bold text-orange-600">{member.activeTasks}</p>
                        <p className="text-xs text-gray-600">Active Tasks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{member.completedTasks}</p>
                        <p className="text-xs text-gray-600">Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first team member'}
                </p>
                {isManager && (
                  <Button
                    className="flex items-center gap-2 mx-auto"
                    onClick={() => setIsAddMemberOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Team Member
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add Team Member Modal - for Admins */}
        {isAdmin && (
          <AddTeamMemberModal
            isOpen={isAddMemberOpen}
            onClose={() => setIsAddMemberOpen(false)}
            onSuccess={handleAddMemberSuccess}
          />
        )}

        {/* Add Manager Team Member Modal - for Managers */}
        {isManager && (
          <AddManagerTeamMemberModal
            isOpen={isAddMemberOpen}
            onClose={() => setIsAddMemberOpen(false)}
            onSuccess={handleAddMemberSuccess}
          />
        )}
      </main>
    </div>
  );
}