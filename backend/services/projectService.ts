import { Repository } from '../config/store';

export const projectService = {
  async getPublicProjects() {
    return Repository.getPublicProjects();
  },

  async getAllProjects(filter?: { search?: string; status?: string; category?: string }) {
    return Repository.getAllProjects(filter);
  },

  async getProjectBySlug(slug: string) {
    return Repository.getProjectBySlug(slug);
  },

  async getProjectById(id: string) {
    return Repository.getProjectById(id);
  },

  async createProject(data: any) {
    return Repository.createProject(data);
  },

  async updateProject(id: string, data: any) {
    return Repository.updateProject(id, data);
  },

  async deleteProject(id: string) {
    return Repository.deleteProject(id);
  },
};
