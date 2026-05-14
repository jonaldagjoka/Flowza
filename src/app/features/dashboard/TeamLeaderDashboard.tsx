import { useState } from 'react';
import { User, Project, Task, ProjectMember } from '../../utils/mockData';
import { Plus, LogOut, CheckCircle, Clock, AlertCircle, FileText, FolderOpen } from 'lucide-react';

interface TeamLeaderDashboardProps {
  currentUser: User;
  users: User[];
  projects: Project[];
  tasks: Task[];
  projectMembers: ProjectMember[];
  onCreateTask: (task: Omit<Task, 'task_id' | 'created_at' | 'created_by'>) => void;
  onUpdateProjectStatus: (projectId: number, status: 'new' | 'in progress' | 'done') => void;
  onLogout: () => void;
}

export function TeamLeaderDashboard({
  currentUser,
  users,
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
    return users.filter(u => programmerMembers.some(pm => pm.user_id === u.user_id));
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
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-700';
      case 'review': return 'bg-purple-100 text-purple-700';
      case 'in progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'review': return <FileText className="w-3.5 h-3.5" />;
      case 'in progress': return <Clock className="w-3.5 h-3.5" />;
      case 'new': return <AlertCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const myProjectIds = new Set(myProjects.map(p => p.project_id));

  const stats = [
    { label: 'My Projects',  value: myProjects.length,                                                                          icon: <FolderOpen className="w-8 h-8 text-blue-400" /> },
    { label: 'Total Tasks',  value: tasks.filter(t => myProjectIds.has(t.project_id)).length,                                   icon: <FileText   className="w-8 h-8 text-gray-400" /> },
    { label: 'In Progress',  value: tasks.filter(t => t.status === 'in progress' && myProjectIds.has(t.project_id)).length,     icon: <Clock      className="w-8 h-8 text-blue-400" /> },
    { label: 'In Review',    value: tasks.filter(t => t.status === 'review'      && myProjectIds.has(t.project_id)).length,     icon: <AlertCircle className="w-8 h-8 text-purple-400" /> },
    { label: 'Completed',    value: tasks.filter(t => t.status === 'done'        && myProjectIds.has(t.project_id)).length,     icon: <CheckCircle className="w-8 h-8 text-green-400" /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #e0f2fe 100%)' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-tight">Team Leader Dashboard</h1>
              <p className="text-xs text-gray-400">Welcome, {currentUser.name}</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="bg-white/80 backdrop-blur border border-blue-100 p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-3xl font-semibold text-gray-800 mt-1">{value}</p>
                </div>
                {icon}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">My Projects & Tasks</h2>

        <div className="space-y-5">
          {myProjects.map(project => {
            const projectTasks = getProjectTasks(project.project_id);
            return (
              <div key={project.project_id} className="bg-white/80 backdrop-blur border border-blue-100 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-blue-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-800 mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <select
                        value={project.status}
                        onChange={(e) => onUpdateProjectStatus(project.project_id, e.target.value as any)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="new">New</option>
                        <option value="in progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <button
                        onClick={() => { setSelectedProjectId(project.project_id); setShowCreateTaskModal(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Task
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Tasks ({projectTasks.length})</p>
                  {projectTasks.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-blue-100 rounded-lg">No tasks created yet</p>
                  ) : (
                    <div className="space-y-2.5">
                      {projectTasks.map(task => {
                        const assignedUser = users.find(u => u.user_id === task.assigned_to);
                        return (
                          <div key={task.task_id} className="border border-gray-100 rounded-lg p-4 bg-white hover:border-blue-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-gray-800 mb-0.5">{task.task_name}</h5>
                                <p className="text-xs text-gray-500">{task.description}</p>
                              </div>
                              <div className="flex gap-1.5 ml-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 font-medium ${getStatusColor(task.status)}`}>
                                  {getStatusIcon(task.status)}
                                  {task.status}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-4 text-xs text-gray-400 mt-2">
                              <div><span className="font-medium text-gray-500">Assigned to:</span> {assignedUser?.name}</div>
                              <div><span className="font-medium text-gray-500">Deadline:</span> {new Date(task.deadline).toLocaleDateString()}</div>
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-blue-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Task Name</label>
                <input type="text" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={newTask.task_name} onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" rows={3}
                  value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Assign to Programmer</label>
                <select required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={newTask.assigned_to} onChange={(e) => setNewTask({ ...newTask, assigned_to: parseInt(e.target.value) })}>
                  <option value={0}>Select programmer</option>
                  {getProjectProgrammers(selectedProjectId).map(prog => (
                    <option key={prog.user_id} value={prog.user_id}>{prog.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Start Date</label>
                  <input type="date" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={newTask.start_date} onChange={(e) => setNewTask({ ...newTask, start_date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Deadline</label>
                  <input type="datetime-local" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={() => { setShowCreateTaskModal(false); setSelectedProjectId(null); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
