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

