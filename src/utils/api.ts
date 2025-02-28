const API_BASE_URL = process.env.REACT_APP_API_URL + '/api' || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    code?: number;
}

export const api = {
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : '请求失败'
            };
        }
    },

    async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : '请求失败'
            };
        }
    },

    async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Upload Error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : '上传失败'
            };
        }
    }
}; 