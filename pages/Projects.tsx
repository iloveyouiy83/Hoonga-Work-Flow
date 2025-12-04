
import React, { useState } from 'react';
import { Search, Calendar, Edit2, Trash2, X, Save, Plus, MapPin, AlertTriangle, AlertCircle, CheckCircle, MinusCircle } from 'lucide-react';
import { Project, ProcessStage, HealthStatus, ManagementItem } from '../types';
import { useData } from '../context/DataContext';

const Projects: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];

  // Form State
  const initialFormState: Project = {
    id: '',
    vendor: '',
    country: '',
    fatDate: today,
    deliveryDate: today,
    pm: '',
    processStage: '검수예정',
    healthStatus: '정상',
    managementItems: [
        { id: Date.now().toString() + '-1', productionNumber: '', name: '1차 BOM', manager: '', deadline: today, warningDays: 7 },
        { id: Date.now().toString() + '-2', productionNumber: '', name: '도면 출도', manager: '', deadline: today, warningDays: 7 },
        { id: Date.now().toString() + '-3', productionNumber: '', name: '프로그램', manager: '', deadline: today, warningDays: 14 }
    ]
  };
  const [formData, setFormData] = useState<Project>(initialFormState);

  // Handlers
  const handleOpenCreate = () => {
    setFormData({ 
        ...initialFormState, 
        id: Date.now().toString(),
        managementItems: [
            { id: Date.now().toString() + '-1', productionNumber: '', name: '1차 BOM', manager: '', deadline: today, warningDays: 7 },
            { id: Date.now().toString() + '-2', productionNumber: '', name: '도면 출도', manager: '', deadline: today, warningDays: 7 },
            { id: Date.now().toString() + '-3', productionNumber: '', name: '프로그램', manager: '', deadline: today, warningDays: 14 }
        ]
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setFormData(JSON.parse(JSON.stringify(project))); // Deep copy for editing
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

  // Management Item Handlers
  const addManagementItem = () => {
    const newItem: ManagementItem = {
      id: Date.now().toString(),
      productionNumber: '',
      name: '',
      manager: '',
      deadline: today,
      warningDays: 7
    };
    setFormData({
      ...formData,
      managementItems: [...formData.managementItems, newItem]
    });
  };

  const removeManagementItem = (itemId: string) => {
    setFormData({
      ...formData,
      managementItems: formData.managementItems.filter(item => item.id !== itemId)
    });
  };

  const updateManagementItem = (itemId: string, field: keyof ManagementItem, value: any) => {
    setFormData({
      ...formData,
      managementItems: formData.managementItems.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    });
  };

  // Helper function to check deadline status
  const getDeadlineStatus = (deadlineStr: string, warningDays: number) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    // Reset time parts for accurate day comparison
    now.setHours(0,0,0,0);
    deadline.setHours(0,0,0,0);

    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays <= warningDays) return 'warning';
    return 'normal';
  };

  const ManagementItemDisplay = ({ item }: { item: ManagementItem }) => {
    const status = getDeadlineStatus(item.deadline, item.warningDays);
    
    let colorClass = 'bg-gray-50 text-gray-500 border-gray-100';
    let icon = null;

    if (status === 'overdue') {
      colorClass = 'bg-red-50 text-red-600 border-red-100';
      icon = <span title="Overdue"><AlertTriangle size={12} className="text-red-500" /></span>;
    } else if (status === 'warning') {
      colorClass = 'bg-orange-50 text-orange-600 border-orange-100';
      icon = <span title="Warning"><AlertCircle size={12} className="text-orange-500" /></span>;
    } else {
      colorClass = 'bg-emerald-50 text-emerald-600 border-emerald-100';
      icon = <span title="Normal"><CheckCircle size={12} className="text-emerald-500" /></span>;
    }

    return (
      <div className={`flex items-center gap-2 p-1.5 rounded text-xs border mb-1 last:mb-0 ${colorClass}`}>
        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-2 truncate">
          {item.productionNumber && (
             <span className="font-bold text-gray-700 bg-white/50 px-1 rounded text-[10px]">[{item.productionNumber}]</span>
          )}
          <span className="font-medium truncate" title={item.name}>{item.name}</span>
          {item.manager && (
             <span className="text-gray-400 text-[10px]">({item.manager})</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
            {icon}
            <span className="font-mono text-[10px]">{item.deadline.substring(5)}</span>
        </div>
      </div>
    );
  };

  const getHealthColor = (status: HealthStatus) => {
    switch (status) {
      case '정상': return 'bg-emerald-100 text-emerald-800';
      case '지연': return 'bg-red-100 text-red-800';
      case '완료': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'All' || p.processStage === filter;
    
    const term = searchTerm.toLowerCase();
    const matchesVendor = p.vendor.toLowerCase().includes(term);
    const matchesPm = p.pm.toLowerCase().includes(term);
    const matchesItems = p.managementItems.some(item => 
        item.productionNumber.toLowerCase().includes(term) ||
        item.manager.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term)
    );

    return matchesFilter && (matchesVendor || matchesPm || matchesItems);
  });

  const stages: ProcessStage[] = ['검수예정', '검수확정', '검수완료', '출고확정', '출고완료'];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">프로젝트 현황</h1>
          <p className="text-gray-500 text-sm mt-1">제조 공정 및 납품 일정을 상세 관리합니다.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0a355c] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> 새 프로젝트
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 w-full xl:w-auto">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === 'All' ? 'bg-[#0F4C81] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setFilter(stage)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === stage ? 'bg-[#0F4C81] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
        <div className="relative w-full xl:w-72">
          <input 
            type="text" 
            placeholder="업체, PM, 제작번호, 담당자 검색..." 
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
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">업체명 / 국가</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">일정 (FAT / 납기)</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">PM</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[35%]">관리 항목 (제작번호/담당자/마감)</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">진행 단계</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[8%]">상태</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-[7%]">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 align-top">
                    <div className="font-bold text-gray-900 text-sm">{project.vendor}</div>
                    <div className="flex items-center text-gray-500 text-xs mt-1">
                      <MapPin size={12} className="mr-1" />
                      {project.country}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center"><span className="w-8 font-semibold text-gray-400">FAT</span> {project.fatDate}</div>
                      <div className="flex items-center"><span className="w-8 font-semibold text-[#0F4C81]">납기</span> {project.deliveryDate}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="text-sm text-gray-800 font-medium">
                       {project.pm}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      {project.managementItems.map((item) => (
                        <ManagementItemDisplay key={item.id} item={item} />
                      ))}
                      {project.managementItems.length === 0 && <span className="text-xs text-gray-400">-</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {project.processStage}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthColor(project.healthStatus)}`}>
                      {project.healthStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top text-center">
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
            <div className="p-8 text-center text-gray-500">
                검색 결과가 없습니다.
            </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
            <div className="bg-[#0F4C81] p-5 text-white flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold">{isEditing ? '프로젝트 수정' : '새 프로젝트 등록'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-200 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              
              {/* Top Section: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Row 1 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">업체명</label>
                        <input required type="text" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0F4C81] outline-none transition-colors" />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">국가</label>
                        <input required type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0F4C81] outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Calendar size={12}/> FAT</label>
                        <input required type="date" value={formData.fatDate} onChange={e => setFormData({...formData, fatDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0F4C81] outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Calendar size={12}/> 납기</label>
                        <input required type="date" value={formData.deliveryDate} onChange={e => setFormData({...formData, deliveryDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0F4C81] outline-none text-[#0F4C81] font-semibold transition-colors" />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-3 gap-4 md:col-span-2">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">PM</label>
                        <input required type="text" value={formData.pm} onChange={e => setFormData({...formData, pm: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0F4C81] outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">진행 단계</label>
                        <select value={formData.processStage} onChange={e => setFormData({...formData, processStage: e.target.value as ProcessStage})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#0F4C81] outline-none transition-colors">
                            {stages.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">상태</label>
                        <select value={formData.healthStatus} onChange={e => setFormData({...formData, healthStatus: e.target.value as HealthStatus})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#0F4C81] outline-none transition-colors">
                            <option value="정상">정상</option>
                            <option value="지연">지연</option>
                            <option value="완료">완료</option>
                        </select>
                    </div>
                  </div>
              </div>

              {/* Management Items (Dynamic List) */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-800">관리 항목 상세 설정</h3>
                    <button 
                        type="button" 
                        onClick={addManagementItem}
                        className="text-xs flex items-center gap-1 text-[#0F4C81] hover:text-[#0a355c] font-medium bg-blue-50 px-2 py-1 rounded"
                    >
                        <Plus size={14} /> 항목 추가
                    </button>
                </div>
                
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {formData.managementItems.length === 0 && (
                      <div className="text-center text-xs text-gray-400 py-2">
                          등록된 관리 항목이 없습니다. '+ 항목 추가' 버튼을 눌러주세요.
                      </div>
                  )}
                  {formData.managementItems.map((item, index) => (
                    <div key={item.id} className="flex flex-col md:flex-row items-end md:items-center gap-2 animate-fade-in-up bg-white p-2 rounded shadow-sm border border-gray-100">
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full">
                        {/* 1. Production Number */}
                        <div>
                            {index === 0 && <label className="block text-[10px] text-gray-500 mb-1">제작번호</label>}
                            <input 
                                required 
                                type="text" 
                                value={item.productionNumber} 
                                onChange={e => updateManagementItem(item.id, 'productionNumber', e.target.value)} 
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0F4C81] outline-none" 
                                placeholder="P-25-001"
                            />
                        </div>
                        {/* 2. Item Name */}
                        <div>
                            {index === 0 && <label className="block text-[10px] text-gray-500 mb-1">항목명</label>}
                            <input 
                                required 
                                type="text" 
                                value={item.name} 
                                onChange={e => updateManagementItem(item.id, 'name', e.target.value)} 
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0F4C81] outline-none" 
                                placeholder="BOM, 도면 등"
                            />
                        </div>
                        {/* 3. Manager */}
                        <div>
                            {index === 0 && <label className="block text-[10px] text-gray-500 mb-1">담당자</label>}
                            <input 
                                required 
                                type="text" 
                                value={item.manager} 
                                onChange={e => updateManagementItem(item.id, 'manager', e.target.value)} 
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0F4C81] outline-none" 
                                placeholder="이름"
                            />
                        </div>
                         {/* 4. Deadline */}
                        <div>
                            {index === 0 && <label className="block text-[10px] text-gray-500 mb-1">마감일</label>}
                            <input 
                                required 
                                type="date" 
                                value={item.deadline} 
                                onChange={e => updateManagementItem(item.id, 'deadline', e.target.value)} 
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0F4C81] outline-none" 
                            />
                        </div>
                         {/* 5. Warning Days */}
                        <div>
                             {index === 0 && <label className="block text-[10px] text-gray-500 mb-1">사전경고(일)</label>}
                             <input 
                                required 
                                type="number" 
                                min="0" 
                                value={item.warningDays} 
                                onChange={e => updateManagementItem(item.id, 'warningDays', parseInt(e.target.value))} 
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0F4C81] outline-none" 
                             />
                        </div>
                      </div>

                      <div className="shrink-0 pb-1.5">
                         {index === 0 && <label className="hidden md:block text-[10px] text-transparent mb-1">삭제</label>}
                         <button 
                            type="button"
                            onClick={() => removeManagementItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                         >
                             <MinusCircle size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 shrink-0 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-[#0F4C81] hover:bg-[#0a355c] rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Save size={16} />
                  {isEditing ? '수정 완료' : '프로젝트 등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
