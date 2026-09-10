import { Repository } from '../config/store';

export const authService = {
  async findAdminByEmail(email: string) {
    return Repository.findAdminByEmail(email);
  },

  async findAdminById(id: string) {
    return Repository.findAdminById(id);
  },

  async createAdmin(email: string, passwordHash: string) {
    return Repository.createAdmin(email, passwordHash);
  },
};
