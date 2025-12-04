
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Task } from '../types';

// Initial Mock Data adapted for Manufacturing/Logistics
const initialProjectsMock: Project[] = [
  { 
    id: '1', 
    vendor: '현대자동차', 
    country: '대한민국', 
    productionNumber: 'P-24001',
    pm: '김철수',
    manager: '이영희',
    fatDate: '2024-06-15',
    deliveryDate: '2024-06-30',
    processStage: 'Pending Inspection',
    healthStatus: 'Normal',
    bom: { deadline: '2024-04-01', warningDays: 7 },
    drawing: { deadline: '2024-04-15', warningDays: 5 },
    program: { deadline: '2024-05-01', warningDays: 3 }
  },
  { 
    id: '2', 
    vendor: '테슬라 기가팩토리', 
    country: '미국', 
    productionNumber: 'P-24005',
    pm: '박준호',
    manager: '최수진',
    fatDate: '2024-05-10',
    deliveryDate: '2024-05-20',
    processStage: 'Inspection Completed',
    healthStatus: 'Delayed',
    bom: { deadline: '2024-03-01', warningDays: 7 },
    drawing: { deadline: '2024-03-15', warningDays: 5 },
    program: { deadline: '2024-04-01', warningDays: 3 }
  },
  { 
    id: '3', 
    vendor: 'LG에너지솔루션', 
    country: '폴란드', 
    productionNumber: 'P-23099',
    pm: '정우성',
    manager: '강지원',
    fatDate: '2024-04-01',
    deliveryDate: '2024-04-15',
    processStage: 'Confirmed Shipment',
    healthStatus: 'Completed',
    bom: { deadline: '2024-01-01', warningDays: 7 },
    drawing: { deadline: '2024-01-15', warningDays: 5 },
    program: { deadline: '2024-02-01', warningDays: 3 }
  }
];

const initialTasksMock: Task[] = [
  { id: 't1', title: 'P-24001 도면 검토', assignee: '김민수', priority: 'High', status: 'todo', dueDate: '2024-05-20' },
  { id: 't2', title: 'P-24005 PLC 프로그램 수정', assignee: '박준호', priority: 'Medium', status: 'doing', dueDate: '2024-05-22' },
  { id: 't3', title: '구매 발주 리스트 정리', assignee: '이영희', priority: 'Low', status: 'done', dueDate: '2024-05-18' },
  { id: 't4', title: 'FAT 체크리스트 작성', assignee: '최수진', priority: 'High', status: 'todo', dueDate: '2024-05-25' },
  { id: 't5', title: '주간 공정 회의 자료', assignee: '김철수', priority: 'Medium', status: 'doing', dueDate: '2024-05-21' },
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
