//Helena worked in this page
import { useState } from 'react';
import { User, Project, Task, ProjectMember, mockUsers } from '../../utils/mockData';
import { Plus, LogOut, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

interface TeamLeaderDashboardProps {
  currentUser: User;
  projects: Project[];
  tasks: Task[];
  projectMembers: ProjectMember[];
  onCreateTask: (task: Omit<Task, 'task_id' | 'created_at' | 'created_by'>) => void;
  onUpdateProjectStatus: (projectId: number, status: 'new' | 'in progress' | 'done') => void;
  onLogout: () => void;
}

export function TeamLeaderDashboard({
  currentUser,
  projects,
  tasks,
  projectMembers,
  onCreateTask,
  onUpdateProjectStatus,
  onLogout
}: TeamLeaderDashboardProps) {
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    task_name: '',
    description: '',
    assigned_to: 0,
    priority: 'medium' as const,
    status: 'new' as const,
    start_date: '',
    deadline: '',
  });

  const myProjects = projects.filter(p =>
    projectMembers.some(pm => pm.project_id === p.project_id && pm.user_id === currentUser.user_id && pm.role_in_project === 'teamleader')
  );

  const getProjectProgrammers = (projectId: number) => {
    const programmerMembers = projectMembers.filter(pm => pm.project_id === projectId && pm.role_in_project === 'programmer');
    return mockUsers.filter(u => programmerMembers.some(pm => pm.user_id === u.user_id));
  };

  const getProjectTasks = (projectId: number) => tasks.filter(t => t.project_id === projectId);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProjectId) {
      onCreateTask({ ...newTask, project_id: selectedProjectId });
      setNewTask({ task_name: '', description: '', assigned_to: 0, priority: 'medium', status: 'new', start_date: '', deadline: '' });
      setShowCreateTaskModal(false);
      setSelectedProjectId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-4 h-4" />;
      case 'review': return <FileText className="w-4 h-4" />;
      case 'in progress': return <Clock className="w-4 h-4" />;
      case 'new': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const myProjectIds = new Set(myProjects.map(p => p.project_id));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl">Team Leader Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {currentUser.name}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">My Projects</p>
            <p className="text-3xl mt-1">{myProjects.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-3xl mt-1">{tasks.filter(t => myProjectIds.has(t.project_id)).length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-3xl mt-1">{tasks.filter(t => t.status === 'in progress' && myProjectIds.has(t.project_id)).length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">In Review</p>
            <p className="text-3xl mt-1">{tasks.filter(t => t.status === 'review' && myProjectIds.has(t.project_id)).length}</p>
          </div>
        </div>

        <h2 className="text-xl mb-6">My Projects & Tasks</h2>

        <div className="space-y-6">
          {myProjects.map(project => {
            const projectTasks = getProjectTasks(project.project_id);
            return (
              <div key={project.project_id} className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg mb-2">{project.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={project.status}
                        onChange={(e) => onUpdateProjectStatus(project.project_id, e.target.value as any)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="new">New</option>
                        <option value="in progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <button
                        onClick={() => { setSelectedProjectId(project.project_id); setShowCreateTaskModal(true); }}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Task
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-sm mb-3">Tasks ({projectTasks.length})</h4>
                  {projectTasks.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No tasks created yet</p>
                  ) : (
                    <div className="space-y-3">
                      {projectTasks.map(task => {
                        const assignedUser = mockUsers.find(u => u.user_id === task.assigned_to);
                        return (
                          <div key={task.task_id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h5 className="text-sm mb-1">{task.task_name}</h5>
                                <p className="text-xs text-gray-600">{task.description}</p>
                              </div>
                              <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(task.status)}`}>
                                  {getStatusIcon(task.status)}
                                  {task.status}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-4 text-xs text-gray-600 mt-3">
                              <div><span className="font-medium">Assigned to:</span> {assignedUser?.name}</div>
                              <div><span className="font-medium">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showCreateTaskModal && selectedProjectId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Task Name</label>
                <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newTask.task_name} onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea required className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3}
                  value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm mb-1">Assign to Programmer</label>
                <select required className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newTask.assigned_to} onChange={(e) => setNewTask({ ...newTask, assigned_to: parseInt(e.target.value) })}>
                  <option value={0}>Select programmer</option>
                  {getProjectProgrammers(selectedProjectId).map(prog => (
                    <option key={prog.user_id} value={prog.user_id}>{prog.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}>
                    <option value="new">New</option>
                    <option value="in progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Start Date</label>
                  <input type="date" required className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newTask.start_date} onChange={(e) => setNewTask({ ...newTask, start_date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Deadline</label>
                  <input type="datetime-local" required className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => { setShowCreateTaskModal(false); setSelectedProjectId(null); }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}