import { Repository } from '../config/store';

export const resumeService = {
  async getLatestResume() {
    return Repository.getLatestResume();
  },

  async saveResume(data: { fileName: string; fileUrl: string; publicId?: string }) {
    return Repository.saveResume(data);
  },

  async deleteResume() {
    return Repository.deleteResume();
  },
};
