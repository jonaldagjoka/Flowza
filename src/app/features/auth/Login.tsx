import { useState, type FormEvent } from 'react';
import { loginUser, type AuthUser } from './api';

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

const sampleAccounts = [
  { id: 1, email: 'admin@flowza.com', password: 'admin123', role: 'admin', name: 'Admin User', initials: 'AU' },
  { id: 2, email: 'team1@flowza.com', password: 'team123', role: 'teamleader', name: 'Helena Kace', initials: 'HK' },
  { id: 3, email: 'team2@flowza.com', password: 'team123', role: 'teamleader', name: 'Erjeta Rrapaj', initials: 'ER' },
  { id: 4, email: 'dev1@flowza.com', password: 'dev123', role: 'programmer', name: 'Isnalda Sylaj', initials: 'IS' },
  { id: 5, email: 'dev2@flowza.com', password: 'dev123', role: 'programmer', name: 'Jonalda Gjoka', initials: 'JG' },
];

const roleStyle: Record<string, { badge: string; avatar: string; label: string }> = {
  admin:       { badge: 'bg-indigo-50 text-indigo-700', avatar: 'bg-indigo-50 text-indigo-700', label: 'Admin' },
  teamleader:  { badge: 'bg-green-50 text-green-700',   avatar: 'bg-green-50 text-green-700',   label: 'Team leader' },
  programmer:  { badge: 'bg-orange-50 text-orange-700', avatar: 'bg-orange-50 text-orange-700', label: 'Programmer' },
};

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(false);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setErrorText('');

    try {
      const user = await loginUser(email, password);
      onLogin(user);
    } catch (err) {
      setError(true);
      setErrorText(err instanceof Error ? err.message : 'Invalid email or password.');
      setTimeout(() => setError(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  const fill = (u: typeof sampleAccounts[0]) => {
    setEmail(u.email);
    setPassword(u.password);
    setError(false);
    setErrorText('');
  };

  const inputCls = `w-full h-10 px-3 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors ${
    error ? 'border-red-400' : 'border-gray-200 focus:border-blue-400'
  }`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #e0f2fe 100%)' }}>
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">

          {/* Logo — now inside the card */}
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight text-gray-900">Flowza</div>
              <div className="text-xs text-gray-400">Project Management</div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-0.5">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-6">Sign in to continue to your workspace</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && errorText ? (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {errorText}
              </div>
            ) : null}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
              <input id="email" type="email" required placeholder="you@flowza.com"
                className={inputCls} value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <input id="password" type="password" required placeholder="••••••••"
                className={inputCls} value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit"
              disabled={loading}
              className="w-full h-10 bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white text-sm font-medium rounded-lg transition-all mt-1 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="my-6 border-t border-gray-100" />

          {/* Demo accounts */}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Quick sign-in — sample accounts</p>
          <div className="space-y-2">
            {sampleAccounts.filter((_, i) => [0, 1, 3].includes(i)).map(u => {
              const s = roleStyle[u.role];
              return (
                <button key={u.id} type="button" onClick={() => fill(u)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 rounded-lg transition-all text-left">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${s.avatar}`}>
                      {u.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{u.name}</div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
