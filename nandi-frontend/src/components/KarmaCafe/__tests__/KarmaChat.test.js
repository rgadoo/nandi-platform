import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import KarmaChat from '../KarmaChat';
import { chatService } from '../../../services/api';
import { ERROR_MESSAGES } from '../../../utils/errorHandling';

// Mock the chatService
jest.mock('../../../services/api', () => ({
  chatService: {
    generateResponse: jest.fn(),
    calculateSessionMetrics: jest.fn()
  }
}));

// Mock uuid for consistent keys
let mockUuidCounter = 0;
jest.mock('uuid', () => ({
  v4: () => `test-uuid-${mockUuidCounter++}`
}));

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('KarmaChat Component', () => {
  beforeEach(() => {
    mockUuidCounter = 0; // Reset counter before each test
    jest.clearAllMocks();
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2024-01-01T09:56:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial welcome message', () => {
    render(<KarmaChat />);
    expect(screen.getByText(/Welcome to KarmaCafe/)).toBeInTheDocument();
  });

  it('renders different persona welcome message', () => {
    render(<KarmaChat persona="Zen" />);
    expect(screen.getByText(/Welcome to KarmaCafe/)).toBeInTheDocument();
  });

  it('shows points display with initial zero points', () => {
    render(<KarmaChat />);
    expect(screen.getByText('0 points')).toBeInTheDocument();
  });

  it('allows user input and displays messages', async () => {
    render(<KarmaChat />);
    const input = screen.getByPlaceholderText('Ask a question...');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(form);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Network error occurred';
    chatService.generateResponse.mockRejectedValueOnce(new Error(errorMessage));

    render(<KarmaChat />);
    const input = screen.getByPlaceholderText('Ask a question...');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(form);

    // Wait for the error message in the chat messages
    await waitFor(() => {
      const errorMessages = screen.getAllByText(errorMessage);
      // We expect two instances: one in the error banner and one in the chat
      expect(errorMessages).toHaveLength(2);
    });
  });

  it('updates points after successful response', async () => {
    const mockResponse = {
      response: 'Test AI response',
      points: 10,
      qualityScore: 8
    };

    chatService.generateResponse.mockResolvedValueOnce(mockResponse);
    chatService.calculateSessionMetrics.mockResolvedValueOnce({ totalPoints: 100 });

    render(<KarmaChat />);
    const input = screen.getByPlaceholderText('Ask a question...');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('100 points')).toBeInTheDocument();
      expect(screen.getByText('Test AI response')).toBeInTheDocument();
    });
  });

  it('displays quality score badge', async () => {
    const mockResponse = {
      response: 'Test AI response',
      points: 10,
      qualityScore: 8
    };

    chatService.generateResponse.mockResolvedValueOnce(mockResponse);
    
    render(<KarmaChat />);
    const input = screen.getByPlaceholderText('Ask a question...');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Quality: 8/10')).toBeInTheDocument();
      expect(screen.getByText('+10 pts')).toBeInTheDocument();
    });
  });

  it('disables input while loading', async () => {
    const mockResponse = {
      response: 'Test AI response',
      points: 10,
      qualityScore: 8
    };

    // Create a promise that we can resolve manually
    let resolveResponse;
    const responsePromise = new Promise(resolve => {
      resolveResponse = () => resolve(mockResponse);
    });

    chatService.generateResponse.mockReturnValueOnce(responsePromise);
    chatService.calculateSessionMetrics.mockResolvedValueOnce({ totalPoints: 100 });
    
    render(<KarmaChat />);
    const input = screen.getByPlaceholderText('Ask a question...');
    const sendButton = screen.getByRole('button');
    const form = screen.getByRole('form');

    // Submit the form
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.submit(form);
    });

    // Verify inputs are disabled while loading
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();

    // Resolve the response
    await act(async () => {
      resolveResponse();
      await responsePromise;
    });

    // Wait for loading state to be cleared
    await waitFor(() => {
      expect(input).not.toBeDisabled();
      expect(sendButton).toBeDisabled(); // Should be disabled because input is empty
    });

    // Verify we can enable the button by adding input
    await act(async () => {
      fireEvent.change(input, { target: { value: 'New message' } });
    });

    expect(sendButton).not.toBeDisabled();
  });
}); 