import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  LayoutDashboard, CheckSquare, Calendar, BarChart2, Users,
  Settings, HelpCircle, LogOut, Bell, Search, Plus, ArrowUpRight,
  Play, Pause, Square, ChevronRight, Clock, Target, TrendingUp,
  Zap, Download, Upload, Circle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Cell
} from 'recharts';
import './Dashboard.css';

const API = 'https://task-api-eight-flax.vercel.app';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('Dashboard');
  const [timerActive, setTimerActive] = useState(true);
  const [seconds, setSeconds] = useState(5048); // 01:24:08

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    const iv = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, [timerActive]);

  const fetchData = async () => {
    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const [ovRes, anRes, usRes, prRes] = await Promise.all([
        fetch(`${API}/api/overview`, { headers }),
        fetch(`${API}/api/analytics`, { headers }),
        fetch(`${API}/api/users`, { headers }),
        fetch(`${API}/api/products`, { headers }),
      ]);
      const [ov, an, us, pr] = await Promise.all([
        ovRes.json(), anRes.json(), usRes.json(), prRes.json()
      ]);
      setOverview(ov);
      setAnalytics(an);
      setUsers(Array.isArray(us) ? us : us.users || []);
      setProducts(Array.isArray(pr) ? pr : pr.products || []);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Build analytics chart data
  const chartData = analytics?.weekly || analytics?.data || [
    { day: 'S', value: 40 }, { day: 'M', value: 75 }, { day: 'T', value: 55 },
    { day: 'W', value: 90 }, { day: 'T', value: 62 }, { day: 'F', value: 48 }, { day: 'S', value: 30 },
  ];

  const normalizedChart = chartData.map((d, i) => ({
    day: d.day || ['S','M','T','W','T','F','S'][i] || i,
    value: d.value || d.count || d.total || Math.floor(Math.random() * 80 + 20),
  }));

  const overviewData = overview || {};
  const totalProjects = overviewData.totalProjects || overviewData.total_projects || 24;
  const endedProjects = overviewData.endedProjects || overviewData.ended_projects || 10;
  const runningProjects = overviewData.runningProjects || overviewData.running_projects || 12;
  const pendingProjects = overviewData.pendingProjects || overviewData.pending_projects || 2;

  const teamMembers = users.slice(0, 4);
  const projectList = products.slice(0, 5);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: CheckSquare, label: 'Tasks', badge: '24' },
    { icon: Calendar, label: 'Calendar' },
    { icon: BarChart2, label: 'Analytics' },
    { icon: Users, label: 'Team' },
  ];

  const generalItems = [
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help' },
    { icon: LogOut, label: 'Logout', action: handleLogout },
  ];

  const statusColors = {
    'Completed': '#52b788',
    'In Progress': '#3b82f6',
    'Pending': '#f59e0b',
    completed: '#52b788',
    'in-progress': '#3b82f6',
    pending: '#f59e0b',
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <CheckSquare size={32} color="#2d6a4f" />
          <span>Donazo</span>
        </div>
        <div className="loading-bar">
          <div className="loading-bar-fill" />
        </div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <CheckSquare size={22} color="#fff" />
          </div>
          <span className="logo-text">Donazo</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">MENU</div>
          {navItems.map(({ icon: Icon, label, badge }) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? 'active' : ''}`}
              onClick={() => setActivePage(label)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {badge && <span className="nav-badge">{badge}</span>}
            </button>
          ))}
        </nav>

        <nav className="sidebar-nav sidebar-general">
          <div className="nav-section-label">GENERAL</div>
          {generalItems.map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              className="nav-item"
              onClick={action}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-app-card">
          <Download size={20} color="#fff" />
          <div>
            <p className="app-card-title">Download our Mobile App</p>
            <p className="app-card-sub">Get all in one single app</p>
          </div>
          <button className="app-download-btn">Download</button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="search-bar">
            <Search size={16} color="var(--gray-400)" />
            <input type="text" placeholder="Search task" />
            <span className="search-kbd">⌘ F</span>
          </div>
          <div className="topbar-right">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notif-dot" />
            </button>
            <div className="user-avatar-wrap">
              <div className="user-avatar">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name || user?.email?.split('@')[0] || 'User'}</span>
                <span className="user-email">{user?.email || ''}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="content-area">
          {/* Page Header */}
          <div className="page-header fade-in">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-sub">Plan, prioritize, and accomplish your tasks with ease.</p>
            </div>
            <div className="page-actions">
              <button className="btn-primary">
                <Plus size={16} />
                Add Project
              </button>
              <button className="btn-outline">
                <Upload size={16} />
                Import Data
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            {[
              { label: 'Total Projects', value: totalProjects, color: 'green', trend: 'Increased from last month' },
              { label: 'Ended Projects', value: endedProjects, color: 'light', trend: 'Increased from last month' },
              { label: 'Running Projects', value: runningProjects, color: 'light', trend: 'Increased from last month' },
              { label: 'Pending Project', value: pendingProjects, color: 'light', sub: 'On Discuss' },
            ].map(({ label, value, color, trend, sub }, i) => (
              <div key={label} className={`stat-card stat-${color} fade-in fade-in-delay-${i + 1}`}>
                <div className="stat-card-top">
                  <span className="stat-card-label">{label}</span>
                  <button className="stat-arrow-btn">
                    <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="stat-card-value">{value}</div>
                {trend && (
                  <div className="stat-card-trend">
                    <TrendingUp size={12} />
                    <span>{trend}</span>
                  </div>
                )}
                {sub && <div className="stat-card-sub">{sub}</div>}
              </div>
            ))}
          </div>

          {/* Middle Row */}
          <div className="middle-row">
            {/* Analytics Chart */}
            <div className="card analytics-card fade-in">
              <div className="card-header">
                <h3>Project Analytics</h3>
                <button className="card-more">View all</button>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={normalizedChart} barSize={22} barCategoryGap="30%">
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#94a3b8' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: 'rgba(45,106,79,0.05)' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {normalizedChart.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={index === 3 || entry.value === Math.max(...normalizedChart.map(d => d.value))
                          ? '#2d6a4f'
                          : '#d8f3dc'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Reminders */}
            <div className="card reminders-card fade-in fade-in-delay-1">
              <div className="card-header">
                <h3>Reminders</h3>
              </div>
              <div className="reminder-item">
                <div className="reminder-icon">
                  <Target size={20} color="#2d6a4f" />
                </div>
                <div className="reminder-content">
                  <p className="reminder-title">Meeting with Arc Company</p>
                  <p className="reminder-time">
                    <Clock size={12} />
                    Time : 02:00 pm - 04:00 pm
                  </p>
                </div>
              </div>
              <button className="start-meeting-btn">
                <Play size={16} fill="#fff" />
                Start Meeting
              </button>
            </div>

            {/* Project List */}
            <div className="card project-list-card fade-in fade-in-delay-2">
              <div className="card-header">
                <h3>Project</h3>
                <button className="btn-new">
                  <Plus size={14} />
                  New
                </button>
              </div>
              <div className="project-list">
                {(projectList.length > 0 ? projectList : [
                  { name: 'Develop API Endpoints', deadline: 'Nov 26, 2024', color: '#3b82f6' },
                  { name: 'Onboarding Flow', deadline: 'Nov 29, 2024', color: '#8b5cf6' },
                  { name: 'Build Dashboard', deadline: 'Dec 6, 2024', color: '#2d6a4f' },
                  { name: 'Optimize Page Load', deadline: 'Dec 10, 2024', color: '#f59e0b' },
                  { name: 'Cross-Browser Testing', deadline: 'Dec 5, 2024', color: '#ef4444' },
                ]).map((p, i) => (
                  <div key={i} className="project-row">
                    <div className="project-dot" style={{ background: p.color || p.status_color || '#2d6a4f' }} />
                    <div className="project-info">
                      <span className="project-name">{p.name || p.title}</span>
                      <span className="project-deadline">Deadline {p.deadline || p.due_date || 'TBD'}</span>
                    </div>
                    <ChevronRight size={14} color="var(--gray-400)" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bottom-row">
            {/* Team Collaboration */}
            <div className="card team-card fade-in">
              <div className="card-header">
                <h3>Team Collaboration</h3>
                <button className="btn-new">
                  <Plus size={14} />
                  Add Member
                </button>
              </div>
              <div className="team-list">
                {(teamMembers.length > 0 ? teamMembers : [
                  { name: 'Alexandra Deff', task: 'Working on Github Project Repository', status: 'Completed' },
                  { name: 'Edwin Adenike', task: 'Working on Integrate User Authentication System', status: 'In Progress' },
                  { name: 'Isaac Oluwatomilorun', task: 'Working on Develop Search and Filter Functionality', status: 'Pending' },
                  { name: 'David Oshodi', task: 'Working on Responsive Layout for Homepage', status: 'In Progress' },
                ]).map((member, i) => {
                  const name = member.name || member.username || `User ${i + 1}`;
                  const task = member.task || member.current_task || 'Working on project';
                  const status = member.status || 'In Progress';
                  return (
                    <div key={i} className="team-row">
                      <div className="team-avatar" style={{ background: ['#d8f3dc','#dbeafe','#fef9c3','#fce7f3'][i % 4] }}>
                        <span style={{ color: ['#2d6a4f','#1d4ed8','#92400e','#be185d'][i % 4] }}>
                          {name[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="team-info">
                        <span className="team-name">{name}</span>
                        <span className="team-task">{task}</span>
                      </div>
                      <span
                        className="status-badge"
                        style={{
                          background: statusColors[status] + '20' || '#e2e8f020',
                          color: statusColors[status] || '#64748b'
                        }}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Project Progress */}
            <div className="card progress-card fade-in fade-in-delay-1">
              <div className="card-header">
                <h3>Project Progress</h3>
              </div>
              <div className="progress-chart-wrap">
                <ResponsiveContainer width="100%" height={180}>
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="55%" outerRadius="80%"
                    data={[{ value: 41 }]}
                    startAngle={230} endAngle={-50}
                  >
                    <RadialBar background={{ fill: '#f1f5f9' }} dataKey="value" fill="#2d6a4f" cornerRadius={8} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="progress-center">
                  <span className="progress-pct">41%</span>
                  <span className="progress-label">Project Ended</span>
                </div>
              </div>
              <div className="progress-legend">
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#2d6a4f' }} />
                  <span>Completed</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#3b82f6' }} />
                  <span>In Progress</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#e2e8f0' }} />
                  <span>Pending</span>
                </div>
              </div>
            </div>

            {/* Time Tracker */}
            <div className="card timer-card fade-in fade-in-delay-2">
              <div className="timer-bg" />
              <div className="timer-content">
                <div className="card-header" style={{ position: 'relative', zIndex: 2 }}>
                  <h3 style={{ color: '#fff' }}>Time Tracker</h3>
                </div>
                <div className="timer-display">{formatTime(seconds)}</div>
                <div className="timer-controls">
                  <button
                    className="timer-btn"
                    onClick={() => setTimerActive(a => !a)}
                  >
                    {timerActive
                      ? <Pause size={18} fill="#fff" />
                      : <Play size={18} fill="#fff" />
                    }
                  </button>
                  <button
                    className="timer-btn timer-stop"
                    onClick={() => { setTimerActive(false); setSeconds(0); }}
                  >
                    <Square size={16} fill="#ef4444" color="#ef4444" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
