const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  getToken() {
    return localStorage.getItem('learningpath_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('learningpath_token', token);
    } else {
      localStorage.removeItem('learningpath_token');
    }
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (response.status === 401) {
        // Clear token on unauthorized
        this.setToken(null);
        window.dispatchEvent(new Event('auth-unauthorized'));
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'An error occurred during API request.');
      }
      return data;
    } catch (err) {
      console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
      throw err;
    }
  }

  // Auth
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async register(payload) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setToken(data.access_token);
    return data;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  // Employee & Onboarding
  async getProfile() {
    return await this.request('/employees/profile');
  }

  async updateProfile(updates) {
    return await this.request('/employees/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async submitOnboarding(payload) {
    return await this.request('/employees/onboarding', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Skills
  async analyzeSkills(targetRole) {
    const query = targetRole ? `?target_role=${encodeURIComponent(targetRole)}` : '';
    return await this.request(`/skills/analyze${query}`, { method: 'POST' });
  }

  async getSkillGaps() {
    return await this.request('/skills/gaps');
  }

  async getSkillObsolescence() {
    return await this.request('/skills/obsolescence');
  }

  async getFutureRadar() {
    return await this.request('/skills/radar');
  }

  // Roadmap
  async getCurrentRoadmap() {
    return await this.request('/roadmap/current');
  }

  async generateRoadmap(targetRole, forceNew = false) {
    const query = `?force_new=${forceNew}${targetRole ? `&target_role=${encodeURIComponent(targetRole)}` : ''}`;
    return await this.request(`/roadmap/generate${query}`, { method: 'POST' });
  }

  async updateMilestoneProgress(roadmapId, weekNumber, status) {
    return await this.request('/roadmap/progress', {
      method: 'PUT',
      body: JSON.stringify({ roadmap_id: roadmapId, week_number: weekNumber, status }),
    });
  }

  async getRoadmapHistory() {
    return await this.request('/roadmap/history');
  }

  async getRoadmapEvolution(targetRole) {
    const query = targetRole ? `?target_role=${encodeURIComponent(targetRole)}` : '';
    return await this.request(`/roadmap/evolution${query}`);
  }

  // Industry Intelligence (Firecrawl)
  async getIndustryTrends(role) {
    const query = role ? `?role=${encodeURIComponent(role)}` : '';
    return await this.request(`/industry/trends${query}`);
  }

  async refreshIndustryIntelligence() {
    return await this.request('/industry/refresh', { method: 'POST' });
  }

  async searchIndustry(query) {
    return await this.request('/industry/search', {
      method: 'POST',
      body: JSON.stringify({ query, limit: 5 }),
    });
  }

  // Memory (Memento)
  async getMemoryHistory(type, query) {
    const params = new URLSearchParams();
    if (type) params.append('memory_type', type);
    if (query) params.append('query', query);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/memory/history${qs}`);
  }

  async storeMemory(payload) {
    return await this.request('/memory/store', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async deleteMemory(memoryId) {
    return await this.request(`/memory/${memoryId}`, { method: 'DELETE' });
  }

  async clearAllMemories() {
    return await this.request('/memory/all', { method: 'DELETE' });
  }

  // Chatbot (AI Mentor)
  async sendChatMessage(message, history = []) {
    return await this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  }

  // Analytics
  async getDashboardAnalytics() {
    return await this.request('/analytics/dashboard');
  }

  async getProgressAnalytics() {
    return await this.request('/analytics/progress');
  }

  // Career Simulator
  async simulateCareerTransitions() {
    return await this.request('/career/simulate');
  }

  // Workforce Digital Twin
  async getDigitalTwinProfile() {
    return await this.request('/digital-twin/profile');
  }

  async getDigitalTwinSkills() {
    return await this.request('/digital-twin/skills');
  }

  async getDigitalTwinHistory() {
    return await this.request('/digital-twin/history');
  }

  async getDigitalTwinReadiness() {
    return await this.request('/digital-twin/readiness');
  }

  async updateDigitalTwin(payload) {
    return await this.request('/digital-twin/update', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async simulateWhatIfScenario(payload) {
    return await this.request('/digital-twin/simulate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // HR Management
  async getHRDashboard() {
    return await this.request('/hr/dashboard');
  }

  async getHREmployees() {
    return await this.request('/hr/employees');
  }

  async recommendHRProgram(payload) {
    return await this.request('/hr/recommend', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getWorkforceDigitalTwin(department = 'ALL') {
    const query = department ? `?department=${encodeURIComponent(department)}` : '';
    return await this.request(`/hr/workforce-digital-twin${query}`);
  }

  async getWorkforceSkillGaps() {
    return await this.request('/hr/workforce-skill-gaps');
  }

  async getDepartmentHeatmap() {
    return await this.request('/hr/department-heatmap');
  }

  // Health
  async getHealth() {
    return await this.request('/health');
  }
}

export const api = new ApiService();
