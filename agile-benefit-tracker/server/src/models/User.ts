import { UserRole } from './enums';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  employee_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId: string;
}
