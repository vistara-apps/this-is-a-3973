import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: '1',
    username: 'naturalist_explorer',
    email: 'explorer@echomapper.com',
    subscriptionTier: 'free',
    createdAt: new Date('2024-01-15')
  });

  const [recordings, setRecordings] = useState([
    {
      id: '1',
      userId: '1',
      audioUrl: '/demo-bird-song.mp3',
      timestamp: new Date('2024-01-20T08:30:00'),
      latitude: 40.7128,
      longitude: -74.0060,
      uploadedAt: new Date('2024-01-20T08:35:00'),
      analysisResults: {
        species: 'American Robin',
        callType: 'territorial',
        confidenceScore: 87.5,
        behavioralInsight: 'Morning territorial song, likely establishing territory boundaries'
      }
    },
    {
      id: '2',
      userId: '1',
      audioUrl: '/demo-owl-hoot.mp3',
      timestamp: new Date('2024-01-19T22:15:00'),
      latitude: 40.7589,
      longitude: -73.9851,
      uploadedAt: new Date('2024-01-19T22:18:00'),
      analysisResults: {
        species: 'Great Horned Owl',
        callType: 'mating',
        confidenceScore: 92.1,
        behavioralInsight: 'Mating call during breeding season, seeking potential mates'
      }
    },
    {
      id: '3',
      userId: '1',
      audioUrl: '/demo-wolf-howl.mp3',
      timestamp: new Date('2024-01-18T19:45:00'),
      latitude: 44.9537,
      longitude: -93.0900,
      uploadedAt: new Date('2024-01-18T20:00:00'),
      analysisResults: {
        species: 'Gray Wolf',
        callType: 'pack_communication',
        confidenceScore: 95.3,
        behavioralInsight: 'Long-distance pack communication, likely coordinating hunt or gathering'
      }
    }
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Simulate analysis
        analyzeRecording(audioUrl);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const analyzeRecording = async (audioUrl) => {
    setAnalysisProgress(0);
    
    // Simulate AI analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          
          // Add mock analysis result
          const newRecording = {
            id: Date.now().toString(),
            userId: user.id,
            audioUrl,
            timestamp: new Date(),
            latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
            longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
            uploadedAt: new Date(),
            analysisResults: {
              species: ['House Sparrow', 'Blue Jay', 'Cardinal'][Math.floor(Math.random() * 3)],
              callType: ['territorial', 'alarm', 'mating'][Math.floor(Math.random() * 3)],
              confidenceScore: 75 + Math.random() * 20,
              behavioralInsight: 'Analyzing behavioral patterns and environmental context...'
            }
          };
          
          setRecordings(prev => [newRecording, ...prev]);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const upgradeToPremium = () => {
    // Simulate Stripe payment flow
    setUser(prev => ({ ...prev, subscriptionTier: 'premium' }));
    alert('Successfully upgraded to Premium! 🎉');
  };

  const value = {
    user,
    setUser,
    recordings,
    setRecordings,
    isRecording,
    startRecording,
    stopRecording,
    analysisProgress,
    upgradeToPremium
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};