USE DatabaseProject;
GO

-- Sample test data for the Flowza database
-- Note: Make sure the database schema is created first before running this

-- Enable IDENTITY INSERT for tables with auto-increment columns
SET IDENTITY_INSERT users ON;
GO

INSERT INTO users (user_id, name, email, password, role, created_at, updated_at)
VALUES
  (1, 'Admin User', 'admin@flowza.com', 'admin123', 'admin', '2026-01-01 10:00:00', '2026-01-01 10:00:00'),
  (2, 'Helena Kace', 'team1@flowza.com', 'team123', 'teamleader', '2026-01-02 10:00:00', '2026-01-02 10:00:00'),
  (3, 'Erjeta Rrapaj', 'team2@flowza.com', 'team123', 'teamleader', '2026-01-03 10:00:00', '2026-01-03 10:00:00'),
  (4, 'Isnalda Sylaj', 'dev1@flowza.com', 'dev123', 'programmer', '2026-01-04 10:00:00', '2026-01-04 10:00:00'),
  (5, 'Jonalda Gjoka', 'dev2@flowza.com', 'dev123', 'programmer', '2026-01-05 10:00:00', '2026-01-05 10:00:00'),
  (6, 'Herta Guraj', 'dev3@flowza.com', 'dev123', 'programmer', '2026-01-06 10:00:00', '2026-01-06 10:00:00');
GO

SET IDENTITY_INSERT users OFF;
GO

SET IDENTITY_INSERT project ON;
GO

INSERT INTO project (project_id, name, description, status, priority, start_date, deadline, created_by, created_at, updated_at)
VALUES
  (1, 'E-Commerce Platform', 'Build a new e-commerce platform with React and PHP backend integration.', 'in progress', 'high', '2026-02-01', '2026-06-30', 1, '2026-01-15 10:00:00', '2026-01-15 10:00:00'),
  (2, 'Mobile App Development', 'Create a mobile application for iOS and Android users.', 'in progress', 'medium', '2026-03-01', '2026-08-31', 1, '2026-02-20 10:00:00', '2026-02-20 10:00:00'),
  (3, 'Data Analytics Dashboard', 'Develop an analytics dashboard for business intelligence.', 'new', 'low', '2026-05-01', '2026-10-31', 1, '2026-04-10 10:00:00', '2026-04-10 10:00:00');
GO

SET IDENTITY_INSERT project OFF;
GO

INSERT INTO project_members (project_id, user_id, role_in_project, assigned_at)
VALUES
  (1, 2, 'teamleader', '2026-01-15 11:00:00'),
  (1, 4, 'programmer', '2026-01-16 10:00:00'),
  (1, 5, 'programmer', '2026-01-16 10:00:00'),
  (2, 3, 'teamleader', '2026-02-20 11:00:00'),
  (2, 6, 'programmer', '2026-02-21 10:00:00');
GO

SET IDENTITY_INSERT task ON;
GO

INSERT INTO task (task_id, project_id, assigned_to, created_by, task_name, description, status, priority, start_date, deadline, created_at, updated_at)
VALUES
  (1, 1, 4, 2, 'Setup Project Structure', 'Initialize the project with React, TypeScript, and Tailwind.', 'done', 'high', '2026-02-01', '2026-02-05 17:00:00', '2026-01-16 10:00:00', '2026-01-16 10:00:00'),
  (2, 1, 5, 2, 'Design Database Schema', 'Create the database schema for products, users, and orders.', 'done', 'high', '2026-02-01', '2026-02-10 17:00:00', '2026-01-16 11:00:00', '2026-01-16 11:00:00'),
  (3, 1, 4, 2, 'Implement Authentication', 'Build user authentication with JWT tokens.', 'in progress', 'high', '2026-02-06', '2026-02-20 17:00:00', '2026-02-05 10:00:00', '2026-02-05 10:00:00'),
  (4, 1, 5, 2, 'Create Product Catalog UI', 'Design and implement the product catalog interface.', 'review', 'medium', '2026-02-15', '2026-03-15 17:00:00', '2026-02-12 10:00:00', '2026-02-12 10:00:00'),
  (5, 2, 6, 3, 'Mobile UI Wireframes', 'Create wireframes for all mobile screens.', 'new', 'high', '2026-03-01', '2026-03-15 17:00:00', '2026-02-25 10:00:00', '2026-02-25 10:00:00');
GO

SET IDENTITY_INSERT task OFF;
GO

SET IDENTITY_INSERT task_history ON;
GO

INSERT INTO task_history (history_id, task_id, changed_by, old_status, new_status, changed_at)
VALUES
  (1, 1, 4, 'new', 'in progress', '2026-02-01 09:00:00'),
  (2, 1, 4, 'in progress', 'review', '2026-02-04 16:00:00'),
  (3, 1, 2, 'review', 'done', '2026-02-05 10:00:00'),
  (4, 2, 5, 'new', 'in progress', '2026-02-02 09:00:00'),
  (5, 2, 5, 'in progress', 'done', '2026-02-09 15:00:00'),
  (6, 3, 4, 'new', 'in progress', '2026-02-06 09:00:00'),
  (7, 4, 5, 'new', 'in progress', '2026-02-15 09:00:00'),
  (8, 4, 5, 'in progress', 'review', '2026-03-10 16:00:00');
