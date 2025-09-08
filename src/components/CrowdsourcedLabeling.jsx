/**
 * CrowdsourcedLabeling component for EchoMapper
 * Allows users to contribute labels and corrections to improve AI accuracy
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Edit3,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const CrowdsourcedLabeling = ({ 
  recording, 
  onLabelSubmit = () => {},
  onClose = () => {},
  className = '' 
}) => {
  const { user } = useApp();
  const [labelData, setLabelData] = useState({
    speciesSuggestion: '',
    callTypeSuggestion: '',
    comment: '',
    confidence: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingLabels, setExistingLabels] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Mock existing labels for demonstration
  useEffect(() => {
    // In production, this would fetch from the API
    const mockLabels = [
      {
        id: '1',
        userId: 'user2',
        username: 'bird_expert_2024',
        speciesSuggestion: 'American Robin',
        callTypeSuggestion: 'territorial',
        comment: 'The trill pattern is characteristic of robin territorial calls',
        confidence: 8,
        createdAt: new Date('2024-01-20T10:30:00'),
        votes: { up: 5, down: 1 }
      },
      {
        id: '2',
        userId: 'user3',
        username: 'nature_listener',
        speciesSuggestion: 'House Finch',
        callTypeSuggestion: 'contact',
        comment: 'Could be a house finch based on the frequency pattern',
        confidence: 6,
        createdAt: new Date('2024-01-20T11:15:00'),
        votes: { up: 2, down: 3 }
      }
    ];
    setExistingLabels(mockLabels);
  }, [recording.id]);

  const handleInputChange = (field, value) => {
    setLabelData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitLabel = async () => {
    if (!labelData.speciesSuggestion.trim()) {
      alert('Please provide a species suggestion');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLabel = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        recordingId: recording.id,
        ...labelData,
        createdAt: new Date(),
        votes: { up: 0, down: 0 }
      };

      setExistingLabels(prev => [newLabel, ...prev]);
      onLabelSubmit(newLabel);
      
      // Reset form
      setLabelData({
        speciesSuggestion: '',
        callTypeSuggestion: '',
        comment: '',
        confidence: 5
      });
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error('Error submitting label:', error);
      alert('Failed to submit label. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (labelId, voteType) => {
    // Simulate voting
    setExistingLabels(prev => 
      prev.map(label => {
        if (label.id === labelId) {
          const newVotes = { ...label.votes };
          if (voteType === 'up') {
            newVotes.up += 1;
          } else {
            newVotes.down += 1;
          }
          return { ...label, votes: newVotes };
        }
        return label;
      })
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 8) return 'text-emerald-400';
    if (confidence >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getVoteScore = (votes) => {
    return votes.up - votes.down;
  };

  const sortedLabels = [...existingLabels].sort((a, b) => {
    const scoreA = getVoteScore(a.votes);
    const scoreB = getVoteScore(b.votes);
    return scoreB - scoreA;
  });

  return (
    <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-emerald-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Community Labels</h3>
            <p className="text-sm text-slate-400">
              Help improve AI accuracy by suggesting corrections
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Current AI Analysis */}
      <div className="bg-slate-700 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-white mb-2 flex items-center">
          <Target className="w-4 h-4 mr-2 text-blue-400" />
          Current AI Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Species:</span>
            <p className="text-white font-medium">
              {recording.analysisResults?.species || 'Unknown'}
            </p>
          </div>
          <div>
            <span className="text-slate-400">Call Type:</span>
            <p className="text-white font-medium capitalize">
              {recording.analysisResults?.callType || 'Unknown'}
            </p>
          </div>
          <div>
            <span className="text-slate-400">Confidence:</span>
            <p className="text-white font-medium">
              {recording.analysisResults?.confidenceScore?.toFixed(1) || 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-emerald-600 bg-opacity-20 border border-emerald-600 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm">
              Thank you! Your label has been submitted successfully.
            </span>
          </div>
        </div>
      )}

      {/* Label Submission Form */}
      <div className="bg-slate-700 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-white mb-4 flex items-center">
          <Edit3 className="w-4 h-4 mr-2 text-emerald-400" />
          Suggest a Correction
        </h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Species Suggestion *
              </label>
              <input
                type="text"
                value={labelData.speciesSuggestion}
                onChange={(e) => handleInputChange('speciesSuggestion', e.target.value)}
                placeholder="e.g., American Robin"
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Call Type Suggestion
              </label>
              <select
                value={labelData.callTypeSuggestion}
                onChange={(e) => handleInputChange('callTypeSuggestion', e.target.value)}
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="">Select call type</option>
                <option value="territorial">Territorial</option>
                <option value="mating">Mating</option>
                <option value="alarm">Alarm</option>
                <option value="contact">Contact</option>
                <option value="distress">Distress</option>
                <option value="feeding">Feeding</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Confidence Level (1-10)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="10"
                value={labelData.confidence}
                onChange={(e) => handleInputChange('confidence', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className={`text-sm font-medium ${getConfidenceColor(labelData.confidence)}`}>
                {labelData.confidence}/10
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Additional Comments
            </label>
            <textarea
              value={labelData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Explain your reasoning or provide additional context..."
              rows={3}
              className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 resize-none"
            />
          </div>

          <button
            onClick={handleSubmitLabel}
            disabled={isSubmitting || !labelData.speciesSuggestion.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Label</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Existing Labels */}
      <div>
        <h4 className="text-sm font-medium text-white mb-4 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2 text-blue-400" />
          Community Suggestions ({existingLabels.length})
        </h4>

        {sortedLabels.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No community labels yet</p>
            <p className="text-sm">Be the first to contribute!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedLabels.map((label) => {
              const voteScore = getVoteScore(label.votes);
              const isTopContributor = voteScore >= 3;
              
              return (
                <div key={label.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {label.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{label.username}</span>
                          {isTopContributor && (
                            <Award className="w-4 h-4 text-yellow-400" title="Top Contributor" />
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {formatDate(label.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${getConfidenceColor(label.confidence)}`}>
                        {label.confidence}/10
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-slate-400">Species:</span>
                      <p className="text-white font-medium">{label.speciesSuggestion}</p>
                    </div>
                    {label.callTypeSuggestion && (
                      <div>
                        <span className="text-slate-400">Call Type:</span>
                        <p className="text-white font-medium capitalize">
                          {label.callTypeSuggestion}
                        </p>
                      </div>
                    )}
                  </div>

                  {label.comment && (
                    <div className="mb-3">
                      <p className="text-slate-300 text-sm italic">"{label.comment}"</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleVote(label.id, 'up')}
                        className="flex items-center space-x-1 text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{label.votes.up}</span>
                      </button>
                      <button
                        onClick={() => handleVote(label.id, 'down')}
                        className="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm">{label.votes.down}</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${voteScore > 0 ? 'text-emerald-400' : voteScore < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        Score: {voteScore > 0 ? '+' : ''}{voteScore}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-300">
            <p className="font-medium mb-1">How Community Labels Work</p>
            <ul className="text-xs space-y-1 text-blue-200">
              <li>• Your suggestions help train our AI models</li>
              <li>• High-quality labels earn community recognition</li>
              <li>• Voting helps identify the most accurate suggestions</li>
              <li>• All contributions are reviewed by experts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdsourcedLabeling;
