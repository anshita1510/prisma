'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sidebar from '../../admin/_components/Sidebar_A';
import PageHeader from '../../admin/_components/PageHeader';
import {
  CheckSquare,
  Plus,
  Calendar,
  User,
  Clock,
  Search,
  Filter,
  MoreVertical,
  AlertCircle
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string;
  assignee: string;
  project: string;
  tags: string[];
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setTasks([
        {
          id: '1',
          title: 'Design user authentication flow',
          description: 'Create wireframes and mockups for the login and registration process',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: '2024-12-20',
          assignee: 'John Doe',
          project: 'Mobile App Development',
          tags: ['UI/UX', 'Authentication']
        },
        {
          id: '2',
          title: 'Implement REST API endpoints',
          description: 'Develop backend API endpoints for user management and data operations',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: '2024-12-25',
          assignee: 'Jane Smith',
          project: 'Mobile App Development',
          tags: ['Backend', 'API']
        },
        {
          id: '3',
          title: 'Database schema optimization',
          description: 'Optimize database queries and improve performance',
          status: 'COMPLETED',
          priority: 'LOW',
          dueDate: '2024-12-15',
          assignee: 'Mike Johnson',
          project: 'Database Migration',
          tags: ['Database', 'Performance']
        },
        {
          id: '4',
          title: 'Frontend component library',
          description: 'Build reusable React components for the design system',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          dueDate: '2024-12-30',
          assignee: 'Sarah Wilson',
          project: 'Website Redesign',
          tags: ['Frontend', 'Components']
        },
        {
          id: '5',
          title: 'Security audit and testing',
          description: 'Conduct comprehensive security testing and vulnerability assessment',
          status: 'BLOCKED',
          priority: 'URGENT',
          dueDate: '2024-12-18',
          assignee: 'Alex Brown',
          project: 'API Integration',
          tags: ['Security', 'Testing']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
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
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && tasks.find(t => t.dueDate === dueDate)?.status !== 'COMPLETED';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
          <PageHeader title="Enhanced Tasks" subtitle="Manage and track your team's tasks" />
          <div className="p-6">
            <div className="animate-fade-in">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main style={{ marginLeft: '64px', width: 'calc(100% - 64px)', minHeight: '100vh' }}>
        <PageHeader 
          title="Enhanced Tasks" 
          subtitle="Manage and track your team's tasks"
        >
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Task
          </Button>
        </PageHeader>
        <div className="p-6">
          <div className="space-y-6 animate-fade-in">
            {/* Search and Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
              </select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <Card
                key={task.id}
                className="card-hover animate-scale-in cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Title and Status */}
                      <div className="flex items-center gap-3">
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {isOverdue(task.dueDate) && (
                          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </Badge>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm">{task.description}</p>

                      {/* Meta Information */}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{task.assignee}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{task.project}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-2">
                        {task.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first task'
                }
              </p>
              <Button className="flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                Create New Task
              </Button>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}