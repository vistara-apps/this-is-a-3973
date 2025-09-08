/**
 * OpenAI service for EchoMapper
 * Handles audio analysis, species identification, and behavioral insights
 */

import OpenAI from 'openai';
import { OPENAI_CONFIG } from '../config/env.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_CONFIG.apiKey,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

// Audio analysis service
export const audioAnalysisService = {
  /**
   * Analyze audio file for species identification and call classification
   * @param {File} audioFile - The audio file to analyze
   * @param {Object} metadata - Additional metadata (location, timestamp, etc.)
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeAudio(audioFile, metadata = {}) {
    try {
      // Step 1: Transcribe audio to get basic audio content
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        response_format: 'json',
        temperature: 0.2
      });

      // Step 2: Use GPT-4 to analyze the transcription and metadata for species identification
      const analysisPrompt = `
        You are an expert wildlife bioacoustician analyzing animal vocalizations. 
        
        Audio transcription: "${transcription.text}"
        Location: ${metadata.latitude ? `${metadata.latitude}, ${metadata.longitude}` : 'Unknown'}
        Time: ${metadata.timestamp ? new Date(metadata.timestamp).toISOString() : 'Unknown'}
        
        Based on this information, provide a detailed analysis in the following JSON format:
        {
          "species": "Species name (e.g., 'American Robin')",
          "callType": "Type of call (e.g., 'territorial', 'mating', 'alarm', 'distress', 'contact')",
          "confidenceScore": 85.5,
          "behavioralInsight": "Detailed explanation of the likely behavior and context",
          "alternativeSpecies": ["Alternative species 1", "Alternative species 2"],
          "environmentalContext": "Analysis of environmental factors that might influence the call",
          "recommendations": "Suggestions for further observation or data collection"
        }
        
        Consider:
        - Geographic location and typical species in that area
        - Time of day/year and seasonal behaviors
        - Audio characteristics that indicate specific species
        - Call patterns and their behavioral meanings
        - Confidence level based on audio quality and distinctiveness
        
        Provide only the JSON response, no additional text.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert wildlife bioacoustician. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const analysisResult = JSON.parse(completion.choices[0].message.content);
      
      return {
        success: true,
        data: {
          ...analysisResult,
          transcription: transcription.text,
          processingTime: Date.now(),
          model: 'gpt-4-whisper-1'
        }
      };

    } catch (error) {
      console.error('Audio analysis error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  },

  /**
   * Generate behavioral insights for a specific species and call type
   * @param {string} species - The identified species
   * @param {string} callType - The type of call
   * @param {Object} context - Additional context (location, time, etc.)
   * @returns {Promise<Object>} Behavioral insights
   */
  async generateBehavioralInsights(species, callType, context = {}) {
    try {
      const insightPrompt = `
        Provide detailed behavioral insights for a ${species} making a ${callType} call.
        
        Context:
        - Location: ${context.location || 'Unknown'}
        - Time: ${context.time || 'Unknown'}
        - Season: ${context.season || 'Unknown'}
        
        Provide insights in JSON format:
        {
          "primaryBehavior": "Main behavior being exhibited",
          "motivation": "Why the animal is making this call",
          "socialContext": "Social implications of this vocalization",
          "environmentalFactors": "How environment might influence this behavior",
          "conservationRelevance": "What this tells us about the animal's wellbeing/habitat",
          "observationTips": "Tips for observers to better understand this behavior"
        }
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a wildlife behavior expert. Provide detailed, scientific insights in JSON format.'
          },
          {
            role: 'user',
            content: insightPrompt
          }
        ],
        temperature: 0.4,
        max_tokens: 800
      });

      return {
        success: true,
        data: JSON.parse(completion.choices[0].message.content)
      };

    } catch (error) {
      console.error('Behavioral insights error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  },

  /**
   * Validate and improve crowdsourced labels
   * @param {string} originalSpecies - AI-identified species
   * @param {string} suggestedSpecies - User-suggested species
   * @param {string} callType - Type of call
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} Validation results
   */
  async validateCrowdsourcedLabel(originalSpecies, suggestedSpecies, callType, metadata = {}) {
    try {
      const validationPrompt = `
        Evaluate a crowdsourced species identification correction:
        
        Original AI identification: ${originalSpecies}
        User suggestion: ${suggestedSpecies}
        Call type: ${callType}
        Location: ${metadata.location || 'Unknown'}
        
        Provide validation in JSON format:
        {
          "isPlausible": true/false,
          "confidence": 0.85,
          "reasoning": "Detailed explanation of why the suggestion is or isn't plausible",
          "alternativeExplanation": "If not plausible, what might explain the user's suggestion",
          "recommendedAction": "accept/reject/request_more_info",
          "additionalQuestions": ["Question 1", "Question 2"] // if more info needed
        }
        
        Consider geographic range, habitat preferences, call characteristics, and seasonal patterns.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert ornithologist validating species identifications.'
          },
          {
            role: 'user',
            content: validationPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 600
      });

      return {
        success: true,
        data: JSON.parse(completion.choices[0].message.content)
      };

    } catch (error) {
      console.error('Label validation error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }
};

// Species information service
export const speciesInfoService = {
  /**
   * Get detailed information about a species
   * @param {string} species - Species name
   * @returns {Promise<Object>} Species information
   */
  async getSpeciesInfo(species) {
    try {
      const infoPrompt = `
        Provide comprehensive information about ${species} in JSON format:
        {
          "scientificName": "Scientific name",
          "commonNames": ["Common name 1", "Common name 2"],
          "habitat": "Typical habitat description",
          "geographicRange": "Geographic distribution",
          "vocalizations": {
            "types": ["call type 1", "call type 2"],
            "descriptions": {
              "call type 1": "Description of this call type",
              "call type 2": "Description of this call type"
            }
          },
          "behavior": "General behavioral patterns",
          "conservationStatus": "Conservation status and concerns",
          "identificationTips": "Key features for identification",
          "seasonalPatterns": "Seasonal behavior and vocalization patterns"
        }
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a wildlife encyclopedia. Provide accurate, detailed species information in JSON format.'
          },
          {
            role: 'user',
            content: infoPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1200
      });

      return {
        success: true,
        data: JSON.parse(completion.choices[0].message.content)
      };

    } catch (error) {
      console.error('Species info error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }
};

// Utility functions
export const audioUtils = {
  /**
   * Check if audio file is suitable for analysis
   * @param {File} file - Audio file to check
   * @returns {Object} Validation result
   */
  validateAudioFile(file) {
    const maxSize = 25 * 1024 * 1024; // 25MB limit for OpenAI
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/ogg'];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Unsupported audio format. Please use WAV, MP3, M4A, or OGG.'
      };
    }
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Audio file too large. Maximum size is 25MB.'
      };
    }
    
    return { valid: true };
  },

  /**
   * Convert audio file to optimal format for analysis
   * @param {File} file - Original audio file
   * @returns {Promise<File>} Optimized audio file
   */
  async optimizeAudioFile(file) {
    // This would typically involve audio processing
    // For now, return the original file
    // In production, you might want to:
    // - Convert to optimal sample rate
    // - Apply noise reduction
    // - Normalize audio levels
    return file;
  }
};
