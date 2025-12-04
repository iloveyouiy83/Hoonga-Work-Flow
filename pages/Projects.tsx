
import React, { useState } from 'react';
import { Search, Calendar, Edit2, Trash2, X, Save, Plus, MapPin, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Project, ProcessStage, HealthStatus } from '../types';
import { useData } from '../context/DataContext';

const Projects: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const initialFormState: Project = {
    id: '',
    vendor: '',
    country: '',
    productionNumber: '',
    pm: '',
    manager: '',
    fatDate: '',
    deliveryDate: '',
    processStage: 'Pending Inspection',
    healthStatus: 'Normal',
    bom: { deadline: '', warningDays: 7 },
    drawing: { deadline: '', warningDays: 7 },
    program: { deadline: '', warningDays: 7 },
  };
  const [formData, setFormData] = useState<Project>(initialFormState);

  // Filter Categories
  const filters: { key: string; label: string }[] = [
    { key: 'All', label: '전체' },
    { key: 'Pending Inspection', label: '검수예정' },
    { key: 'Confirmed Inspection', label: '검수확정' },
    { key: 'Inspection Completed', label: '검수완료' },
    { key: 'Confirmed Shipment', label: '출고확정' },
    { key: 'Shipment Completed', label: '출고완료' },
  ];

  // Handlers
  const handleOpenCreate = () => {
    setFormData({ ...initialFormState, id: Date.now().toString() });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setFormData(project);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 이 프로젝트를 삭제하시겠습니까?')) {
      deleteProject(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateProject(formData);
    } else {
      addProject(formData);
    }
    setIsModalOpen(false);
  };

  const getProcessLabel = (stage: string) => {
    const found = filters.find(f => f.key === stage);
    return found ? found.label : stage;
  };

  const getHealthBadge = (status: HealthStatus) => {
    switch (status) {
      case 'Normal':
        return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> 정상</span>;
      case 'Delayed':
        return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold flex items-center gap-1 w-fit"><AlertCircle size={12}/> 지연</span>;
      case 'Completed':
        return <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12}/> 완료</span>;
      default:
        return null;
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'All' || p.processStage === filter;
    const matchesSearch = p.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.pm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.productionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">프로젝트 현황</h1>
          <p className="text-gray-500 text-sm mt-1">제작 공정 및 납품 일정을 통합 관리합니다.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0a355c] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> 새 프로젝트
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.key 
                ? 'bg-[#0F4C81] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <input 
            type="text" 
            placeholder="업체명, 제작번호, 담당자..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>

      {/* Project Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">업체명</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">제작번호</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">국가</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">PM / 담당자</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">일정 (FAT/납기)</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">관리 항목 (마감일)</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">진행 단계</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">상태</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-24">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-900">{project.vendor}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">
                        {project.productionNumber}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin size={14} className="mr-1 text-gray-400" />
                      {project.country}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                        <div className="font-medium text-gray-800">PM: {project.pm}</div>
                        <div className="text-gray-500 text-xs">담당: {project.manager}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-1"><span className="text-xs text-gray-400 w-8">FAT</span> {project.fatDate}</div>
                        <div className="flex items-center gap-1 font-medium text-blue-900"><span className="text-xs text-blue-400 w-8">납기</span> {project.deliveryDate}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded border border-gray-100">
                            <div className="text-gray-500 mb-1">1차 BOM</div>
                            <div className="font-medium">{project.bom.deadline}</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded border border-gray-100">
                            <div className="text-gray-500 mb-1">도면</div>
                            <div className="font-medium">{project.drawing.deadline}</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded border border-gray-100">
                            <div className="text-gray-500 mb-1">프로그램</div>
                            <div className="font-medium">{project.program.deadline}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-700">
                      {getProcessLabel(project.processStage)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {getHealthBadge(project.healthStatus)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(project)}
                        className="p-1.5 text-gray-400 hover:text-[#0F4C81] hover:bg-blue-50 rounded transition-colors"
                        title="수정"
                      >
                          <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="삭제"
                      >
                          <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProjects.length === 0 && (
            <div className="p-12 text-center text-gray-500">
                조건에 맞는 프로젝트가 없습니다.
            </div>
        )}
      </div>

      {/* Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 animate-fade-in-up">
            <div className="bg-[#0F4C81] p-5 text-white flex justify-between items-center rounded-t-xl">
              <h2 className="text-lg font-bold">{isEditing ? '프로젝트 수정' : '새 프로젝트 등록'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-200 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">기본 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">업체명</label>
                    <input required type="text" value={formData.vendor} onChange={(e) => setFormData({...formData, vendor: e.target.value})} className="form-input" placeholder="업체명 입력" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">제작번호</label>
                    <input required type="text" value={formData.productionNumber} onChange={(e) => setFormData({...formData, productionNumber: e.target.value})} className="form-input" placeholder="P-XXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">국가</label>
                    <input required type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="form-input" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PM</label>
                        <input required type="text" value={formData.pm} onChange={(e) => setFormData({...formData, pm: e.target.value})} className="form-input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                        <input required type="text" value={formData.manager} onChange={(e) => setFormData({...formData, manager: e.target.value})} className="form-input" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">FAT 일정</label>
                        <input required type="date" value={formData.fatDate} onChange={(e) => setFormData({...formData, fatDate: e.target.value})} className="form-input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">납기일</label>
                        <input required type="date" value={formData.deliveryDate} onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})} className="form-input" />
                    </div>
                </div>
              </div>

              {/* 관리 항목 */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">관리 항목 (마감일 및 사전 경고)</h3>
                
                {/* 1차 BOM */}
                <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-4 text-sm font-medium text-gray-700 pb-2">1차 BOM</div>
                    <div className="col-span-5">
                        <label className="block text-xs text-gray-500 mb-1">마감일</label>
                        <input required type="date" value={formData.bom.deadline} onChange={(e) => setFormData({...formData, bom: {...formData.bom, deadline: e.target.value}})} className="form-input" />
                    </div>
                    <div className="col-span-3">
                        <label className="block text-xs text-gray-500 mb-1">경고(일)</label>
                        <input required type="number" min="0" value={formData.bom.warningDays} onChange={(e) => setFormData({...formData, bom: {...formData.bom, warningDays: parseInt(e.target.value)}})} className="form-input" />
                    </div>
                </div>
                
                {/* 도면 출도 */}
                <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-4 text-sm font-medium text-gray-700 pb-2">도면 출도</div>
                    <div className="col-span-5">
                        <input required type="date" value={formData.drawing.deadline} onChange={(e) => setFormData({...formData, drawing: {...formData.drawing, deadline: e.target.value}})} className="form-input" />
                    </div>
                    <div className="col-span-3">
                        <input required type="number" min="0" value={formData.drawing.warningDays} onChange={(e) => setFormData({...formData, drawing: {...formData.drawing, warningDays: parseInt(e.target.value)}})} className="form-input" />
                    </div>
                </div>

                {/* 프로그램 */}
                <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-4 text-sm font-medium text-gray-700 pb-2">프로그램</div>
                    <div className="col-span-5">
                        <input required type="date" value={formData.program.deadline} onChange={(e) => setFormData({...formData, program: {...formData.program, deadline: e.target.value}})} className="form-input" />
                    </div>
                    <div className="col-span-3">
                        <input required type="number" min="0" value={formData.program.warningDays} onChange={(e) => setFormData({...formData, program: {...formData.program, warningDays: parseInt(e.target.value)}})} className="form-input" />
                    </div>
                </div>
              </div>

              {/* 상태 설정 */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2">진행 상태</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">진행 단계</label>
                        <select 
                            value={formData.processStage}
                            onChange={(e) => setFormData({...formData, processStage: e.target.value as ProcessStage})}
                            className="form-input bg-white"
                        >
                            {filters.filter(f => f.key !== 'All').map(f => (
                                <option key={f.key} value={f.key}>{f.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">상태 표시</label>
                        <select 
                            value={formData.healthStatus}
                            onChange={(e) => setFormData({...formData, healthStatus: e.target.value as HealthStatus})}
                            className="form-input bg-white"
                        >
                            <option value="Normal">정상</option>
                            <option value="Delayed">지연</option>
                            <option value="Completed">완료</option>
                        </select>
                    </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-[#0F4C81] hover:bg-[#0a355c] rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  {isEditing ? '수정 완료' : '프로젝트 등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .form-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.2s;
        }
        .form-input:focus {
            border-color: #0F4C81;
            box-shadow: 0 0 0 2px rgba(15, 76, 129, 0.1);
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Projects;
