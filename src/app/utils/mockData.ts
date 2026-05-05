//Helena worked in this page
export interface User {
  user_id: number;
  name: string;
  email: string;
  role: 'admin' | 'teamleader' | 'programmer';
  created_at: string;
}

export interface Project {
  project_id: number;
  name: string;
  description: string;
  status: 'new' | 'in progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  start_date: string;
  deadline: string;
  created_by: number;
  created_at: string;
}

export interface ProjectMember {
  project_id: number;
  user_id: number;
  role_in_project: 'teamleader' | 'programmer';
  assigned_at: string;
}

export interface Task {
  task_id: number;
  project_id: number;
  assigned_to: number;
  created_by: number;
  task_name: string;
  description: string;
  status: 'new' | 'in progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  start_date: string;
  deadline: string;
  created_at: string;
}

export interface TaskHistory {
  history_id: number;
  task_id: number;
  changed_by: number;
  old_status: 'new' | 'in progress' | 'review' | 'done';
  new_status: 'new' | 'in progress' | 'review' | 'done';
  changed_at: string;
}

export interface ProjectFile {
  file_id: number;
  project_id: number;
  task_id?: number;
  uploaded_by: number;
  file_name: string;
  file_path: string;
  uploaded_at: string;
}

export const mockUsers: User[] = [
  { user_id: 1, name: 'Admin User', email: 'admin@flowza.com', role: 'admin', created_at: '2026-01-01T10:00:00Z' },
  { user_id: 2, name: 'Helena Kace', email: 'team1@flowza.com', role: 'teamleader', created_at: '2026-01-02T10:00:00Z' },
  { user_id: 3, name: 'Erjeta Rrapaj', email: 'team2@flowza.com', role: 'teamleader', created_at: '2026-01-03T10:00:00Z' },
  { user_id: 4, name: 'Isnalda Sylaj', email: 'dev1@flowza.com', role: 'programmer', created_at: '2026-01-04T10:00:00Z' },
  { user_id: 5, name: 'Jonalda Gjoka', email: 'dev2@flowza.com', role: 'programmer', created_at: '2026-01-05T10:00:00Z' },
  { user_id: 6, name: 'Herta Guraj', email: 'dev3@flowza.com', role: 'programmer', created_at: '2026-01-06T10:00:00Z' },
];

export const mockProjects: Project[] = [
  {
    project_id: 1,
    name: 'E-Commerce Platform',
    description: 'Build a new e-commerce platform with React and Node.js',
    status: 'in progress',
    priority: 'high',
    start_date: '2026-02-01',
    deadline: '2026-06-30',
    created_by: 1,
    created_at: '2026-01-15T10:00:00Z'
  },
  {
    project_id: 2,
    name: 'Mobile App Development',
    description: 'Create a mobile app for iOS and Android',
    status: 'in progress',
    priority: 'medium',
    start_date: '2026-03-01',
    deadline: '2026-08-31',
    created_by: 1,
    created_at: '2026-02-20T10:00:00Z'
  },
  {
    project_id: 3,
    name: 'Data Analytics Dashboard',
    description: 'Build an analytics dashboard for business intelligence',
    status: 'new',
    priority: 'low',
    start_date: '2026-05-01',
    deadline: '2026-10-31',
    created_by: 1,
    created_at: '2026-04-10T10:00:00Z'
  }
];

export const mockProjectMembers: ProjectMember[] = [
  { project_id: 1, user_id: 2, role_in_project: 'teamleader', assigned_at: '2026-01-15T11:00:00Z' },
  { project_id: 1, user_id: 4, role_in_project: 'programmer', assigned_at: '2026-01-16T10:00:00Z' },
  { project_id: 1, user_id: 5, role_in_project: 'programmer', assigned_at: '2026-01-16T10:00:00Z' },
  { project_id: 2, user_id: 3, role_in_project: 'teamleader', assigned_at: '2026-02-20T11:00:00Z' },
  { project_id: 2, user_id: 6, role_in_project: 'programmer', assigned_at: '2026-02-21T10:00:00Z' },
];

