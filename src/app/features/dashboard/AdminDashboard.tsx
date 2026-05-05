import { useState } from 'react';
import { User, Project, ProjectMember, mockUsers } from '../../utils/mockData';
import { Plus, LogOut, Users, FolderKanban, CheckCircle } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  projects: Project[];
  projectMembers: ProjectMember[];
  onCreateProject: (project: Omit<Project, 'project_id' | 'created_at' | 'created_by'>) => void;
  onAssignTeamLeader: (projectId: number, userId: number) => void;
  onLogout: () => void;
}

export function AdminDashboard({
  currentUser,
  projects,
  projectMembers,
  onCreateProject,
  onAssignTeamLeader,
  onLogout
}: AdminDashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'new' as const,
    priority: 'medium' as const,
    start_date: '',
    deadline: '',
  });

  const teamLeaders = mockUsers.filter(u => u.role === 'teamleader');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateProject(newProject);
    setNewProject({ name: '', description: '', status: 'new', priority: 'medium', start_date: '', deadline: '' });
    setShowCreateModal(false);
  };

  const getProjectTeamLeader = (projectId: number) => {
    const member = projectMembers.find(m => m.project_id === projectId && m.role_in_project === 'teamleader');
    return member ? mockUsers.find(u => u.user_id === member.user_id) : null;
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
      case 'in progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = [
    { label: 'Total Projects',  value: projects.length,                                         icon: <FolderKanban className="w-8 h-8 text-blue-400"   /> },
    { label: 'Active Projects', value: projects.filter(p => p.status === 'in progress').length, icon: <FolderKanban className="w-8 h-8 text-green-400"  /> },
    { label: 'Team Members',    value: mockUsers.filter(u => u.role !== 'admin').length,         icon: <Users        className="w-8 h-8 text-purple-400" /> },
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
              <h1 className="text-base font-semibold text-gray-900 leading-tight">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Welcome, {currentUser.name}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">All Projects</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Project
          </button>
        </div>

        <div className="space-y-4">
          {projects.map(project => {
            const teamLeader = getProjectTeamLeader(project.project_id);
            return (
              <div key={project.project_id} className="bg-white/80 backdrop-blur border border-blue-100 p-5 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{project.description}</p>
                    <div className="flex gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Team Leader</p>
                    {teamLeader ? (
                      <div className="flex items-center gap-1.5 justify-end">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        <p className="text-sm font-medium text-gray-700">{teamLeader.name}</p>
                      </div>
                    ) : (
                      <select
                        onChange={(e) => {
                          if (e.target.value) onAssignTeamLeader(project.project_id, parseInt(e.target.value));
                        }}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-gray-600"
                        defaultValue=""
                      >
                        <option value="">Assign Team Leader</option>
                        {teamLeaders.map(tl => (
                          <option key={tl.user_id} value={tl.user_id}>{tl.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-gray-400 border-t border-blue-50 pt-3">
                  <div><span className="font-medium text-gray-500">Start:</span> {new Date(project.start_date).toLocaleDateString()}</div>
                  <div><span className="font-medium text-gray-500">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-blue-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Project Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as any })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                  >
                    <option value="new">New</option>
                    <option value="in progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Start Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Deadline</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
