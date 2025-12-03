import React, { useState } from 'react';
import { Search, Filter, Calendar, MoreHorizontal } from 'lucide-react';
import { Project } from '../types';

const mockProjects: Project[] = [
  { id: '1', name: '2024년도 웹사이트 리뉴얼', status: 'In Progress', progress: 65, deadline: '2024-06-30', manager: '김철수', department: '개발팀' },
  { id: '2', name: '사내 보안 시스템 구축', status: 'Delayed', progress: 40, deadline: '2024-05-15', manager: '이민호', department: '인프라팀' },
  { id: '3', name: 'Q2 마케팅 캠페인', status: 'Completed', progress: 100, deadline: '2024-04-01', manager: '박지영', department: '마케팅팀' },
  { id: '4', name: '모바일 앱 V2.0 기획', status: 'Planning', progress: 15, deadline: '2024-08-20', manager: '최수진', department: '기획팀' },
  { id: '5', name: '데이터 분석 플랫폼 도입', status: 'In Progress', progress: 30, deadline: '2024-09-10', manager: '정우성', department: '데이터팀' },
];

const Projects: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      case 'Planning': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
        case 'In Progress': return '진행 중';
        case 'Completed': return '완료됨';
        case 'Delayed': return '지연됨';
        case 'Planning': return '기획 중';
        default: return status;
    }
  };

  const filteredProjects = filter === 'All' 
    ? mockProjects 
    : mockProjects.filter(p => p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">프로젝트 현황</h1>
          <p className="text-gray-500 text-sm mt-1">부서 내 진행 중인 모든 프로젝트를 모니터링합니다.</p>
        </div>
        <button className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0a355c] transition-colors">
          + 새 프로젝트
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          {['All', 'In Progress', 'Planning', 'Delayed', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status 
                ? 'bg-[#0F4C81] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'All' ? '전체' : getStatusLabel(status)}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="프로젝트명 검색..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      {/* Project Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">프로젝트명</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">담당자/부서</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">진행률</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">마감일</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{project.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-[#0F4C81]">
                            {project.manager[0]}
                        </div>
                        <div className="text-sm text-gray-600">
                            {project.manager} <span className="text-gray-400 text-xs">({project.department})</span>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-grow bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${project.status === 'Delayed' ? 'bg-red-500' : 'bg-[#00B894]'}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={14} className="mr-1.5" />
                        {project.deadline}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProjects.length === 0 && (
            <div className="p-8 text-center text-gray-500">
                해당 상태의 프로젝트가 없습니다.
            </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
