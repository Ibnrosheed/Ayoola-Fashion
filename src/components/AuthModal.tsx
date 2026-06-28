import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
  const { login, register, updatePassword } = useApp();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot' | 'verify-reset'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [demoCodeHint, setDemoCodeHint] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (tab === 'login') {
      const res = login(email, password);
      if (res.success) {
        setSuccess('Successfully logged in!');
        setTimeout(() => {
          onClose();
          // Reset states
          setEmail('');
          setPassword('');
        }, 1200);
      } else {
        setError(res.error || 'Failed to login');
      }
    } else if (tab === 'register') {
      if (!name.trim()) {
        setError('Name is required');
        return;
      }
      const res = register(name, email, password);
      if (res.success) {
        setSuccess('Account registered successfully!');
        setTimeout(() => {
          onClose();
          // Reset states
          setEmail('');
          setPassword('');
          setName('');
        }, 1200);
      } else {
        setError(res.error || 'Failed to register');
      }
    } else if (tab === 'forgot') {
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }
      setIsSending(true);
      fetch('/api/send-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      })
        .then((res) => res.json())
        .then((data) => {
          setIsSending(false);
          if (data.error) {
            setError(data.error + (data.details ? ` (${data.details})` : ''));
          } else {
            setSuccess(data.message || 'Verification code sent!');
            if (data.demoMode && data.code) {
              setDemoCodeHint(data.code);
            }
            setTimeout(() => {
              setTab('verify-reset');
              setSuccess('');
            }, 1500);
          }
        })
        .catch((err) => {
          setIsSending(false);
          setError('Failed to contact reset service. Please try again.');
          console.error(err);
        });
    } else if (tab === 'verify-reset') {
      if (!resetCode.trim()) {
        setError('Please enter the verification code.');
        return;
      }
      if (!newPassword.trim() || newPassword.length < 4) {
        setError('Password must be at least 4 characters long.');
        return;
      }
      setIsSending(true);
      fetch('/api/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: resetCode.trim() })
      })
        .then((res) => res.json())
        .then((data) => {
          setIsSending(false);
          if (data.error) {
            setError(data.error);
          } else {
            const updateRes = updatePassword(email, newPassword);
            if (updateRes.success) {
              setSuccess('Password updated successfully! Redirecting to login...');
              setDemoCodeHint('');
              setTimeout(() => {
                setTab('login');
                setResetCode('');
                setNewPassword('');
                setSuccess('');
              }, 2000);
            } else {
              setError(updateRes.error || 'Failed to update password.');
            }
          }
        })
        .catch((err) => {
          setIsSending(false);
          setError('Verification request failed. Please try again.');
          console.error(err);
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} id="auth-modal-overlay" />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl z-10"
        id="auth-modal-container"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          id="auth-modal-close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900">
              Ayoola
            </h2>
            <p className="text-xs tracking-[0.2em] uppercase font-display text-gold-600 font-medium">
              Fashion & Essentials
            </p>
          </div>

          {/* Form Header */}
          {(tab === 'login' || tab === 'register') && (
            <div className="flex border-b border-gray-100 mb-6">
              <button
                onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                className={`flex-1 pb-3 text-center text-sm font-medium transition-all cursor-pointer ${
                  tab === 'login'
                    ? 'border-b-2 border-gold-500 text-gold-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                id="auth-tab-login"
              >
                Sign In
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); setSuccess(''); }}
                className={`flex-1 pb-3 text-center text-sm font-medium transition-all cursor-pointer ${
                  tab === 'register'
                    ? 'border-b-2 border-gold-500 text-gold-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                id="auth-tab-register"
              >
                Register
              </button>
            </div>
          )}

          {tab === 'forgot' && (
            <div className="text-center mb-6">
              <h3 className="font-serif text-lg font-bold text-gray-800">Password Recovery</h3>
              <p className="text-xs text-gray-500 mt-1">We will send you a verification code to recover your account.</p>
            </div>
          )}

          {tab === 'verify-reset' && (
            <div className="text-center mb-6">
              <h3 className="font-serif text-lg font-bold text-gray-800">Verify Code & Reset</h3>
              <p className="text-xs text-gray-500 mt-1">Please enter the code sent to your email and set your new password.</p>
            </div>
          )}

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 text-red-700 text-xs font-medium" id="auth-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium" id="auth-success">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-500 transition-all text-gray-800"
                    id="auth-input-name"
                  />
                </div>
              </div>
            )}

            {(tab === 'login' || tab === 'register' || tab === 'forgot') && (
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    disabled={tab === 'forgot' && isSending}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-500 transition-all text-gray-800 disabled:opacity-50"
                    id="auth-input-email"
                  />
                </div>
              </div>
            )}

            {tab === 'verify-reset' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="6-digit code"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-500 transition-all text-gray-800 font-mono tracking-[0.2em] text-center font-bold"
                    id="auth-input-reset-code"
                  />
                  {demoCodeHint && (
                    <div className="mt-2 text-[10px] text-gold-700 bg-gold-50/70 p-2.5 rounded-lg border border-gold-200 leading-normal">
                      💡 <strong>Demo Mode:</strong> Use code <strong>{demoCodeHint}</strong> above to reset immediately. <br/>
                      <span className="text-gray-400 font-light">To receive real emails, configure your SMTP secrets in Settings.</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-500 transition-all text-gray-800"
                    id="auth-input-new-password"
                  />
                </div>
              </div>
            )}

            {tab === 'login' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setError(''); setSuccess(''); }}
                    className="text-xs text-gold-600 hover:underline cursor-pointer"
                    id="auth-btn-forgot"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-500 transition-all text-gray-800"
                    id="auth-input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    id="auth-btn-toggle-password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-gray-900 hover:bg-gold-600 hover:text-white text-white rounded-xl text-sm font-semibold tracking-wider uppercase transition-all shadow-md cursor-pointer disabled:opacity-50"
              id="auth-submit-btn"
            >
              {isSending ? 'Please wait...' : tab === 'login' ? 'Sign In' : tab === 'register' ? 'Create Account' : tab === 'forgot' ? 'Send Reset Code' : 'Update Password'}
            </button>



            {(tab === 'forgot' || tab === 'verify-reset') && (
              <button
                type="button"
                onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-800 transition-colors mt-2 font-medium"
              >
                ← Back to Sign In
              </button>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
