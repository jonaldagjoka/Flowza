import { useEffect, useState } from 'react';
import { Login } from './features/auth/Login';
import { AdminDashboard } from './features/dashboard/AdminDashboard';
import { TeamLeaderDashboard } from './features/dashboard/TeamLeaderDashboard';
import { ProgrammerDashboard } from './features/dashboard/ProgrammerDashboard';
import { API_BASE_URL } from './features/auth/api';
import type { AuthUser } from './features/auth/api';
import type { User, Project, ProjectMember, Task, TaskHistory, ProjectFile } from './utils/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentUserRole = currentUser?.role ?? null;

  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, options);
    const json = await response.json().catch(() => null);

    if (!response.ok) {
      const message = json?.message || 'API request failed.';
      throw new Error(message);
    }

    if (!json || !json.success) {
      throw new Error(json?.message || 'Invalid API response.');
    }

    return json;
  };

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const json = await apiFetch('data.php?type=all');
      setUsers(json.data.users ?? []);
      setProjects(json.data.projects ?? []);
      setProjectMembers(json.data.project_members ?? []);
      setTasks(json.data.tasks ?? []);
      setTaskHistory(json.data.task_history ?? []);
      setProjectFiles(json.data.project_files ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      void loadData();
    }
  }, [currentUser]);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUsers([]);
    setProjects([]);
    setProjectMembers([]);
    setTasks([]);
    setTaskHistory([]);
    setProjectFiles([]);
    setError('');
  };

  const postAction = async (action: string, body: object) => {
    setLoading(true);
    setError('');

    try {
      await apiFetch(`data.php?action=${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to perform action.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData: Omit<Project, 'project_id' | 'created_at' | 'created_by'>) => {
    if (!currentUser) {
      throw new Error('Not authenticated.');
    }

    await postAction('createproject', {
      ...projectData,
      created_by: currentUser.user_id,
    });
  };

  const handleAssignTeamLeader = async (projectId: number, userId: number) => {
    await postAction('assignteamleader', { project_id: projectId, user_id: userId });
  };

  const handleCreateTask = async (taskData: Omit<Task, 'task_id' | 'created_at' | 'created_by'>) => {
    if (!currentUser) {
      throw new Error('Not authenticated.');
    }

    await postAction('createtask', {
      ...taskData,
      created_by: currentUser.user_id,
    });
  };

  const handleUpdateProjectStatus = async (projectId: number, status: 'new' | 'in progress' | 'done') => {
    await postAction('updateprojectstatus', { project_id: projectId, status });
  };

  const handleUpdateTaskStatus = async (taskId: number, status: 'new' | 'in progress' | 'review' | 'done') => {
    if (!currentUser) {
      throw new Error('Not authenticated.');
    }

    await postAction('updatetaskstatus', {
      task_id: taskId,
      status,
      changed_by: currentUser.user_id,
    });
  };

  const handleUploadFile = async (taskId: number, fileName: string) => {
    if (!currentUser) {
      throw new Error('Not authenticated.');
    }

    await postAction('uploadfile', {
      task_id: taskId,
      file_name: fileName,
      uploaded_by: currentUser.user_id,
    });
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUserRole === 'admin') {
    return (
      <AdminDashboard
        currentUser={currentUser}
        users={users}
        projects={projects}
        projectMembers={projectMembers}
        onCreateProject={handleCreateProject}
        onAssignTeamLeader={handleAssignTeamLeader}
        onLogout={handleLogout}
      />
    );
  }

  if (currentUserRole === 'teamleader') {
    return (
      <TeamLeaderDashboard
        currentUser={currentUser}
        users={users}
        projects={projects}
        tasks={tasks}
        projectMembers={projectMembers}
        onCreateTask={handleCreateTask}
        onUpdateProjectStatus={handleUpdateProjectStatus}
        onLogout={handleLogout}
      />
    );
  }

  if (currentUserRole === 'programmer') {
    return (
      <ProgrammerDashboard
        currentUser={currentUser}
        users={users}
        tasks={tasks}
        taskHistory={taskHistory}
        projectFiles={projectFiles}
        onUpdateTaskStatus={handleUpdateTaskStatus}
        onUploadFile={handleUploadFile}
        onLogout={handleLogout}
      />
    );
  }

  return <Login onLogin={handleLogin} />;
}