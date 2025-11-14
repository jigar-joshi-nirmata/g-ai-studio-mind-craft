import { DashboardStats, Topic, TopicDetail, Flashcard, ExamPreset, ProfileStats, TopicMastery, TestResult } from "../types";

// The single source of truth for the backend URL.
const API_BASE_URL = 'https://ec10e335c44e.ngrok-free.app';

// Helper function for making API requests and handling errors
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
        ...options.headers,
        'ngrok-skip-browser-warning': 'true'
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`API Error on ${endpoint}:`, {
                status: response.status,
                statusText: response.statusText,
                body: errorBody,
            });
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        
        // Handle cases where the response might be empty
        const text = await response.text();
        return text ? JSON.parse(text) : ({} as T);

    } catch (error) {
        console.error(`Failed to fetch from endpoint: ${endpoint}`, error);
        throw error;
    }
}

// --- Dashboard ---
export const getDashboardStats = (): Promise<DashboardStats> => {
    return apiFetch<DashboardStats>('/api/v1/dashboard/stats');
};

export const getRecommendedTopics = (): Promise<Topic[]> => {
    return apiFetch<Topic[]>('/api/v1/dashboard/recommendations');
};

export const getTopicDetails = (topicId: string): Promise<TopicDetail> => {
    return apiFetch<TopicDetail>(`/api/v1/topics/${topicId}/details`);
};


// --- Learn ---
export const getFlashcards = (): Promise<Flashcard[]> => {
    return apiFetch<Flashcard[]>('/api/v1/flashcards');
};


// --- Profile ---
export const getProfileStats = (): Promise<ProfileStats> => {
    return apiFetch<ProfileStats>('/api/v1/profile/stats');
};

export const getTopicMastery = (): Promise<TopicMastery[]> => {
    return apiFetch<TopicMastery[]>('/api/v1/profile/mastery');
};

// --- Test Builder ---
export const getExamPresets = (): Promise<ExamPreset[]> => {
    return apiFetch<ExamPreset[]>('/api/v1/presets');
};

// --- Test Runner ---
export const submitTest = (testId: string, answers: any): Promise<{ jobId: string }> => {
    return apiFetch<{ jobId: string }>(`/api/v1/tests/${testId}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
    });
};

export const getTestResult = (jobId: string): Promise<TestResult> => {
    // This assumes a polling mechanism. A real implementation might be more complex.
    // For now, we make a single request to a hypothetical results endpoint.
    return apiFetch<TestResult>(`/api/v1/results/${jobId}`);
};