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
      <div className="bg-slate-800 rounded-lg p-4 w-full max-w-sm">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
          <div className="flex-1">
            <div className="text-sm font-medium text-white">Analyzing...</div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>
          <div className="text-sm text-slate-400">{analysisProgress}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Record Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isRecording
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }`}
      >
        {isRecording ? (
          <>
            <Square className="w-4 h-4" />
            <span>Stop Recording</span>
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
            <Mic className="w-4 h-4" />
            <span>Record</span>
          </>
        )}
      </button>

      {/* Upload Button */}
      <label className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium cursor-pointer transition-colors">
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        <span>Upload</span>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default AudioRecorder;