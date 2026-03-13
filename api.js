const API_BASE = 'https://angel-back-ongr.onrender.com';

class Api {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                ...options.headers
            },
            ...options
        };

        if (this.token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        const response = await fetch(url, config);
        return await response.json();
    }

    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(name, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
    }

    async getDashboard() {
        return this.request('/dashboard');
    }

    async getCourse(courseId) {
        const cleanId = courseId.replace('crs_', '');
        return this.request(`/courses/${cleanId}`);
    }

    async getLesson(lessonId) {
        const cleanId = lessonId.replace('les_', '');
        return this.request(`/lessons/${cleanId}`);
    }

    async getProfile(userId) {
        const cleanId = userId.replace('usr_', '');
        return this.request(`/profile/${cleanId}`);
    }

    async updateProfile(userId, data) {
        const cleanId = userId.replace('usr_', '');
        return this.request(`/profile/${cleanId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async uploadAvatar(userId, file) {
        const cleanId = userId.replace('usr_', '');
        const formData = new FormData();
        formData.append('avatar', file);
        return this.request(`/profile/${cleanId}/avatar`, {
            method: 'POST',
            body: formData,
            headers: {
                'ngrok-skip-browser-warning': 'true',
                Authorization: this.token ? `Bearer ${this.token}` : undefined
            }
        });
    }

    async getCategories() {
        return this.request('/courses/categories');
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    setToken(token, user) {
        this.token = token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }
}


const api = new Api();
