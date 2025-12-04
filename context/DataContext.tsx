
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Task } from '../types';

// Initial Mock Data
const initialProjectsMock: Project[] = [
  { 
    id: '1', 
    vendor: 'ABC Tech', 
    country: '미국', 
    fatDate: '2025-06-15', 
    deliveryDate: '2025-07-01', 
    pm: '김철수', 
    processStage: '검수예정',
    healthStatus: '정상',
    managementItems: [
      { id: 'm1', productionNumber: 'P-25-001', name: '1차 BOM', manager: '이영희', deadline: '2025-03-01', warningDays: 7 },
      { id: 'm2', productionNumber: 'P-25-001', name: '도면 출도', manager: '박디자', deadline: '2025-03-15', warningDays: 7 },
      { id: 'm3', productionNumber: 'P-25-001', name: '프로그램', manager: '최개발', deadline: '2025-05-01', warningDays: 14 }
    ]
  },
  { 
    id: '2', 
    vendor: 'Samsung Heavy', 
    country: '대한민국', 
    fatDate: '2025-05-20', 
    deliveryDate: '2025-06-10', 
    pm: '박준호', 
    processStage: '검수확정',
    healthStatus: '지연',
    managementItems: [
      { id: 'm1', productionNumber: 'P-25-002', name: '1차 BOM', manager: '최수진', deadline: '2025-02-10', warningDays: 5 },
      { id: 'm2', productionNumber: 'P-25-002', name: '도면 출도', manager: '최수진', deadline: '2025-02-25', warningDays: 5 },
      { id: 'm3', productionNumber: 'P-25-002', name: '프로그램', manager: '김코딩', deadline: '2025-04-10', warningDays: 10 }
    ]
  },
  { 
    id: '3', 
    vendor: 'Tokyo Elec', 
    country: '일본', 
    fatDate: '2025-08-01', 
    deliveryDate: '2025-08-20', 
    pm: '정우성', 
    processStage: '출고확정',
    healthStatus: '완료',
    managementItems: [
      { id: 'm1', productionNumber: 'P-25-005', name: '1차 BOM', manager: '강지원', deadline: '2025-01-15', warningDays: 7 },
      { id: 'm2', productionNumber: 'P-25-005', name: '도면 출도', manager: '강지원', deadline: '2025-02-01', warningDays: 7 },
      { id: 'm3', productionNumber: 'P-25-005', name: '프로그램', manager: '이로직', deadline: '2025-06-01', warningDays: 14 }
    ]
  },
  { 
    id: '4', 
    vendor: 'Euro Systems', 
    country: '독일', 
    fatDate: '2025-09-10', 
    deliveryDate: '2025-10-01', 
    pm: '김철수', 
    processStage: '검수예정',
    healthStatus: '정상',
    managementItems: [
      { id: 'm1', productionNumber: 'P-25-010', name: '1차 BOM', manager: '박민규', deadline: '2025-05-10', warningDays: 7 },
      { id: 'm2', productionNumber: 'P-25-010', name: '도면 출도', manager: '박민규', deadline: '2025-05-25', warningDays: 7 },
      { id: 'm3', productionNumber: 'P-25-011', name: '프로그램', manager: '정시스템', deadline: '2025-07-01', warningDays: 14 }
    ]
  },
];

const initialTasksMock: Task[] = [
  { id: 't1', title: 'P-25-001 BOM 리스트 검토', assignee: '김민수', priority: 'High', status: 'todo', dueDate: '2025-03-05' },
  { id: 't2', title: 'P-25-002 FAT 시나리오 작성', assignee: '박준호', priority: 'Medium', status: 'doing', dueDate: '2025-04-22' },
  { id: 't3', title: 'P-25-005 선적 서류 준비', assignee: '이영희', priority: 'Low', status: 'done', dueDate: '2025-08-10' },
  { id: 't4', title: '신규 프로젝트 킥오프 미팅', assignee: '최수진', priority: 'High', status: 'todo', dueDate: '2025-03-01' },
  { id: 't5', title: '주간 공정 회의 자료 취합', assignee: '김철수', priority: 'Medium', status: 'doing', dueDate: '2025-03-15' },
];

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage or use Mock Data
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('projects');
      return saved ? JSON.parse(saved) : initialProjectsMock;
    } catch (e) {
      console.error('Failed to load projects from local storage', e);
      return initialProjectsMock;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('tasks');
      return saved ? JSON.parse(saved) : initialTasksMock;
    } catch (e) {
      console.error('Failed to load tasks from local storage', e);
      return initialTasksMock;
    }
  });

  // Persist to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Project Actions
  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Task Actions
  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
