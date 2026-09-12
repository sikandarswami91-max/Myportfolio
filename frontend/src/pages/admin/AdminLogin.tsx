import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2, Sparkles, KeyRound, X, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';

// Reads an optional ?reset_token= query param (from a reset link opened directly)
const getInitialResetToken = (): string => {
  try {
    return new URLSearchParams(window.location.search).get('reset_token') || '';
  } catch {
    return '';
  }
};

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  /* ---------- Forgot Password state ---------- */
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetToken, setResetToken] = useState(getInitialResetToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetStage, setResetStage] = useState<'request' | 'reset'>(
    getInitialResetToken() ? 'reset' : 'request'
  );

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showToast('Please enter the admin email address', 'error');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password', { email: forgotEmail.trim() });
      showToast(res.data?.message || 'Reset request generated', 'success');
      if (res.data?.resetToken) {
        setResetToken(res.data.resetToken);
      }
      setResetStage('reset');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to process the reset request', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim() || !newPassword) {
      showToast('Please provide the reset token and a new password', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setResetLoading(true);
    try {
      const res = await api.post('/api/auth/reset-password', {
        token: resetToken.trim(),
        newPassword,
      });
      showToast(res.data?.message || 'Password reset successfully', 'success');
      setShowForgot(false);
      setResetStage('request');
      setResetToken('');
      setNewPassword('');
      setConfirmNewPassword('');
      setForgotEmail('');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to reset password', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  const closeForgot = () => {
    setShowForgot(false);
    setResetStage('request');
    setResetToken('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back, Admin!', 'success');
      navigate('/admin/dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 flex items-center justify-center p-4 selection:bg-violet-500/30 selection:text-violet-700 dark:selection:text-violet-300 relative overflow-hidden">
      {/* Decorative gradient mesh */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-violet-300/40 dark:bg-violet-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-sky-300/40 dark:bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-pink-300/30 dark:bg-pink-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading">Admin Portal</h1>
          <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1">Sign in to manage projects and portfolio assets</p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 shadow-2xl backdrop-blur-xl relative z-10">
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  // Mobile keyboards/autofill can mutate or replace the typed
                  // value in login (password) fields without these attributes,
                  // which makes bcrypt.compare fail with the same credentials
                  // that work on desktop. "current-password" (NOT "new-password")
                  // tells mobile browsers this is a sign-in field so they offer
                  // the saved password instead of generating a new one.
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="text"
                  enterKeyHint="go"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Forgot Password trigger */}
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="w-full mt-1 text-center text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline transition-colors"
            >
              Forgot Password?
            </button>
          </form>
        </div>
      </div>

      {/* ---------- Forgot Password Modal ---------- */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
            onClick={resetLoading || forgotLoading ? undefined : closeForgot}
          />

          <div className="relative w-full max-w-md bg-white/95 dark:bg-neutral-900/95 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl z-10">
            {!resetLoading && !forgotLoading && (
              <button
                onClick={closeForgot}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/25 mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white tracking-tight mb-1">
              Reset Admin Password
            </h3>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mb-6 leading-relaxed">
              {resetStage === 'request'
                ? 'Enter your admin email to generate a secure, single-use reset link. It is valid for 15 minutes.'
                : 'Paste the reset token from your secure reset link and choose a new password.'}
            </p>

            {resetStage === 'request' ? (
              <form onSubmit={handleForgotRequest} autoComplete="off" className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 uppercase tracking-wider mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your admin email"
                      autoComplete="off"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} autoComplete="off" className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 uppercase tracking-wider mb-2">
                    Reset Token
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="Paste your reset token"
                      autoComplete="off"
                      spellCheck={false}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1.5">
                    The token is printed in the server console with the secure reset link.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Reset Password</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setResetStage('request')}
                  disabled={resetLoading}
                  className="w-full text-center text-xs font-semibold text-slate-500 dark:text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400 hover:underline transition-colors disabled:opacity-50"
                >
                  ← Use a different email
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
