import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Stayora@2026');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.adminLogin(username, password);
      login(res.token, res.user);
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid staff credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stayora-navy flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-stayora-sand-light relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-stayora-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-stayora-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stayora-gold hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Return to Sanctuary Guest Website
        </Link>
        <div className="w-12 h-12 rounded-full border border-stayora-gold/50 flex items-center justify-center mx-auto bg-stayora-navy-light mb-3">
          <ShieldCheck className="w-6 h-6 text-stayora-gold" />
        </div>
        <h2 className="font-serif text-3xl font-semibold tracking-wider text-stayora-sand-light uppercase">
          STAYORA
        </h2>
        <p className="text-xs tracking-[0.2em] text-stayora-gold uppercase mt-1">
          Staff Administrative Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-stayora-navy-deep border border-stayora-gold/30 rounded-lg py-8 px-6 sm:px-10 shadow-2xl space-y-6">
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-stayora-navy-light border border-stayora-gold/30 rounded px-3.5 py-2.5 text-sm text-stayora-sand-light focus:outline-none focus:border-stayora-gold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-stayora-gold font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stayora-navy-light border border-stayora-gold/30 rounded px-3.5 py-2.5 text-sm text-stayora-sand-light focus:outline-none focus:border-stayora-gold"
                required
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3 px-4 rounded-sm text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{loading ? 'Authenticating...' : 'Enter Staff Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Credentials Helper Pill */}
          <div className="p-3.5 rounded bg-stayora-navy-light/60 border border-stayora-gold/20 text-xs text-stayora-sand/80 space-y-1">
            <span className="text-stayora-gold font-semibold block text-[11px] uppercase tracking-wider">
              Pre-Configured Demo Credentials:
            </span>
            <div className="font-mono text-[11px] text-stayora-sand-light">
              User: <span className="text-stayora-gold">admin</span> | Pass: <span className="text-stayora-gold">Stayora@2026</span>
            </div>
            <p className="text-[10px] text-stayora-sand/50 pt-1">
              Provides full access to manage room catalog, edit rates in INR, review booking inquiries, and customize hotel branding.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
