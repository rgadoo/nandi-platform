import axios from 'axios';
import { chatService, axiosInstance } from '../api';
import { ERROR_MESSAGES } from '../../utils/errorHandling';

// Mock axios
jest.mock('axios', () => {
    return {
        create: jest.fn(() => ({
            post: jest.fn(),
            interceptors: {
                response: {
                    use: jest.fn()
                }
            }
        }))
    };
});

describe('Chat Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateResponse', () => {
        const mockMessage = "Hello";
        const mockPersona = "karma";
        const mockSessionId = "test-session-123";
        const mockContext = [];

        it('should successfully generate a chat response', async () => {
            const mockResponse = {
                data: {
                    id: "response-123",
                    message: "Hello back!",
                    timestamp: "2024-03-21T12:00:00Z",
                    quality_score: 8,
                    score_reason: "Good engagement"
                }
            };

            axiosInstance.post.mockResolvedValueOnce(mockResponse);

            const result = await chatService.generateResponse(
                mockMessage,
                mockPersona,
                mockSessionId,
                mockContext
            );

            expect(result).toEqual(mockResponse.data);
            expect(axiosInstance.post).toHaveBeenCalledWith('/chat/generate', {
                message: mockMessage,
                persona: mockPersona,
                session_id: mockSessionId,
                context: mockContext
            });
        });

        it('should handle network errors', async () => {
            const networkError = new Error('Network Error');
            axiosInstance.post.mockRejectedValueOnce(networkError);

            await expect(
                chatService.generateResponse(mockMessage, mockPersona, mockSessionId, mockContext)
            ).rejects.toThrow(ERROR_MESSAGES.NETWORK);
        });

        it('should handle server errors', async () => {
            const serverError = {
                response: {
                    status: 500,
                    data: { message: "Server error occurred" }
                }
            };
            axiosInstance.post.mockRejectedValueOnce(serverError);

            await expect(
                chatService.generateResponse(mockMessage, mockPersona, mockSessionId, mockContext)
            ).rejects.toThrow("Server error occurred");
        });
    });

    describe('calculateSessionMetrics', () => {
        const mockPersona = "karma";
        const mockDuration = 300;
        const mockMessageCount = 10;

        it('should successfully calculate session metrics', async () => {
            const mockResponse = {
                data: {
                    points: 100,
                    breakdown: {
                        quality: 50,
                        duration: 25,
                        engagement: 25
                    }
                }
            };

            axiosInstance.post.mockResolvedValueOnce(mockResponse);

            const result = await chatService.calculateSessionMetrics(
                mockPersona,
                mockDuration,
                mockMessageCount
            );

            expect(result).toEqual(mockResponse.data);
            expect(axiosInstance.post).toHaveBeenCalledWith('/session/metrics', {
                persona: mockPersona,
                durationSeconds: mockDuration,
                messageCount: mockMessageCount
            });
        });

        it('should handle validation errors', async () => {
            const validationError = {
                response: {
                    status: 422,
                    data: { message: "Invalid input parameters" }
                }
            };
            axiosInstance.post.mockRejectedValueOnce(validationError);

            await expect(
                chatService.calculateSessionMetrics(mockPersona, mockDuration, mockMessageCount)
            ).rejects.toThrow("Invalid input parameters");
        });
    });
}); 