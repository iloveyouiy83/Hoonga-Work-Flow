import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Task } from '../types';

// Initial Mock Data
const initialProjectsMock: Project[] = [
  { id: '1', name: '2024년도 웹사이트 리뉴얼', country: '대한민국', status: 'In Progress', progress: 65, deadline: '2024-06-30', manager: '김철수', department: '개발팀' },
  { id: '2', name: '사내 보안 시스템 구축', country: '미국', status: 'Delayed', progress: 40, deadline: '2024-05-15', manager: '이민호', department: '인프라팀' },
  { id: '3', name: 'Q2 마케팅 캠페인', country: '일본', status: 'Completed', progress: 100, deadline: '2024-04-01', manager: '박지영', department: '마케팅팀' },
  { id: '4', name: '모바일 앱 V2.0 기획', country: '대한민국', status: 'Planning', progress: 15, deadline: '2024-08-20', manager: '최수진', department: '기획팀' },
  { id: '5', name: '데이터 분석 플랫폼 도입', country: '싱가포르', status: 'In Progress', progress: 30, deadline: '2024-09-10', manager: '정우성', department: '데이터팀' },
];

const initialTasksMock: Task[] = [
  { id: 't1', title: '메인 페이지 디자인 시안 리뷰', assignee: '김민수', priority: 'High', status: 'todo', dueDate: '2024-05-20' },
  { id: 't2', title: 'API 명세서 작성', assignee: '박준호', priority: 'Medium', status: 'doing', dueDate: '2024-05-22' },
  { id: 't3', title: '로고 리소스 정리', assignee: '이영희', priority: 'Low', status: 'done', dueDate: '2024-05-18' },
  { id: 't4', title: '경쟁사 분석 리포트', assignee: '최수진', priority: 'High', status: 'todo', dueDate: '2024-05-25' },
  { id: 't5', title: '주간 회의 자료 준비', assignee: '김철수', priority: 'Medium', status: 'doing', dueDate: '2024-05-21' },
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
