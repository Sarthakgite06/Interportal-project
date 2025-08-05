import React, { useState, useEffect } from 'react';
import { User, Trophy, Gift, Code, DollarSign, Users, Star, LogOut, Home, BarChart3 } from 'lucide-react';

// Mock Backend API
const mockAPI = {
  users: [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', referralCode: 'ALEX2025', donationsRaised: 15420, rank: 1 },
    { id: 2, name: 'Sarah Chen', email: 'sarah@example.com', referralCode: 'SARAH2025', donationsRaised: 12350, rank: 2 },
    { id: 3, name: 'Mike Rodriguez', email: 'mike@example.com', referralCode: 'MIKE2025', donationsRaised: 9800, rank: 3 },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', referralCode: 'EMMA2025', donationsRaised: 8750, rank: 4 },
    { id: 5, name: 'David Kim', email: 'david@example.com', referralCode: 'DAVID2025', donationsRaised: 7200, rank: 5 }
  ],
  
  rewards: [
    { id: 1, name: 'Bronze Badge', requirement: 1000, unlocked: true, icon: '🥉' },
    { id: 2, name: 'Silver Badge', requirement: 5000, unlocked: true, icon: '🥈' },
    { id: 3, name: 'Gold Badge', requirement: 10000, unlocked: true, icon: '🥇' },
    { id: 4, name: 'Platinum Badge', requirement: 20000, unlocked: false, icon: '💎' },
    { id: 5, name: 'Diamond Badge', requirement: 50000, unlocked: false, icon: '💍' }
  ],

  login: (email, password) => {
    // Mock login - just find user by email
    const user = mockAPI.users.find(u => u.email === email);
    if (user) {
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials' };
  },

  register: (name, email, password) => {
    // Mock registration
    const newUser = {
      id: mockAPI.users.length + 1,
      name,
      email,
      referralCode: `${name.toUpperCase().replace(' ', '')}2025`,
      donationsRaised: 0,
      rank: mockAPI.users.length + 1
    };
    mockAPI.users.push(newUser);
    return { success: true, user: newUser };
  }
};

// Login/Signup Component
const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = mockAPI.login(formData.email, formData.password);
      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.message);
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      const result = mockAPI.register(formData.name, formData.email, formData.password);
      if (result.success) {
        onLogin(result.user);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          <div className="auth-avatar">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="auth-title">
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h2>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to your intern portal' : 'Create your intern account'}
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ name: '', email: '', password: '' });
            }}
            className="btn-secondary"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {isLogin && (
          <div className="demo-note">
            <p>
              Demo: Use any email from the leaderboard (e.g., alex@example.com)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    // Simulate API calls
    setLeaderboard(mockAPI.users.sort((a, b) => b.donationsRaised - a.donationsRaised));
    setRewards(mockAPI.rewards);
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "pink" }) => (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-info">
          <h3>{title}</h3>
          <p className="value">{value}</p>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
        <div className="stat-icon">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="card-header">
        <h2 className="card-title">Welcome back, {user.name}! 🎉</h2>
        <p className="card-subtitle">Track your progress and unlock amazing rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Raised"
          value={`$${user.donationsRaised.toLocaleString()}`}
          subtitle="Keep it up!"
        />
        <StatCard
          icon={Code}
          title="Referral Code"
          value={user.referralCode}
          subtitle="Share with friends"
          color="purple"
        />
        <StatCard
          icon={Trophy}
          title="Current Rank"
          value={`#${user.rank}`}
          subtitle="Leaderboard position"
          color="yellow"
        />
        <StatCard
          icon={Star}
          title="Rewards Unlocked"
          value={rewards.filter(r => r.unlocked).length}
          subtitle={`${rewards.length - rewards.filter(r => r.unlocked).length} remaining`}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="card-title flex items-center">
            <Gift className="w-5 h-5 mr-2 text-pink-400" />
            Recent Rewards
          </h3>
          <div className="space-y-3 mt-4">
            {rewards.slice(0, 3).map(reward => (
              <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{reward.icon}</span>
                  <div>
                    <p className="text-white font-medium">{reward.name}</p>
                    <p className="text-pink-300 text-sm">${reward.requirement.toLocaleString()} required</p>
                  </div>
                </div>
                <div className={`reward-status ${reward.unlocked ? 'unlocked' : 'locked'}`}>
                  {reward.unlocked ? 'Unlocked' : 'Locked'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title flex items-center">
            <Users className="w-5 h-5 mr-2 text-pink-400" />
            Top Performers
          </h3>
          <div className="space-y-3 mt-4">
            {leaderboard.slice(0, 3).map((intern, index) => (
              <div key={intern.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className={`rank-badge ${
                    index === 0 ? 'rank-1' :
                    index === 1 ? 'rank-2' :
                    'rank-3'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{intern.name}</p>
                    <p className="text-pink-300 text-sm">{intern.referralCode}</p>
                  </div>
                </div>
                <p className="text-white font-bold">${intern.donationsRaised.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <div className="card-header">
        <h2 className="card-title">🏆 Leaderboard</h2>
        <p className="card-subtitle">See how you rank against other interns</p>
      </div>

      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h3 className="leaderboard-title">Rankings</h3>
        </div>
        <div>
          {leaderboard.map((intern, index) => (
            <div key={intern.id} className={`leaderboard-item ${
              intern.id === user.id ? 'current-user' : ''
            }`}>
              <div className="rank-info">
                <div className={`rank-badge ${
                  index === 0 ? 'rank-1' :
                  index === 1 ? 'rank-2' :
                  index === 2 ? 'rank-3' :
                  'rank-other'
                }`}>
                  {index + 1}
                </div>
                <div className="user-info">
                  <h4>{intern.name}</h4>
                  <p>{intern.referralCode}</p>
                </div>
                {intern.id === user.id && (
                  <span className="user-badge">You</span>
                )}
              </div>
              <div className="amount-info">
                <p className="amount">${intern.donationsRaised.toLocaleString()}</p>
                <p className="label">Total Raised</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      <div className="card-header">
        <h2 className="card-title">🎁 Rewards & Unlockables</h2>
        <p className="card-subtitle">Unlock badges and rewards as you raise more donations</p>
      </div>

      <div className="reward-grid">
        {rewards.map(reward => (
          <div key={reward.id} className={`reward-card ${reward.unlocked ? 'unlocked' : 'locked'}`}>
            <div className="text-center">
              <div className={`reward-icon ${reward.unlocked ? '' : 'locked'}`}>
                {reward.icon}
              </div>
              <h3 className="reward-title">{reward.name}</h3>
              <p className="reward-requirement">
                Requirement: ${reward.requirement.toLocaleString()}
              </p>
              <div className={`reward-status ${reward.unlocked ? 'unlocked' : 'locked'}`}>
                {reward.unlocked ? '✅ Unlocked' : '🔒 Locked'}
              </div>
              {!reward.unlocked && (
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${Math.min((user.donationsRaised / reward.requirement) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    ${(reward.requirement - user.donationsRaised).toLocaleString()} to go
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-pink-800">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="navbar-brand">
              <div className="navbar-logo">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="navbar-title">Intern Portal</h1>
            </div>
            
            <div className="navbar-nav">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              >
                <Home className="nav-icon" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`nav-link ${activeTab === 'leaderboard' ? 'active' : ''}`}
              >
                <BarChart3 className="nav-icon" />
                Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`nav-link ${activeTab === 'rewards' ? 'active' : ''}`}
              >
                <Gift className="nav-icon" />
                Rewards
              </button>
              <button
                onClick={onLogout}
                className="nav-link"
              >
                <LogOut className="nav-icon" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
        {activeTab === 'rewards' && renderRewards()}
      </main>
    </div>
  );
};

// Main App Component
const InternPortal = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default InternPortal;