import React, { useState } from 'react';
import { 
  User, 
  Crown, 
  CreditCard, 
  Settings, 
  Bell, 
  Shield, 
  Download,
  Trash2,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Account = () => {
  const { user, upgradeToPremium } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab user={user} />;
      case 'subscription':
        return <SubscriptionTab user={user} upgradeToP‭remium={upgradeToP‭remium} />;
      case 'settings':
        return <SettingsTab />;
      case 'privacy':
        return <PrivacyTab />;
      default:
        return <ProfileTab user={user} />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Account</h1>
        <p className="text-slate-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-lg p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ user }) => (
  <div className="bg-slate-800 rounded-lg p-6 space-y-6">
    <h2 className="text-xl font-semibold text-white">Profile Information</h2>
    
    <div className="flex items-center space-x-6">
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-2xl">
          {user.username.charAt(0).toUpperCase()}
        </span>
      </div>
      <div>
        <h3 className="text-lg font-medium text-white">{user.username}</h3>
        <p className="text-slate-400">{user.email}</p>
        <div className="flex items-center space-x-2 mt-1">
          {user.subscriptionTier === 'premium' && (
            <Crown className="w-4 h-4 text-yellow-500" />
          )}
          <span className="text-sm text-slate-400 capitalize">
            {user.subscriptionTier} Member
          </span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Username
        </label>
        <input
          type="text"
          defaultValue={user.username}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Email
        </label>
        <input
          type="email"
          defaultValue={user.email}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Bio
      </label>
      <textarea
        rows={3}
        placeholder="Tell us about your wildlife interests..."
        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
      />
    </div>

    <div className="flex justify-end">
      <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
        Save Changes
      </button>
    </div>
  </div>
);

const SubscriptionTab = ({ user, upgradeToP‭remium }) => (
  <div className="space-y-6">
    {/* Current Plan */}
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Current Plan</h2>
      
      <div className={`p-4 rounded-lg border-2 ${
        user.subscriptionTier === 'premium' 
          ? 'border-yellow-500 bg-yellow-500/10' 
          : 'border-slate-600 bg-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {user.subscriptionTier === 'premium' && (
              <Crown className="w-6 h-6 text-yellow-500" />
            )}
            <div>
              <h3 className="font-medium text-white capitalize">
                {user.subscriptionTier} Plan
              </h3>
              <p className="text-slate-400 text-sm">
                {user.subscriptionTier === 'premium' 
                  ? 'Unlimited analysis, premium features' 
                  : 'Limited analysis per month'
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {user.subscriptionTier === 'premium' ? '$5' : '$0'}
            </div>
            <div className="text-slate-400 text-sm">per month</div>
          </div>
        </div>
      </div>
    </div>

    {/* Upgrade Options */}
    {user.subscriptionTier === 'free' && (
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Upgrade to Premium</h2>
        
        <div className="border-2 border-emerald-500 bg-emerald-500/10 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-medium text-white">Premium Plan</h3>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Unlimited audio analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Advanced behavioral insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Offline capabilities</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Priority database integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Export recordings & data</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">$5/month</div>
              <div className="text-slate-400 text-sm">Cancel anytime</div>
            </div>
            <button
              onClick={upgradeToP‭remium}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Usage Stats */}
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Usage This Month</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-slate-700 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">12</div>
          <div className="text-slate-400 text-sm">Recordings Analyzed</div>
          {user.subscriptionTier === 'free' && (
            <div className="text-xs text-slate-500 mt-1">3 remaining</div>
          )}
        </div>
        
        <div className="text-center p-4 bg-slate-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">8</div>
          <div className="text-slate-400 text-sm">Species Identified</div>
        </div>
        
        <div className="text-center p-4 bg-slate-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">2.1GB</div>
          <div className="text-slate-400 text-sm">Storage Used</div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsTab = () => (
  <div className="bg-slate-800 rounded-lg p-6 space-y-6">
    <h2 className="text-xl font-semibold text-white">Settings</h2>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white">Email Notifications</h3>
          <p className="text-slate-400 text-sm">Receive updates about your recordings</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white">Auto-analyze recordings</h3>
          <p className="text-slate-400 text-sm">Automatically analyze uploaded recordings</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white">Location tracking</h3>
          <p className="text-slate-400 text-sm">Add GPS coordinates to recordings</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>
    </div>
  </div>
);

const PrivacyTab = () => (
  <div className="bg-slate-800 rounded-lg p-6 space-y-6">
    <h2 className="text-xl font-semibold text-white">Privacy & Data</h2>
    
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-white mb-2">Data Export</h3>
        <p className="text-slate-400 text-sm mb-4">
          Download all your recordings and analysis data
        </p>
        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>
      
      <div>
        <h3 className="font-medium text-white mb-2">Delete Account</h3>
        <p className="text-slate-400 text-sm mb-4">
          Permanently delete your account and all associated data
        </p>
        <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  </div>
);

export default Account;