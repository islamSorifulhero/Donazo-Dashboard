import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Eye, EyeOff, CheckSquare } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('user1@example.com');
  const [password, setPassword] = useState('password123');
  const [showPass, setShowPass] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <div className="brand-icon">
              <CheckSquare size={28} color="#fff" />
            </div>
            <span className="brand-name">Donazo</span>
          </div>
          <div className="login-hero">
            <h1>Manage your projects with ease</h1>
            <p>Plan, prioritize, and accomplish your tasks with the most intuitive project dashboard.</p>
          </div>
          <div className="login-stats">
            <div className="stat-item">
              <span className="stat-num">24</span>
              <span className="stat-label">Active Projects</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">98%</span>
              <span className="stat-label">On-time Delivery</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">120+</span>
              <span className="stat-label">Team Members</span>
            </div>
          </div>
          <div className="login-decoration">
            <div className="deco-circle deco-1" />
            <div className="deco-circle deco-2" />
            <div className="deco-circle deco-3" />
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-card fade-in">
          <div className="form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your Donazo account</p>
          </div>

          {error && (
            <div className="login-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="pass-wrapper">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass(p => !p)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-hint">
            <p>Demo credentials are pre-filled for you</p>
          </div>
        </div>
      </div>
    </div>
  );
}
