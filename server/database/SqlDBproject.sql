-- Active: 1768427252643@@127.0.0.1@3306
USE DatabaseProject;
GO

CREATE TABLE users(
  user_id INT PRIMARY KEY IDENTITY(1,1),
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','teamleader','programmer')),
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE project(
  project_id INT PRIMARY KEY IDENTITY(1,1),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','in progress','done')),
  priority VARCHAR(20) CHECK (priority IN ('low','medium','high')),
  start_date DATE,
  deadline DATE,
  created_by INT NOT NULL,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (created_by) REFERENCES users(user_id)
);
GO

CREATE TABLE project_members(
  project_id INT,
  user_id INT,
  role_in_project VARCHAR(20) NOT NULL CHECK (role_in_project IN ('teamleader','programmer')),
  assigned_at DATETIME DEFAULT GETDATE(),
  PRIMARY KEY(project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
GO

CREATE TABLE task(
  task_id INT PRIMARY KEY IDENTITY(1,1),
  project_id INT,
  assigned_to INT NOT NULL,
  created_by INT NOT NULL,
  task_name VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','in progress','review','done')),
  priority VARCHAR(20) CHECK (priority IN ('low','medium','high')),
  start_date DATE,
  deadline DATETIME,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(user_id),
  FOREIGN KEY (created_by) REFERENCES users(user_id)
);
GO

CREATE TABLE task_history(
  history_id INT PRIMARY KEY IDENTITY(1,1),
  task_id INT,
  changed_by INT,
  old_status VARCHAR(20) CHECK (old_status IN ('new','in progress','review','done')),
  new_status VARCHAR(20) CHECK (new_status IN ('new','in progress','review','done')),
  changed_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(user_id)
);
GO

CREATE TABLE project_files(
  file_id INT PRIMARY KEY IDENTITY(1,1),
  project_id INT,
  uploaded_by INT,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  uploaded_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);
GO

CREATE TABLE conversations(
  conversation_id INT PRIMARY KEY IDENTITY(1,1),
  project_id INT,
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE
);
GO

CREATE TABLE messages(
  message_id INT PRIMARY KEY IDENTITY(1,1),
  conversation_id INT,
  sender_id INT,
  message TEXT NOT NULL,
  sent_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(user_id)
);
GO

CREATE TABLE notifications(
  notification_id INT PRIMARY KEY IDENTITY(1,1),
  user_id INT,
  message VARCHAR(255) NOT NULL,
  is_read BIT DEFAULT 0,
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
GO

CREATE TABLE user_activity(
  activity_id INT PRIMARY KEY IDENTITY(1,1),
  user_id INT,
  action VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
GO

CREATE TRIGGER one_teamleader_per_project
ON project_members
INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN project_members pm ON pm.project_id = i.project_id
        WHERE i.role_in_project = 'teamleader'
          AND pm.role_in_project = 'teamleader'
    )
    BEGIN
        RAISERROR ('Ky projekt ka tashme nje Team Leader', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
    INSERT INTO project_members (project_id, user_id, role_in_project, assigned_at)
    SELECT project_id, user_id, role_in_project, assigned_at
    FROM inserted;
END;
GO