GO

SET IDENTITY_INSERT task_history OFF;
GO

SET IDENTITY_INSERT project_files ON;
GO

INSERT INTO project_files (file_id, project_id, uploaded_by, file_name, file_path, uploaded_at)
VALUES
  (1, 1, 4, 'project-structure.zip', '/uploads/project-structure.zip', '2026-02-04 16:00:00'),
  (2, 1, 5, 'database-schema.sql', '/uploads/database-schema.sql', '2026-02-09 15:00:00'),
  (3, 1, 5, 'catalog-ui-mockup.fig', '/uploads/catalog-ui-mockup.fig', '2026-03-10 16:00:00');
GO

SET IDENTITY_INSERT project_files OFF;
GO

SET IDENTITY_INSERT conversations ON;
GO

INSERT INTO conversations (conversation_id, project_id, created_at)
VALUES
  (1, 1, '2026-02-01 09:00:00'),
  (2, 2, '2026-03-01 09:00:00');
GO

SET IDENTITY_INSERT conversations OFF;
GO

SET IDENTITY_INSERT messages ON;
GO

INSERT INTO messages (message_id, conversation_id, sender_id, message, sent_at)
VALUES
  (1, 1, 2, 'Please review the project structure and confirm the next steps.', '2026-02-01 09:15:00'),
  (2, 1, 4, 'I have completed the initial setup and pushed the first draft.', '2026-02-01 10:00:00'),
  (3, 2, 3, 'The mobile wireframes are ready for review.', '2026-03-01 09:30:00');
GO

SET IDENTITY_INSERT messages OFF;
GO

SET IDENTITY_INSERT notifications ON;
GO

INSERT INTO notifications (notification_id, user_id, message, is_read, created_at)
VALUES
  (1, 2, 'You were assigned as team leader for the E-Commerce Platform project.', 0, '2026-01-15 11:00:00'),
  (2, 4, 'A new task has been assigned to you: Setup Project Structure.', 1, '2026-02-01 09:05:00'),
  (3, 6, 'A new task has been created: Mobile UI Wireframes.', 0, '2026-02-25 10:00:00');
GO

SET IDENTITY_INSERT notifications OFF;
GO

SET IDENTITY_INSERT user_activity ON;
GO

INSERT INTO user_activity (activity_id, user_id, action, created_at)
VALUES
  (1, 1, 'Created project E-Commerce Platform', '2026-01-15 10:00:00'),
  (2, 2, 'Assigned task Setup Project Structure to Isnalda Sylaj', '2026-01-16 10:00:00'),
  (3, 5, 'Uploaded file database-schema.sql for project E-Commerce Platform', '2026-02-09 15:00:00');
GO

SET IDENTITY_INSERT user_activity OFF;
GO
GO

INSERT INTO project_files (project_id, uploaded_by, file_name, file_path, uploaded_at)
VALUES
  (1, 4, 'project-structure.zip', '/uploads/project-structure.zip', '2026-02-04 16:00:00'),
  (1, 5, 'database-schema.sql', '/uploads/database-schema.sql', '2026-02-09 15:00:00'),
  (1, 5, 'catalog-ui-mockup.fig', '/uploads/catalog-ui-mockup.fig', '2026-03-10 16:00:00');
GO

INSERT INTO conversations (project_id, created_at)
VALUES
  (1, '2026-02-01 09:00:00'),
  (2, '2026-03-01 09:00:00');
GO

INSERT INTO messages (conversation_id, sender_id, message, sent_at)
VALUES
  (1, 2, 'Please review the project structure and confirm the next steps.', '2026-02-01 09:15:00'),
  (1, 4, 'I have completed the initial setup and pushed the first draft.', '2026-02-01 10:00:00'),
  (2, 3, 'The mobile wireframes are ready for review.', '2026-03-01 09:30:00');
GO

INSERT INTO notifications (user_id, message, is_read, created_at)
VALUES
  (2, 'You were assigned as team leader for the E-Commerce Platform project.', 0, '2026-01-15 11:00:00'),
  (4, 'A new task has been assigned to you: Setup Project Structure.', 1, '2026-02-01 09:05:00'),
  (6, 'A new task has been created: Mobile UI Wireframes.', 0, '2026-02-25 10:00:00');
GO

INSERT INTO user_activity (user_id, action, created_at)
VALUES
  (1, 'Created project E-Commerce Platform', '2026-01-15 10:00:00'),
  (2, 'Assigned task Setup Project Structure to Isnalda Sylaj', '2026-01-16 10:00:00'),
  (5, 'Uploaded file database-schema.sql for project E-Commerce Platform', '2026-02-09 15:00:00');
GO
