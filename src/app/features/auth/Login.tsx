//Helena worked in this page
import { useState } from 'react';

interface LoginProps {
  onLogin: (userId: number, role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const demoUsers = [
    { id: 1, email: 'admin@flowza.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { id: 2, email: 'team1@flowza.com', password: 'team123', role: 'teamleader', name: 'John Leader' },
    { id: 3, email: 'team2@flowza.com', password: 'team123', role: 'teamleader', name: 'Sarah Leader' },
    { id: 4, email: 'dev1@flowza.com', password: 'dev123', role: 'programmer', name: 'Mike Developer' },
    { id: 5, email: 'dev2@flowza.com', password: 'dev123', role: 'programmer', name: 'Anna Developer' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = demoUsers.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user.id, user.role);
    } else {
      alert('Invalid credentials. Try demo accounts below.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #e0e7ff 100%)' }}>
      <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-sm border border-blue-100 p-8">

        <div className="mb-7 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Project Management</h2>
          <p className="mt-1 text-sm text-gray-400">Sign in to your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@flowza.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-blue-400 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-blue-400 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors mt-2"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 bg-gray-50 border border-gray-100 rounded-lg p-4 text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-600 mb-2">Demo Accounts</p>
          <p><span className="font-medium text-gray-700">Admin:</span> admin@flowza.com / admin123</p>
          <p><span className="font-medium text-gray-700">Team Leader:</span> team1@flowza.com / team123</p>
          <p><span className="font-medium text-gray-700">Programmer:</span> dev1@flowza.com / dev123</p>
        </div>

      </div>
    </div>
  );
}