export const mockTasks: Task[] = [
  {
    task_id: 1,
    project_id: 1,
    assigned_to: 4,
    created_by: 2,
    task_name: 'Setup Project Structure',
    description: 'Initialize the project with React, TypeScript, and Tailwind',
    status: 'done',
    priority: 'high',
    start_date: '2026-02-01',
    deadline: '2026-02-05T17:00:00Z',
    created_at: '2026-01-16T10:00:00Z'
  },
  {
    task_id: 2,
    project_id: 1,
    assigned_to: 5,
    created_by: 2,
    task_name: 'Design Database Schema',
    description: 'Create the database schema for products, users, and orders',
    status: 'done',
    priority: 'high',
    start_date: '2026-02-01',
    deadline: '2026-02-10T17:00:00Z',
    created_at: '2026-01-16T11:00:00Z'
  },
  {
    task_id: 3,
    project_id: 1,
    assigned_to: 4,
    created_by: 2,
    task_name: 'Implement Authentication',
    description: 'Build user authentication with JWT tokens',
    status: 'in progress',
    priority: 'high',
    start_date: '2026-02-06',
    deadline: '2026-02-20T17:00:00Z',
    created_at: '2026-02-05T10:00:00Z'
  },
  {
    task_id: 4,
    project_id: 1,
    assigned_to: 5,
    created_by: 2,
    task_name: 'Create Product Catalog UI',
    description: 'Design and implement the product catalog interface',
    status: 'review',
    priority: 'medium',
    start_date: '2026-02-15',
    deadline: '2026-03-15T17:00:00Z',
    created_at: '2026-02-12T10:00:00Z'
  },
  {
    task_id: 5,
    project_id: 2,
    assigned_to: 6,
    created_by: 3,
    task_name: 'Mobile UI Wireframes',
    description: 'Create wireframes for all mobile screens',
    status: 'new',
    priority: 'high',
    start_date: '2026-03-01',
    deadline: '2026-03-15T17:00:00Z',
    created_at: '2026-02-25T10:00:00Z'
  }
];

export const mockTaskHistory: TaskHistory[] = [
  { history_id: 1, task_id: 1, changed_by: 4, old_status: 'new', new_status: 'in progress', changed_at: '2026-02-01T09:00:00Z' },
  { history_id: 2, task_id: 1, changed_by: 4, old_status: 'in progress', new_status: 'review', changed_at: '2026-02-04T16:00:00Z' },
  { history_id: 3, task_id: 1, changed_by: 2, old_status: 'review', new_status: 'done', changed_at: '2026-02-05T10:00:00Z' },
  { history_id: 4, task_id: 2, changed_by: 5, old_status: 'new', new_status: 'in progress', changed_at: '2026-02-02T09:00:00Z' },
  { history_id: 5, task_id: 2, changed_by: 5, old_status: 'in progress', new_status: 'done', changed_at: '2026-02-09T15:00:00Z' },
  { history_id: 6, task_id: 3, changed_by: 4, old_status: 'new', new_status: 'in progress', changed_at: '2026-02-06T09:00:00Z' },
  { history_id: 7, task_id: 4, changed_by: 5, old_status: 'new', new_status: 'in progress', changed_at: '2026-02-15T09:00:00Z' },
  { history_id: 8, task_id: 4, changed_by: 5, old_status: 'in progress', new_status: 'review', changed_at: '2026-03-10T16:00:00Z' },
];

export const mockProjectFiles: ProjectFile[] = [
  { file_id: 1, project_id: 1, task_id: 1, uploaded_by: 4, file_name: 'project-structure.zip', file_path: '/uploads/project-structure.zip', uploaded_at: '2026-02-04T16:00:00Z' },
  { file_id: 2, project_id: 1, task_id: 2, uploaded_by: 5, file_name: 'database-schema.sql', file_path: '/uploads/database-schema.sql', uploaded_at: '2026-02-09T15:00:00Z' },
  { file_id: 3, project_id: 1, task_id: 4, uploaded_by: 5, file_name: 'catalog-ui-mockup.fig', file_path: '/uploads/catalog-ui-mockup.fig', uploaded_at: '2026-03-10T16:00:00Z' },
];
