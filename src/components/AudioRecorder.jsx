import React, { useState } from 'react';
import { Mic, Square, Upload, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AudioRecorder = () => {
  const { isRecording, startRecording, stopRecording, analysisProgress } = useApp();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsUploading(false);
      // The actual analysis would happen in the context
    }, 1000);
  };

  if (analysisProgress > 0) {
    return (
      <div className="bg-dark-card rounded-lg p-6 w-full max-w-md animate-scale-in border border-dark-border">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Loader2 className="w-6 h-6 text-nature-forest animate-spin" />
            <div className="absolute inset-0 w-6 h-6 border-2 border-nature-forest/20 rounded-full animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white mb-2">
              🎵 Analyzing wildlife sounds...
            </div>
            <div className="w-full bg-dark-surface rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-nature-forest to-nature-moss h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Processing audio patterns</span>
              <span>{analysisProgress}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
      {/* Record Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`group relative flex items-center justify-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-lg ${
          isRecording
            ? 'bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-red-700 text-white animate-recording-pulse'
            : 'bg-gradient-to-r from-nature-forest to-nature-moss hover:from-nature-moss hover:to-nature-forest text-white'
        }`}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <>
            <Square className="w-5 h-5" />
            <span className="hidden sm:inline">Stop Recording</span>
            <span className="sm:hidden">Stop</span>
            <div className="audio-visualizer ml-2">
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              <Mic className="w-5 h-5" />
              <div className="absolute inset-0 w-5 h-5 border-2 border-white/30 rounded-full animate-pulse group-hover:animate-ping" />
            </div>
            <span className="hidden sm:inline">Start Recording</span>
            <span className="sm:hidden">Record</span>
          </>
        )}
      </button>

      {/* Upload Button */}
      <label className={`group flex items-center justify-center space-x-3 px-6 py-3 rounded-xl font-medium cursor-pointer transition-all duration-300 transform hover:scale-105 focus-within:scale-105 shadow-lg ${
        isUploading 
          ? 'bg-dark-card border-2 border-nature-sage text-nature-sage cursor-not-allowed'
          : 'bg-dark-card hover:bg-dark-hover border-2 border-dark-border hover:border-nature-sage text-white hover:text-nature-sage'
      }`}>
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="hidden sm:inline">Uploading...</span>
            <span className="sm:hidden">Upload</span>
          </>
        ) : (
          <>
            <div className="relative">
              <Upload className="w-5 h-5" />
              <div className="absolute inset-0 w-5 h-5 border-2 border-current opacity-30 rounded-full group-hover:animate-pulse" />
            </div>
            <span className="hidden sm:inline">Upload Audio</span>
            <span className="sm:hidden">Upload</span>
          </>
        )}
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading}
          aria-label="Upload audio file"
        />
      </label>
    </div>
  );
};

export default AudioRecorder;
