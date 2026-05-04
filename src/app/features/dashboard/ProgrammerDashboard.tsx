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

  const tasksByStatus = {
    new: myTasks.filter(t => t.status === 'new'),
    'in progress': myTasks.filter(t => t.status === 'in progress'),
    review: myTasks.filter(t => t.status === 'review'),
    done: myTasks.filter(t => t.status === 'done'),
  };

  const stats = [
    { label: 'Total Tasks', value: myTasks.length,                       icon: <FileText    className="w-8 h-8 text-gray-400"   /> },
    { label: 'New Tasks',   value: tasksByStatus.new.length,             icon: <AlertCircle className="w-8 h-8 text-yellow-400" /> },
    { label: 'In Progress', value: tasksByStatus['in progress'].length,  icon: <Clock       className="w-8 h-8 text-blue-400"   /> },
    { label: 'In Review',   value: tasksByStatus.review.length,          icon: <FileText    className="w-8 h-8 text-purple-400" /> },
    { label: 'Completed',   value: tasksByStatus.done.length,            icon: <CheckCircle className="w-8 h-8 text-green-400"  /> },
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
              <h1 className="text-base font-semibold text-gray-900 leading-tight">Programmer Dashboard</h1>
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

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">My Tasks</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="bg-white/50 backdrop-blur border border-blue-100 rounded-xl p-4">
              <h3 className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-3 flex items-center justify-between">
                <span>{status}</span>
                <span className="bg-white border border-blue-100 text-gray-500 rounded-full px-2 py-0.5 text-xs">{statusTasks.length}</span>
              </h3>
              <div className="space-y-3">
                {statusTasks.length === 0 ? (
                  <div className="bg-white/60 p-6 rounded-lg border border-dashed border-blue-100 text-center text-gray-400 text-sm">No tasks</div>
                ) : (
                  statusTasks.map(task => {
                    const creator = mockUsers.find(u => u.user_id === task.created_by);
                    const taskFiles = getTaskFiles(task.task_id);
                    return (
                      <div key={task.task_id} className="bg-white border border-gray-100 hover:border-blue-200 p-4 rounded-lg shadow-sm transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800 mb-0.5">{task.task_name}</h4>
                            <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mb-3 space-y-1">
                          <div><span className="font-medium text-gray-500">Created by:</span> {creator?.name}</div>
                          <div><span className="font-medium text-gray-500">Deadline:</span> {new Date(task.deadline).toLocaleString()}</div>
                          {taskFiles.length > 0 && (
                            <div><span className="font-medium text-gray-500">Files:</span> {taskFiles.length} uploaded</div>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTaskStatus(task.task_id, e.target.value as any)}
                            className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
                          >
                            <option value="new">New</option>
                            <option value="in progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                          </select>
                          <button
                            onClick={() => { setSelectedTaskId(task.task_id); setShowUploadModal(true); }}
                            className="px-2.5 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800 flex items-center gap-1 transition-colors"
                          >
                            <Upload className="w-3 h-3" />
                            Upload
                          </button>
                          <button
                            onClick={() => { setSelectedTaskId(task.task_id); setShowHistoryModal(true); }}
                            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-blue-50 flex items-center gap-1 transition-colors"
                          >
                            <History className="w-3 h-3" />
                            History
                          </button>
                        </div>
                        {taskFiles.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-50">
                            <p className="text-xs text-gray-400 mb-1.5">Uploaded Files:</p>
                            <div className="space-y-1">
                              {taskFiles.map(file => (
                                <div key={file.file_id} className="flex items-center gap-2 text-xs text-gray-600">
                                  <FileText className="w-3 h-3 text-blue-300" />
                                  {file.file_name}
                                  <span className="text-gray-400">({new Date(file.uploaded_at).toLocaleDateString()})</span>
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-blue-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Upload File</h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., authentication-module.zip"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">This is a demo — enter a filename to simulate upload</p>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowUploadModal(false); setSelectedTaskId(null); setUploadFileName(''); }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistoryModal && selectedTaskId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-blue-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Task History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getTaskHistory(selectedTaskId).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No history available</p>
              ) : (
                getTaskHistory(selectedTaskId).map(history => {
                  const changedBy = mockUsers.find(u => u.user_id === history.changed_by);
                  return (
                    <div key={history.history_id} className="border-l-2 border-blue-300 pl-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(history.old_status)}`}>
                          {history.old_status}
                        </span>
                        <span className="text-xs text-gray-400">→</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(history.new_status)}`}>
                          {history.new_status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
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
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
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
