export interface User {
  id: number;
  full_name: string | null;
  company: string | null;
  email: string | null;
  role_id: number;
  status_id: number | null;
  domain: string;
  position: string | null;
  name: string;
  department: string | null;
  phone: string | null;
}

export interface UserResponse {
  users: User[];
  departments: string[];
}
