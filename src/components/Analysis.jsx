import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Eye,
  Filter,
  Download
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../context/AppContext';

const Analysis = () => {
  const { recordings, user } = useApp();
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [timeRange, setTimeRange] = useState('week');

  // Prepare data for charts
  const speciesData = recordings.reduce((acc, recording) => {
    const species = recording.analysisResults.species;
    acc[species] = (acc[species] || 0) + 1;
    return acc;
  }, {});

  const speciesChartData = Object.entries(speciesData).map(([species, count]) => ({
    species,
    count,
    confidence: recordings
      .filter(r => r.analysisResults.species === species)
      .reduce((sum, r) => sum + r.analysisResults.confidenceScore, 0) / count
  }));

  const callTypeData = recordings.reduce((acc, recording) => {
    const callType = recording.analysisResults.callType;
    acc[callType] = (acc[callType] || 0) + 1;
    return acc;
  }, {});

  const callTypeChartData = Object.entries(callTypeData).map(([type, count]) => ({
    type,
    count
  }));

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  const timeSeriesData = [
    { date: '2024-01-15', recordings: 2, accuracy: 85 },
    { date: '2024-01-16', recordings: 3, accuracy: 87 },
    { date: '2024-01-17', recordings: 1, accuracy: 92 },
    { date: '2024-01-18', recordings: 4, accuracy: 89 },
    { date: '2024-01-19', recordings: 2, accuracy: 91 },
    { date: '2024-01-20', recordings: 5, accuracy: 88 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis</h1>
          <p className="text-slate-400 mt-1">
            Deep insights into your wildlife recordings and AI performance
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Species</option>
            {Object.keys(speciesData).map(species => (
              <option key={species} value={species}>{species}</option>
            ))}
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Analysis Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {recordings.reduce((sum, r) => sum + r.analysisResults.confidenceScore, 0) / recordings.length || 0}%
              </div>
              <div className="text-slate-400 text-sm">Avg. Confidence</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{Object.keys(speciesData).length}</div>
              <div className="text-slate-400 text-sm">Species Detected</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {recordings.filter(r => r.analysisResults.confidenceScore > 90).length}
              </div>
              <div className="text-slate-400 text-sm">High Confidence</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{Object.keys(callTypeData).length}</div>
              <div className="text-slate-400 text-sm">Call Types</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Species Distribution */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Species Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={speciesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="species" 
                stroke="#9CA3AF" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  name === 'count' ? `${value} recordings` : `${value.toFixed(1)}% confidence`,
                  name === 'count' ? 'Recordings' : 'Avg. Confidence'
                ]}
              />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Call Types */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Call Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={callTypeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {callTypeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recording Timeline */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recording Activity & Accuracy Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis yAxisId="left" stroke="#9CA3AF" />
            <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Bar yAxisId="left" dataKey="recordings" fill="#10B981" opacity={0.7} />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="accuracy" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights Panel */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">AI Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Peak Activity Time</h4>
            <p className="text-slate-300 text-sm">
              Most wildlife activity detected between 6-8 AM, ideal for recording sessions.
            </p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Species Diversity</h4>
            <p className="text-slate-300 text-sm">
              {Object.keys(speciesData).length} species identified. Consider exploring new locations for more diversity.
            </p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Recording Quality</h4>
            <p className="text-slate-300 text-sm">
              Average confidence score suggests good recording conditions. Maintain current setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;