import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Shield, Mail, Lock, User as UserIcon, X, Check, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState<string>('operator@astra.space');
  const [password, setPassword] = useState<string>('••••••••');
  const [username, setUsername] = useState<string>('');
  const [role, setRole] = useState<UserRole>('Operator');
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (mode === 'forgot') {
      setMessage('Password reset code transmitted to registered orbital communications terminal.');
      return;
    }

    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, role }),
      });
      const data = await res.json();

      if (data.success) {
        onLoginSuccess(data.user);
        setMessage(`Authenticated as ${data.user.role}: ${data.user.username}`);
        setTimeout(() => onClose(), 1200);
      } else {
        setMessage(data.error || 'Authentication clearance denied.');
      }
    } catch (err) {
      // Fallback mock login
      const fallbackUser: User = {
        id: `U-${Date.now().toString().slice(-4)}`,
        username: username || email.split('@')[0],
        email,
        role,
      };
      onLoginSuccess(fallbackUser);
      setMessage(`Authenticated in offline mode as ${role}`);
      setTimeout(() => onClose(), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-slate-100 font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">ASTRA OS SECURITY CLEARANCE</h2>
            <p className="text-xs font-mono text-cyan-400">
              ROLE-BASED MISSION ACCESS CONTROL
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition ${
              mode === 'login' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition ${
              mode === 'signup' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            REGISTER
          </button>
          <button
            type="button"
            onClick={() => setMode('forgot')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition ${
              mode === 'forgot' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            FORGOT
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">
                OPERATOR CALLSIGN
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., Commander_Kaze"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">
              MISSION TERMINAL EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@astra.space"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">
                SECURITY PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">
                SELECT OPERATIONAL ROLE CLEARANCE
              </label>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {(['Admin', 'Operator', 'Analyst'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-2 rounded-lg border text-center transition ${
                      role === r
                        ? 'bg-purple-950/80 border-purple-500/80 text-purple-300 font-bold shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {message && (
            <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold tracking-wider uppercase transition shadow-lg shadow-cyan-500/25 mt-2"
          >
            {mode === 'login' ? 'VERIFY SECURITY CLEARANCE' : mode === 'signup' ? 'CREATE OPERATOR PROFILE' : 'TRANSMIT RESET CODE'}
          </button>
        </form>

        {/* Quick Demo Pre-sets */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-400">
          <p className="uppercase mb-2 font-bold text-slate-300">QUICK ROLE PRESETS:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@astra.space');
                setRole('Admin');
              }}
              className="px-2 py-1 bg-slate-950 border border-slate-800 rounded hover:border-cyan-500/50 text-slate-300"
            >
              Commander (Admin)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('operator@astra.space');
                setRole('Operator');
              }}
              className="px-2 py-1 bg-slate-950 border border-slate-800 rounded hover:border-cyan-500/50 text-slate-300"
            >
              Orbital Operator
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('analyst@astra.space');
                setRole('Analyst');
              }}
              className="px-2 py-1 bg-slate-950 border border-slate-800 rounded hover:border-cyan-500/50 text-slate-300"
            >
              Mission Analyst
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
