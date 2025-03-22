// src/services/api.js
import axios from 'axios';
import { getApiConfig } from '../utils/envConfig';
import { formatApiError } from '../utils/errorHandling';

// Get API configuration
const apiConfig = getApiConfig();

// Create an Axios instance with configuration
export const axiosInstance = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: apiConfig.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for common error handling
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Log the error for debugging
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });
        
        return Promise.reject(error);
    }
);

/**
 * Chat service for handling chat-related API calls
 */
export const chatService = {
    /**
     * Generate a chat response
     * @param {string} message - User's message
     * @param {string} persona - Chat persona (karma/dharma/atma)
     * @param {string} sessionId - Current session ID
     * @param {Array} context - Previous messages context
     * @returns {Promise} Chat response
     */
    generateResponse: async (message, persona, sessionId, context = []) => {
        try {
            const response = await axiosInstance.post('/chat/generate', {
                message,
                persona,
                session_id: sessionId,
                context
            });
            return response.data;
        } catch (error) {
            console.error('Chat Generation Error:', error);
            throw new Error(formatApiError(error));
        }
    },

    /**
     * Calculate session metrics
     * @param {string} persona - Chat persona
     * @param {number} durationSeconds - Session duration in seconds
     * @param {number} messageCount - Number of messages in session
     * @returns {Promise} Session metrics response
     */
    calculateSessionMetrics: async (persona, durationSeconds, messageCount) => {
        try {
            const response = await axiosInstance.post('/session/metrics', {
                persona,
                durationSeconds,
                messageCount
            });
            return response.data;
        } catch (error) {
            console.error('Session Metrics Error:', error);
            throw new Error(formatApiError(error));
        }
    }
};

export default chatService;

// Quest Service for SoulQuest component
export const questService = {
    getQuests: async () => {
        try {
            const response = await axiosInstance.get('/soul_quest/quests');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    getQuest: async (questId) => {
        try {
            const response = await axiosInstance.get(`/soul_quest/quests/${questId}`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    getProgress: async (questId) => {
        try {
            const response = await axiosInstance.get(`/soul_quest/quests/${questId}/progress`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    submitAnswer: async (questId, questionId, answer) => {
        try {
            const response = await axiosInstance.post(`/soul_quest/quests/${questId}/questions/${questionId}/answer`, { answer });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    completeTask: async (questId, taskId) => {
        try {
            const response = await axiosInstance.post(`/soul_quest/quests/${questId}/tasks/${taskId}/complete`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    acceptQuest: async (questId) => {
        try {
            const response = await axiosInstance.post(`/soul_quest/quests/${questId}/accept`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

// Pets Service for WisdomPets component
export const petsService = {
    getPets: async () => {
        try {
            const response = await axiosInstance.get('/wisdom_pets/pets');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    getPet: async (petId) => {
        try {
            const response = await axiosInstance.get(`/wisdom_pets/pets/${petId}`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    interactWithPet: async (petId, action) => {
        try {
            const response = await axiosInstance.post(`/wisdom_pets/pets/${petId}/interact`, { action });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    unlockPet: async (petId) => {
        try {
            const response = await axiosInstance.post(`/wisdom_pets/pets/${petId}/unlock`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};