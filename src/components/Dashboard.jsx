import React from 'react';
import { 
  TrendingUp, 
  Mic, 
  Target, 
  Users, 
  Play,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import AudioRecorder from './AudioRecorder';

const Dashboard = () => {
  const { recordings, user } = useApp();

  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', recordings: 4, species: 3 },
    { day: 'Tue', recordings: 7, species: 5 },
    { day: 'Wed', recordings: 3, species: 2 },
    { day: 'Thu', recordings: 8, species: 6 },
    { day: 'Fri', recordings: 12, species: 9 },
    { day: 'Sat', recordings: 15, species: 11 },
    { day: 'Sun', recordings: 6, species: 4 },
  ];

  const speciesData = [
    { species: 'Robin', count: 12 },
    { species: 'Owl', count: 8 },
    { species: 'Sparrow', count: 15 },
    { species: 'Cardinal', count: 6 },
    { species: 'Blue Jay', count: 9 },
  ];

  const recentRecordings = recordings.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Welcome back, {user.username}! Here's your wildlife activity overview.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <AudioRecorder />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Recordings"
          value={recordings.length}
          icon={Mic}
          trend="+12%"
          color="emerald"
        />
        <StatCard
          title="Species Identified"
          value="24"
          icon={Target}
          trend="+8%"
          color="blue"
        />
        <StatCard
          title="Analysis Accuracy"
          value="87.5%"
          icon={Award}
          trend="+2.1%"
          color="purple"
        />
        <StatCard
          title="Community Labels"
          value="156"
          icon={Users}
          trend="+23%"
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="recordings" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981' }}
              />
              <Line 
                type="monotone" 
                dataKey="species" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Species Distribution */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Species Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={speciesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="species" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Recordings */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Recordings</h3>
        <div className="space-y-4">
          {recentRecordings.map((recording) => (
            <div key={recording.id} className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{recording.analysisResults.species}</h4>
                <p className="text-sm text-slate-400">{recording.analysisResults.callType}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-slate-400 mb-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {recording.latitude.toFixed(4)}, {recording.longitude.toFixed(4)}
                </div>
                <div className="flex items-center text-sm text-slate-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  {recording.timestamp.toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-emerald-400">
                  {recording.analysisResults.confidenceScore.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400">Confidence</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;