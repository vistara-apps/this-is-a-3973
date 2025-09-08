import React from 'react';
import { 
  BarChart3, 
  Mic, 
  Search, 
  User, 
  Settings,
  Crown,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { user } = useApp();

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close mobile sidebar after selection
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'recordings', label: 'Recordings', icon: Mic },
    { id: 'analysis', label: 'Analysis', icon: Search },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-card rounded-lg text-white hover:bg-dark-hover transition-colors"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-surface border-r border-dark-border flex flex-col
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-nature-forest rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EchoMapper</h1>
              <p className="text-xs text-slate-400">Wildlife Audio Analysis</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-dark-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-nature-forest to-nature-sky rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.username}
              </p>
              <div className="flex items-center space-x-1">
                {user.subscriptionTier === 'premium' && (
                  <Crown className="w-3 h-3 text-warning" />
                )}
                <p className="text-xs text-slate-400 capitalize">
                  {user.subscriptionTier}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-nature-forest text-white shadow-lg transform scale-105'
                        : 'text-slate-300 hover:bg-dark-hover hover:text-white hover:transform hover:scale-102'
                    }`}
                    aria-label={`Navigate to ${item.label}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-dark-border">
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-dark-hover hover:text-white transition-all duration-200 hover:transform hover:scale-102">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
