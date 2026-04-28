import { useState } from 'react';
import { Login } from './features/auth/Login';
import { AdminDashboard } from './features/dashboard/AdminDashboard';
import { TeamLeaderDashboard } from './features/dashboard/TeamLeaderDashboard';
import { ProgrammerDashboard } from './features/dashboard/ProgrammerDashboard';
import {
  mockUsers,
  mockProjects,
  mockProjectMembers,
  mockTasks,
  mockTaskHistory,
  mockProjectFiles,
  User,
  Project,
  ProjectMember,
  Task,
  TaskHistory,
  ProjectFile
} from './utils/mockData';

export default function App() {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>(mockProjectMembers);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>(mockTaskHistory);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>(mockProjectFiles);

  const currentUser = mockUsers.find(u => u.user_id === currentUserId);

  const handleLogin = (userId: number, role: string) => {
    setCurrentUserId(userId);
    setCurrentUserRole(role);
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    setCurrentUserRole(null);
  };

  const handleCreateProject = (projectData: Omit<Project, 'project_id' | 'created_at' | 'created_by'>) => {
    const newProject: Project = {
      ...projectData,
      project_id: projects.length + 1,
      created_by: currentUserId!,
      created_at: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  const handleAssignTeamLeader = (projectId: number, userId: number) => {
    const existingMember = projectMembers.find(
      pm => pm.project_id === projectId && pm.role_in_project === 'teamleader'
    );

    if (existingMember) {
      alert('This project already has a team leader!');
      return;
    }

    const newMember: ProjectMember = {
      project_id: projectId,
      user_id: userId,
      role_in_project: 'teamleader',
      assigned_at: new Date().toISOString(),
    };
    setProjectMembers([...projectMembers, newMember]);
  };

  const handleCreateTask = (taskData: Omit<Task, 'task_id' | 'created_at' | 'created_by'>) => {
    const newTask: Task = {
      ...taskData,
      task_id: tasks.length + 1,
      created_by: currentUserId!,
      created_at: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateProjectStatus = (projectId: number, status: 'new' | 'in progress' | 'done') => {
    setProjects(projects.map(p =>
      p.project_id === projectId ? { ...p, status } : p
    ));
  };

  const handleUpdateTaskStatus = (taskId: number, status: 'new' | 'in progress' | 'review' | 'done') => {
    const task = tasks.find(t => t.task_id === taskId);
    if (task && task.status !== status) {
      const newHistory: TaskHistory = {
        history_id: taskHistory.length + 1,
        task_id: taskId,
        changed_by: currentUserId!,
        old_status: task.status,
        new_status: status,
        changed_at: new Date().toISOString(),
      };
      setTaskHistory([...taskHistory, newHistory]);

      setTasks(tasks.map(t =>
        t.task_id === taskId ? { ...t, status } : t
      ));
    }
  };

  const handleUploadFile = (taskId: number, fileName: string) => {
    const task = tasks.find(t => t.task_id === taskId);
    if (task) {
      const newFile: ProjectFile = {
        file_id: projectFiles.length + 1,
        project_id: task.project_id,
        task_id: taskId,
        uploaded_by: currentUserId!,
        file_name: fileName,
        file_path: `/uploads/${fileName}`,
        uploaded_at: new Date().toISOString(),
      };
      setProjectFiles([...projectFiles, newFile]);
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUserRole === 'admin') {
    return (
      <AdminDashboard
        currentUser={currentUser}
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