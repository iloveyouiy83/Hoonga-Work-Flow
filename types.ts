
export type ProcessStage = '검수예정' | '검수확정' | '검수완료' | '출고확정' | '출고완료';
export type HealthStatus = '정상' | '지연' | '완료';

export interface ManagementItem {
  id: string;
  productionNumber: string; // 제작번호 (항목별 관리)
  name: string; // 항목명
  manager: string; // 담당자 (항목별 관리)
  deadline: string; // 마감일
  warningDays: number; // 사전 경고일
}

export interface Project {
  id: string;
  vendor: string; // 업체명
  country: string; // 국가
  fatDate: string; // FAT
  deliveryDate: string; // 납기
  pm: string; // PM
  processStage: ProcessStage; // 진행 단계
  healthStatus: HealthStatus; // 상태 (정상/지연/완료)
  
  // 관리 항목 (동적 리스트)
  managementItems: ManagementItem[];
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
