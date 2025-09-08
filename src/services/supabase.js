/**
 * Supabase service for EchoMapper
 * Handles database operations, authentication, and real-time subscriptions
 */

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/env.js';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Authentication services
export const authService = {
  // Sign up new user
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// User services
export const userService = {
  // Create user profile
  async createProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        user_id: userId,
        ...profileData
      }]);
    return { data, error };
  },

  // Get user profile
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  // Update user profile
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId);
    return { data, error };
  }
};

// Recording services
export const recordingService = {
  // Create new recording
  async createRecording(recordingData) {
    const { data, error } = await supabase
      .from('recordings')
      .insert([recordingData])
      .select();
    return { data, error };
  },

  // Get user recordings
  async getUserRecordings(userId, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('recordings')
      .select(`
        *,
        analysis_results (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return { data, error };
  },

  // Get recording by ID
  async getRecording(recordingId) {
    const { data, error } = await supabase
      .from('recordings')
      .select(`
        *,
        analysis_results (*)
      `)
      .eq('id', recordingId)
      .single();
    return { data, error };
  },

  // Update recording
  async updateRecording(recordingId, updates) {
    const { data, error } = await supabase
      .from('recordings')
      .update(updates)
      .eq('id', recordingId);
    return { data, error };
  },

  // Delete recording
  async deleteRecording(recordingId) {
    const { data, error } = await supabase
      .from('recordings')
      .delete()
      .eq('id', recordingId);
    return { data, error };
  }
};

// Analysis services
export const analysisService = {
  // Create analysis result
  async createAnalysisResult(analysisData) {
    const { data, error } = await supabase
      .from('analysis_results')
      .insert([analysisData])
      .select();
    return { data, error };
  },

  // Get analysis results for recording
  async getAnalysisResults(recordingId) {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('recording_id', recordingId);
    return { data, error };
  },

  // Update analysis result
  async updateAnalysisResult(resultId, updates) {
    const { data, error } = await supabase
      .from('analysis_results')
      .update(updates)
      .eq('id', resultId);
    return { data, error };
  }
};

// Label services (for crowdsourced labeling)
export const labelService = {
  // Create new label
  async createLabel(labelData) {
    const { data, error } = await supabase
      .from('labels')
      .insert([labelData])
      .select();
    return { data, error };
  },

  // Get labels for recording
  async getRecordingLabels(recordingId) {
    const { data, error } = await supabase
      .from('labels')
      .select(`
        *,
        users (username)
      `)
      .eq('recording_id', recordingId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get user's labels
  async getUserLabels(userId, limit = 50) {
    const { data, error } = await supabase
      .from('labels')
      .select(`
        *,
        recordings (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  }
};

// Storage services
export const storageService = {
  // Upload audio file
  async uploadAudio(file, fileName) {
    const { data, error } = await supabase.storage
      .from('audio-recordings')
      .upload(fileName, file);
    return { data, error };
  },

  // Get audio file URL
  async getAudioUrl(fileName) {
    const { data } = supabase.storage
      .from('audio-recordings')
      .getPublicUrl(fileName);
    return data.publicUrl;
  },

  // Delete audio file
  async deleteAudio(fileName) {
    const { data, error } = await supabase.storage
      .from('audio-recordings')
      .remove([fileName]);
    return { data, error };
  }
};

// Real-time subscriptions
export const subscriptionService = {
  // Subscribe to user's recordings
  subscribeToUserRecordings(userId, callback) {
    return supabase
      .channel('user-recordings')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'recordings',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  },

  // Subscribe to analysis results
  subscribeToAnalysisResults(recordingId, callback) {
    return supabase
      .channel('analysis-results')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'analysis_results',
        filter: `recording_id=eq.${recordingId}`
      }, callback)
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe(subscription) {
    return supabase.removeChannel(subscription);
  }
};
