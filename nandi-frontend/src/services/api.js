// src/services/api.js
import axios from 'axios';
import { getApiBaseUrl } from '../utils/envConfig';

// Create an Axios instance with base URL for Quarkus backend
const api = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Send chat message to Quarkus backend
export const sendChatMessage = async (avatarId, message, theme = 'karma') => {
    try {
        const response = await api.post('/karma_cafe/chat', { avatarId, message, theme });
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Quest Service for SoulQuest component
export const questService = {
    getQuests: async () => {
        try {
            const response = await api.get('/soul_quest/quests');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    getQuest: async (questId) => {
        try {
            const response = await api.get(`/soul_quest/quests/${questId}`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    getProgress: async (questId) => {
        try {
            const response = await api.get(`/soul_quest/quests/${questId}/progress`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    submitAnswer: async (questId, questionId, answer) => {
        try {
            const response = await api.post(`/soul_quest/quests/${questId}/questions/${questionId}/answer`, { answer });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    completeTask: async (questId, taskId) => {
        try {
            const response = await api.post(`/soul_quest/quests/${questId}/tasks/${taskId}/complete`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    acceptQuest: async (questId) => {
        try {
            const response = await api.post(`/soul_quest/quests/${questId}/accept`);
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
            const response = await api.get('/wisdom_pets/pets');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    getPet: async (petId) => {
        try {
            const response = await api.get(`/wisdom_pets/pets/${petId}`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    interactWithPet: async (petId, action) => {
        try {
            const response = await api.post(`/wisdom_pets/pets/${petId}/interact`, { action });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    unlockPet: async (petId) => {
        try {
            const response = await api.post(`/wisdom_pets/pets/${petId}/unlock`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};