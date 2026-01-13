'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, AlertCircle, CheckCircle, Play, Pause, Plus, Search, Filter, MessageSquare, Timer } from 'lucide-react';
import { roleBasedTaskService, Task } from '@/app/services/roleBasedTaskService';
import { authService } from '@/app/services/authService';
import DashboardLayout from '@/components/layout/DashboardLayout';

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  IN_REVIEW: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
};

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800'
};

export default function UserTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isTimeEntryOpen, setIsTimeEntryOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [timeEntry, setTimeEntry] = useState({
    description: '',
    startTime: '',
    endTime: '',
    duration: 0
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    setUser(currentUser);
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const result = await roleBasedTaskService.getTasks();
      if (result.success) {
        setTasks(result.data);
      } else {
        console.error('Failed to fetch tasks:', result.message);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const progressPercentage = newStatus === 'COMPLETED' ? 100 : 
                                newStatus === 'IN_PROGRESS' ? 50 : 
                                newStatus === 'IN_REVIEW' ? 80 : 0;
      
      const result = await roleBasedTaskService.updateTaskStatus(taskId, newStatus, progressPercentage);
      if (result.success) {
        fetchTasks();
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask({ ...selectedTask, status: newStatus as any, progressPercentage });
        }
      } else {
        console.error('Failed to update task:', result.message);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleAddTimeEntry = async () => {
    if (!selectedTask) return;

    try {
      const result = await roleBasedTaskService.addTimeEntry(selectedTask.id, timeEntry);
      if (result.success) {
        setIsTimeEntryOpen(false);
        setTimeEntry({ description: '', startTime: '', endTime: '', duration: 0 });
        // Refresh task details if needed
      } else {
        console.error('Failed to add time entry:', result.message);
      }
    } catch (error) {
      console.error('Error adding time entry:', error);
    }
  };

  const handleAddComment = async () => {
    if (!selectedTask || !newComment.trim()) return;

    try {
      const result = await roleBasedTaskService.addTaskComment(selectedTask.id, newComment);
      if (result.success) {
        setIsCommentOpen(false);
        setNewComment('');
        // Refresh task details if needed
      } else {
        console.error('Failed to add comment:', result.message);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO':
        return <AlertCircle className="w-4 h-4" />;
      case 'IN_PROGRESS':
        return <Play className="w-4 h-4" />;
      case 'IN_REVIEW':
        return <Pause className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && selectedTask?.status !== 'COMPLETED';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title and Description */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600 mt-1">Track progress and manage your assigned work</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search your tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Tasks</p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                  </p>
                </div>
                <Play className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {tasks.filter(t => t.status === 'COMPLETED').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">
                    {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow cursor-pointer" 
                  onClick={() => { setSelectedTask(task); setIsTaskDetailOpen(true); }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{task.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {task.project.name}
                    </CardDescription>
                  </div>
                  <Badge className={priorityColors[task.priority]}>
                    {task.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {task.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <Badge className={statusColors[task.status]}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(task.status)}
                      <span>{task.status.replace('_', ' ')}</span>
                    </div>
                  </Badge>
                  {task.dueDate && (
                    <div className={`flex items-center text-sm ${isOverdue(task.dueDate) ? 'text-red-500' : 'text-gray-500'}`}>
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(task.dueDate)}
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{task.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${task.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                  {task.status === 'TODO' && (
                    <Button
                      size="sm"
                      onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                    >
                      Start
                    </Button>
                  )}
                  {task.status === 'IN_PROGRESS' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTaskStatus(task.id, 'IN_REVIEW')}
                      >
                        Review
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
                      >
                        Complete
                      </Button>
                    </>
                  )}
                  {task.status === 'IN_REVIEW' && (
                    <Button
                      size="sm"
                      onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters to see more tasks.'
                : 'You don\'t have any tasks assigned yet. Check back later or contact your manager.'}
            </p>
          </div>
        )}

        {/* Task Detail Modal */}
        <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedTask && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedTask.title}</span>
                    <Badge className={priorityColors[selectedTask.priority]}>
                      {selectedTask.priority}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription>
                    Project: {selectedTask.project.name}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {selectedTask.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{selectedTask.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Status</h4>
                      <Badge className={statusColors[selectedTask.status]}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(selectedTask.status)}
                          <span>{selectedTask.status.replace('_', ' ')}</span>
                        </div>
                      </Badge>
                    </div>
                    {selectedTask.dueDate && (
                      <div>
                        <h4 className="font-medium mb-2">Due Date</h4>
                        <div className={`flex items-center text-sm ${isOverdue(selectedTask.dueDate) ? 'text-red-500' : 'text-gray-600'}`}>
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(selectedTask.dueDate)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Progress</h4>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Completion</span>
                      <span>{selectedTask.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${selectedTask.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsTimeEntryOpen(true)}
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      Log Time
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsCommentOpen(true)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>

                    {selectedTask.status === 'TODO' && (
                      <Button
                        size="sm"
                        onClick={() => updateTaskStatus(selectedTask.id, 'IN_PROGRESS')}
                      >
                        Start Task
                      </Button>
                    )}
                    {selectedTask.status === 'IN_PROGRESS' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTaskStatus(selectedTask.id, 'IN_REVIEW')}
                        >
                          Submit for Review
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateTaskStatus(selectedTask.id, 'COMPLETED')}
                        >
                          Mark Complete
                        </Button>
                      </>
                    )}
                    {selectedTask.status === 'IN_REVIEW' && (
                      <Button
                        size="sm"
                        onClick={() => updateTaskStatus(selectedTask.id, 'COMPLETED')}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Time Entry Modal */}
        <Dialog open={isTimeEntryOpen} onOpenChange={setIsTimeEntryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Time Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <Textarea
                  value={timeEntry.description}
                  onChange={(e) => setTimeEntry({...timeEntry, description: e.target.value})}
                  placeholder="What did you work on?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="datetime-local"
                    value={timeEntry.startTime}
                    onChange={(e) => setTimeEntry({...timeEntry, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="datetime-local"
                    value={timeEntry.endTime}
                    onChange={(e) => setTimeEntry({...timeEntry, endTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsTimeEntryOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTimeEntry}>
                  Log Time
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Comment Modal */}
        <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Comment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCommentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddComment}>
                  Add Comment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}