
export type ProcessStage = 'Pending Inspection' | 'Confirmed Inspection' | 'Inspection Completed' | 'Confirmed Shipment' | 'Shipment Completed';
export type HealthStatus = 'Normal' | 'Delayed' | 'Completed';

export interface SubTask {
  deadline: string;
  warningDays: number;
}

export interface Project {
  id: string;
  vendor: string; // 업체명 (기존 name 대체)
  country: string;
  productionNumber: string; // 제작번호
  pm: string; // PM
  manager: string; // 담당자
  fatDate: string; // FAT 날짜
  deliveryDate: string; // 납기 날짜
  processStage: ProcessStage; // 진행 단계 (필터링용)
  healthStatus: HealthStatus; // 상태 (정상/지연/완료)
  
  // 관리 항목
  bom: SubTask;
  drawing: SubTask;
  program: SubTask;
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
