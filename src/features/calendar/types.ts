export interface CalendarFilter {
  status: "all" | "planned" | "pending" | "overdue" | "completed";
  objectId: number | null;
  operatorId: number | null;
}

export interface Check {
  id: number;
  objectName: string;
  startTime: string;
  status: "planned" | "pending" | "overdue" | "completed";
  operator: {
    id: number;
    fullName: string;
    avatar: string;
  };
  objectId: number;
  domain: string;
}

export interface Object {
  id: number;
  name: string;
  domain: string;
}

export interface Operator {
  id: number;
  fullName: string;
  avatar: string;
  domain: string;
}
