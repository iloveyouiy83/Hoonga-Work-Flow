export interface Project {
  id: string;
  name: string;
  status: 'In Progress' | 'Completed' | 'Delayed' | 'Planning';
  progress: number;
  deadline: string;
  manager: string;
  department: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'todo' | 'doing' | 'done';
  dueDate: string;
}

export interface UpdateFeed {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  avatarId: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
