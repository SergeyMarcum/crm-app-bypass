export interface Employee {
  id: number;
  full_name: string;
  email: string | null;
  position: string | null;
  department: string | null;
  phone: string | null;
  hire_date: string;
  status: "active" | "on_leave" | "inactive";
  status_id: string | number | null;
  manager_id: number | null;
  avatar: string | null;
}

export interface EmployeeResponse {
  employees: Employee[];
  total: number;
}
