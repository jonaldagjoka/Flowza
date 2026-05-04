import { useState } from 'react';
import { User, Task, TaskHistory, ProjectFile, mockUsers } from '../../utils/mockData';
import { LogOut, Upload, FileText, Clock, CheckCircle, AlertCircle, History } from 'lucide-react';

interface ProgrammerDashboardProps {
  currentUser: User;
  tasks: Task[];
  taskHistory: TaskHistory[];
  projectFiles: ProjectFile[];
  onUpdateTaskStatus: (taskId: number, status: 'new' | 'in progress' | 'review' | 'done') => void;
  onUploadFile: (taskId: number, fileName: string) => void;
  onLogout: () => void;
}

export function ProgrammerDashboard({
  currentUser,
  tasks,
  taskHistory,
  projectFiles,
  onUpdateTaskStatus,
  onUploadFile,
  onLogout
}: ProgrammerDashboardProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const myTasks = tasks.filter(t => t.assigned_to === currentUser.user_id);

  const getTaskHistory = (taskId: number) =>
    taskHistory.filter(h => h.task_id === taskId).sort((a, b) =>
      new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
    );

  const getTaskFiles = (taskId: number) => projectFiles.filter(f => f.task_id === taskId);

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTaskId && uploadFileName) {
      onUploadFile(selectedTaskId, uploadFileName);
      setUploadFileName('');
      setShowUploadModal(false);
      setSelectedTaskId(null);
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

  const tasksByStatus = {
    new: myTasks.filter(t => t.status === 'new'),
    'in progress': myTasks.filter(t => t.status === 'in progress'),
    review: myTasks.filter(t => t.status === 'review'),
    done: myTasks.filter(t => t.status === 'done'),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl">Programmer Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {currentUser.name}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-3xl mt-1">{myTasks.length}</p>
              </div>
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Tasks</p>
                <p className="text-3xl mt-1">{tasksByStatus.new.length}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl mt-1">{tasksByStatus['in progress'].length}</p>
              </div>
              <Clock className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Review</p>
                <p className="text-3xl mt-1">{tasksByStatus.review.length}</p>
              </div>
              <FileText className="w-10 h-10 text-purple-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl mt-1">{tasksByStatus.done.length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
        </div>

        <h2 className="text-xl mb-6">My Tasks</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="bg-gray-100 rounded-xl p-4">
              <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-3 flex items-center justify-between">
                <span className="font-semibold">{status}</span>
                <span className="bg-white text-gray-500 rounded-full px-2 py-0.5 text-xs">{statusTasks.length}</span>
              </h3>
              <div className="space-y-3">
                {statusTasks.length === 0 ? (
                  <div className="bg-white p-6 rounded-lg border border-dashed border-gray-300 text-center text-gray-400 text-sm">No tasks</div>
                ) : (
                  statusTasks.map(task => {
                    const creator = mockUsers.find(u => u.user_id === task.created_by);
                    const taskFiles = getTaskFiles(task.task_id);
                    return (
                      <div key={task.task_id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-sm mb-1">{task.task_name}</h4>
                            <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                            <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-3 space-y-1">
                          <div><span className="font-medium">Created by:</span> {creator?.name}</div>
                          <div><span className="font-medium">Deadline:</span> {new Date(task.deadline).toLocaleString()}</div>
                          {taskFiles.length > 0 && (
                            <div><span className="font-medium">Files:</span> {taskFiles.length} uploaded</div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTaskStatus(task.task_id, e.target.value as any)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                          >
                            <option value="new">New</option>
                            <option value="in progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                          </select>
                          <button
                            onClick={() => { setSelectedTaskId(task.task_id); setShowUploadModal(true); }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            Upload
                          </button>
                          <button
                            onClick={() => { setSelectedTaskId(task.task_id); setShowHistoryModal(true); }}
                            className="px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center gap-1"
                          >
                            <History className="w-3 h-3" />
                            History
                          </button>
                        </div>
                        {taskFiles.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-gray-600 mb-2">Uploaded Files:</p>
                            <div className="space-y-1">
                              {taskFiles.map(file => (
                                <div key={file.file_id} className="flex items-center gap-2 text-xs text-gray-700">
                                  <FileText className="w-3 h-3" />
                                  {file.file_name}
                                  <span className="text-gray-500">({new Date(file.uploaded_at).toLocaleDateString()})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {showUploadModal && selectedTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl mb-4">Upload File</h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., authentication-module.zip"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">This is a demo — enter a filename to simulate upload</p>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowUploadModal(false); setSelectedTaskId(null); setUploadFileName(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistoryModal && selectedTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl mb-4">Task History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getTaskHistory(selectedTaskId).length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No history available</p>
              ) : (
                getTaskHistory(selectedTaskId).map(history => {
                  const changedBy = mockUsers.find(u => u.user_id === history.changed_by);
                  return (
                    <div key={history.history_id} className="border-l-2 border-blue-500 pl-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(history.old_status)}`}>
                          {history.old_status}
                        </span>
                        <span className="text-xs text-gray-500">→</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(history.new_status)}`}>
                          {history.new_status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        by {changedBy?.name} on {new Date(history.changed_at).toLocaleString()}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => { setShowHistoryModal(false); setSelectedTaskId(null); }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
