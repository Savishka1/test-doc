import api from './api';
import type { User } from '../types';
import { mockUsers, mockPasswords } from '../data/mockData';
import { config } from '../config/config';

export const userService = {
  // Get all users (HR and SuperAdmin only)
  getAllUsers: async (): Promise<User[]> => {
    if (config.USE_MOCK_DATA) {
      // Return all users except passwords
      return Promise.resolve(mockUsers.filter(u => u.isActive));
    }
    const response = await api.get('/users');
    return response.data;
  },

  // Create new user (HR and SuperAdmin only)
  createUser: async (userData: {
    name: string;
    email: string;
    username: string;
    password: string;
    role: 'Employee' | 'HR' | 'Accounts';
    employeeId: string;
  }): Promise<User> => {
    if (config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Check if username already exists
      if (mockUsers.find(u => u.username === userData.username)) {
        throw new Error('Username already exists');
      }
      
      const newUser: User = {
        id: `${Date.now()}`,
        name: userData.name,
        email: userData.email,
        username: userData.username,
        role: userData.role,
        employeeId: userData.employeeId,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      
      mockUsers.push(newUser);
      mockPasswords[userData.username] = userData.password;
      
      return Promise.resolve(newUser);
    }
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user (HR and SuperAdmin only)
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    if (config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) throw new Error('User not found');
      
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...userData,
      };
      
      return Promise.resolve(mockUsers[userIndex]);
    }
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (deactivate) (HR and SuperAdmin only)
  deleteUser: async (id: string): Promise<void> => {
    if (config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) throw new Error('User not found');
      
      // Don't allow deleting superadmin
      if (mockUsers[userIndex].role === 'SuperAdmin') {
        throw new Error('Cannot delete SuperAdmin');
      }
      
      mockUsers[userIndex].isActive = false;
      return Promise.resolve();
    }
    await api.delete(`/users/${id}`);
  },

  // Change password (all users)
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    if (config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const userData = localStorage.getItem('userData');
      if (!userData) throw new Error('Not authenticated');
      
      const user = JSON.parse(userData) as User;
      
      // Verify current password
      if (mockPasswords[user.username] !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password
      mockPasswords[user.username] = newPassword;
      return Promise.resolve();
    }
    await api.post('/users/change-password', { currentPassword, newPassword });
  },
};
