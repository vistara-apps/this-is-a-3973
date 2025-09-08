import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService, recordingService, storageService, analysisService } from '../services/supabase';
import { audioAnalysisService, audioUtils } from '../services/openai';
import { paymentService, premiumFeatures } from '../services/stripe';
import { validateEnvironment } from '../config/env';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const [recordings, setRecordings] = useState([]);
  const [analysisUsage, setAnalysisUsage] = useState({ current: 0, limit: 10 });

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Initialize app and check authentication
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Validate environment variables
        const envValid = validateEnvironment();
        if (!envValid) {
          console.warn('Some environment variables are missing. Using demo mode.');
        }

        // Check for existing session
        const { user: currentUser, error } = await authService.getCurrentUser();
        
        if (currentUser && !error) {
          // Get user profile
          const { data: profile } = await userService.getProfile(currentUser.id);
          
          setUser({
            id: currentUser.id,
            email: currentUser.email,
            username: profile?.username || currentUser.email?.split('@')[0] || 'User',
            subscriptionTier: profile?.subscription_tier || 'free',
            createdAt: new Date(currentUser.created_at),
            subscription: profile?.subscription
          });
          setIsAuthenticated(true);
          
          // Load user recordings
          await loadUserRecordings(currentUser.id);
          
          // Update analysis usage limits
          const limit = premiumFeatures.getMonthlyAnalysisLimit({ subscription: profile?.subscription });
          setAnalysisUsage(prev => ({ ...prev, limit }));
        } else {
          // Demo mode with mock data
          setUser({
            id: 'demo-user',
            username: 'naturalist_explorer',
            email: 'explorer@echomapper.com',
            subscriptionTier: 'free',
            createdAt: new Date('2024-01-15')
          });
          setIsAuthenticated(false);
          
          // Load demo recordings
          loadDemoRecordings();
        }
      } catch (error) {
        console.error('App initialization error:', error);
        setAuthError(error.message);
        
        // Fallback to demo mode
        setUser({
          id: 'demo-user',
          username: 'naturalist_explorer',
          email: 'explorer@echomapper.com',
          subscriptionTier: 'free',
          createdAt: new Date('2024-01-15')
        });
        setIsAuthenticated(false);
        loadDemoRecordings();
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await userService.getProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: profile?.username || session.user.email?.split('@')[0] || 'User',
          subscriptionTier: profile?.subscription_tier || 'free',
          createdAt: new Date(session.user.created_at),
          subscription: profile?.subscription
        });
        setIsAuthenticated(true);
        setAuthError(null);
        await loadUserRecordings(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setRecordings([]);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Load user recordings from database
  const loadUserRecordings = async (userId) => {
    try {
      const { data, error } = await recordingService.getUserRecordings(userId);
      if (error) throw error;
      
      setRecordings(data || []);
      
      // Update analysis usage count
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRecordings = (data || []).filter(recording => {
        const recordingDate = new Date(recording.created_at);
        return recordingDate.getMonth() === currentMonth && 
               recordingDate.getFullYear() === currentYear;
      });
      
      setAnalysisUsage(prev => ({ ...prev, current: monthlyRecordings.length }));
    } catch (error) {
      console.error('Error loading recordings:', error);
    }
  };

  // Load demo recordings for non-authenticated users
  const loadDemoRecordings = () => {
    const demoRecordings = [
      {
        id: '1',
        userId: 'demo-user',
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
        userId: 'demo-user',
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
        userId: 'demo-user',
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
    ];
    setRecordings(demoRecordings);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create File object for analysis
        const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        
        // Upload to storage if authenticated
        let finalAudioUrl = audioUrl;
        if (isAuthenticated) {
          try {
            const fileName = `${user.id}/${Date.now()}.wav`;
            const { data: uploadData, error: uploadError } = await storageService.uploadAudio(audioFile, fileName);
            
            if (!uploadError && uploadData) {
              finalAudioUrl = await storageService.getAudioUrl(fileName);
            }
          } catch (uploadError) {
            console.warn('Audio upload failed, using local URL:', uploadError);
          }
        }
        
        // Analyze recording
        analyzeRecording(audioFile, finalAudioUrl);
        
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

  const analyzeRecording = async (audioFile, audioUrl) => {
    setAnalysisProgress(0);
    
    try {
      // Check analysis limits
      if (analysisUsage.current >= analysisUsage.limit && !premiumFeatures.hasUnlimitedAnalysis(user)) {
        throw new Error('Monthly analysis limit reached. Upgrade to Premium for unlimited analysis.');
      }

      // Validate audio file
      const validation = audioUtils.validateAudioFile(audioFile);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Get current location
      let latitude = null;
      let longitude = null;
      
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch (geoError) {
        console.warn('Could not get location:', geoError);
        // Use default location (NYC) as fallback
        latitude = 40.7128;
        longitude = -74.0060;
      }

      // Create recording record first
      const recordingData = {
        user_id: user.id,
        audio_url: audioUrl,
        timestamp: new Date().toISOString(),
        latitude,
        longitude,
        uploaded_at: new Date().toISOString()
      };

      let recordingId;
      
      if (isAuthenticated) {
        // Save to database
        const { data: recordingResult, error: recordingError } = await recordingService.createRecording(recordingData);
        if (recordingError) throw recordingError;
        recordingId = recordingResult[0].id;
      } else {
        // Demo mode - use timestamp as ID
        recordingId = Date.now().toString();
      }

      // Update progress
      setAnalysisProgress(20);

      // Analyze audio with OpenAI
      const analysisResult = await audioAnalysisService.analyzeAudio(audioFile, {
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      });

      setAnalysisProgress(80);

      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Analysis failed');
      }

      const analysisData = analysisResult.data;

      // Save analysis results
      if (isAuthenticated) {
        const { error: analysisError } = await analysisService.createAnalysisResult({
          recording_id: recordingId,
          species: analysisData.species,
          call_type: analysisData.callType,
          confidence_score: analysisData.confidenceScore,
          behavioral_insight: analysisData.behavioralInsight,
          analyzed_at: new Date().toISOString(),
          model_version: analysisData.model || 'gpt-4-whisper-1'
        });
        
        if (analysisError) {
          console.error('Error saving analysis:', analysisError);
        }
      }

      // Create complete recording object
      const newRecording = {
        id: recordingId,
        userId: user.id,
        audioUrl,
        timestamp: new Date(recordingData.timestamp),
        latitude,
        longitude,
        uploadedAt: new Date(recordingData.uploaded_at),
        analysisResults: {
          species: analysisData.species,
          callType: analysisData.callType,
          confidenceScore: analysisData.confidenceScore,
          behavioralInsight: analysisData.behavioralInsight,
          alternativeSpecies: analysisData.alternativeSpecies,
          environmentalContext: analysisData.environmentalContext,
          recommendations: analysisData.recommendations
        }
      };

      // Update state
      setRecordings(prev => [newRecording, ...prev]);
      setAnalysisUsage(prev => ({ ...prev, current: prev.current + 1 }));
      setAnalysisProgress(100);

      // Reset progress after a delay
      setTimeout(() => setAnalysisProgress(0), 2000);

    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisProgress(0);
      
      // Show error to user
      alert(`Analysis failed: ${error.message}`);
      
      // Create recording without analysis for demo purposes
      if (!isAuthenticated) {
        const fallbackRecording = {
          id: Date.now().toString(),
          userId: user.id,
          audioUrl,
          timestamp: new Date(),
          latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
          uploadedAt: new Date(),
          analysisResults: {
            species: 'Unknown Species',
            callType: 'unknown',
            confidenceScore: 0,
            behavioralInsight: 'Analysis failed. Please try again or check your internet connection.'
          }
        };
        setRecordings(prev => [fallbackRecording, ...prev]);
      }
    }
  };

  // Authentication functions
  const signUp = async (email, password, username) => {
    try {
      setAuthError(null);
      const { data, error } = await authService.signUp(email, password, { username });
      
      if (error) throw error;
      
      // Create user profile
      if (data.user) {
        await userService.createProfile(data.user.id, {
          username,
          subscription_tier: 'free'
        });
      }
      
      return { success: true, data };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      setAuthError(null);
      const { data, error } = await authService.signIn(email, password);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setRecordings([]);
      setAnalysisUsage({ current: 0, limit: 10 });
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  const upgradeToPremium = async () => {
    try {
      if (!isAuthenticated) {
        throw new Error('Please sign in to upgrade to Premium');
      }

      const result = await paymentService.subscribeToPremium(user.id);
      
      if (result.success) {
        // Update user subscription
        setUser(prev => ({
          ...prev,
          subscriptionTier: 'premium',
          subscription: result.data
        }));
        
        // Update analysis limits
        setAnalysisUsage(prev => ({ ...prev, limit: Infinity }));
        
        alert('Successfully upgraded to Premium! 🎉');
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Premium upgrade error:', error);
      alert(`Upgrade failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const value = {
    // User state
    user,
    setUser,
    isAuthenticated,
    isLoading,
    authError,
    
    // Authentication functions
    signUp,
    signIn,
    signOut,
    
    // Recording state and functions
    recordings,
    setRecordings,
    isRecording,
    startRecording,
    stopRecording,
    analysisProgress,
    
    // Analysis and usage
    analysisUsage,
    
    // Premium features
    upgradeToPremium,
    
    // Utility functions
    loadUserRecordings: () => loadUserRecordings(user?.id)
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
