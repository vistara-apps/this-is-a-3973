import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  MapPin, 
  Calendar, 
  Award, 
  Filter,
  Search,
  Download,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Recordings = () => {
  const { recordings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('all');
  const [playingId, setPlayingId] = useState(null);

  const uniqueSpecies = [...new Set(recordings.map(r => r.analysisResults.species))];

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.analysisResults.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recording.analysisResults.callType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSpecies === 'all' || recording.analysisResults.species === filterSpecies;
    
    return matchesSearch && matchesFilter;
  });

  const handlePlayPause = (recordingId) => {
    setPlayingId(playingId === recordingId ? null : recordingId);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Recordings</h1>
        <p className="text-slate-400 mt-1">
          Manage and explore your wildlife audio recordings
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search recordings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={filterSpecies}
          onChange={(e) => setFilterSpecies(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Species</option>
          {uniqueSpecies.map(species => (
            <option key={species} value={species}>{species}</option>
          ))}
        </select>

        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
          <Filter className="w-4 h-4" />
          <span>More Filters</span>
        </button>
      </div>

      {/* Recordings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRecordings.map((recording) => (
          <div key={recording.id} className="bg-slate-800 rounded-lg p-6 hover:bg-slate-750 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handlePlayPause(recording.id)}
                  className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center transition-colors"
                >
                  {playingId === recording.id ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  )}
                </button>
                <div>
                  <h3 className="font-semibold text-white">{recording.analysisResults.species}</h3>
                  <p className="text-sm text-slate-400 capitalize">{recording.analysisResults.callType}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Waveform Placeholder */}
            <div className="h-16 bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-emerald-500 rounded"
                    style={{ 
                      height: `${Math.random() * 30 + 10}px`,
                      opacity: playingId === recording.id ? 1 : 0.6
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Confidence Score */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-400">Confidence</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${recording.analysisResults.confidenceScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-emerald-400">
                  {recording.analysisResults.confidenceScore.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Behavioral Insight */}
            <div className="mb-4">
              <p className="text-sm text-slate-300 line-clamp-2">
                {recording.analysisResults.behavioralInsight}
              </p>
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3" />
                <span>{recording.timestamp.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3" />
                <span>
                  {recording.latitude.toFixed(4)}, {recording.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecordings.length === 0 && (
        <div className="text-center py-12">
          <Mic className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">No recordings found</h3>
          <p className="text-slate-500">
            {searchTerm || filterSpecies !== 'all' 
              ? 'Try adjusting your search filters'
              : 'Start by recording some wildlife sounds!'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Recordings;