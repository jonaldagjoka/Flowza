import { useState } from 'react';
import { User, Project, ProjectMember, mockUsers } from '../../utils/mockData';
import { Plus, LogOut, Users, FolderKanban } from 'lucide-react';

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
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {currentUser.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-3xl mt-1">{projects.length}</p>
              </div>
              <FolderKanban className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-3xl mt-1">{projects.filter(p => p.status === 'in progress').length}</p>
              </div>
              <FolderKanban className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-3xl mt-1">{mockUsers.filter(u => u.role !== 'admin').length}</p>
              </div>
              <Users className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl">All Projects</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {projects.map(project => {
            const teamLeader = getProjectTeamLeader(project.project_id);
            return (
              <div key={project.project_id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Team Leader</p>
                    {teamLeader ? (
                      <p className="text-sm mt-1">{teamLeader.name}</p>
                    ) : (
                      <select
                        onChange={(e) => {
                          if (e.target.value) onAssignTeamLeader(project.project_id, parseInt(e.target.value));
                        }}
                        className="mt-1 text-sm border border-gray-300 rounded px-2 py-1"
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
                <div className="flex gap-4 text-sm text-gray-600 border-t pt-4">
                  <div><span className="font-medium">Start:</span> {new Date(project.start_date).toLocaleDateString()}</div>
                  <div><span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as any })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  <label className="block text-sm mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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