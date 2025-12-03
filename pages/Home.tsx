import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, AlertCircle, PlusCircle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UpdateFeed } from '../types';

const updates: UpdateFeed[] = [
  { id: '1', user: '김민수', action: '완료', target: 'Q3 마케팅 기획안', time: '10분 전', avatarId: 10 },
  { id: '2', user: '이영희', action: '업데이트', target: '디자인 시스템 v2.0', time: '1시간 전', avatarId: 23 },
  { id: '3', user: '박준호', action: '이슈 등록', target: '서버 마이그레이션', time: '3시간 전', avatarId: 45 },
  { id: '4', user: '최수진', action: '검토 요청', target: '모바일 앱 UI', time: '4시간 전', avatarId: 12 },
  { id: '5', user: '정우성', action: '댓글 작성', target: '주간 보고서', time: '5시간 전', avatarId: 33 },
  { id: '6', user: '강지원', action: '파일 업로드', target: '기획서 초안', time: '6시간 전', avatarId: 15 },
];

const chartData = [
  { name: '기획', count: 12 },
  { name: '디자인', count: 8 },
  { name: '개발', count: 15 },
  { name: '테스트', count: 6 },
  { name: '완료', count: 24 },
];

const COLORS = ['#94a3b8', '#60a5fa', '#0F4C81', '#fbbf24', '#00B894'];

const Home: React.FC = () => {
  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 shrink-0">
        <div className="absolute inset-0 z-0">
            <img 
                src="https://picsum.photos/seed/dashboard_bg/1200/400" 
                alt="Background" 
                className="w-full h-full object-cover opacity-10"
            />
             <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C81]/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-8 md:p-12 text-white max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            스마트한 협업, 투명한 업무 공유
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            실시간으로 공유되는 프로젝트 진행 상황을 확인하고,<br />
            나의 업무를 효율적으로 관리하세요.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/tasks" className="bg-[#00B894] hover:bg-[#00a383] text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors shadow-lg">
              내 업무 확인하기 <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/projects" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-lg font-semibold transition-colors">
              전체 프로젝트 현황
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Grid - Fixed height on desktop to enforce internal scrolling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[500px]">
        {/* Stats Chart */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-lg font-bold text-gray-800">부서별 업무 현황</h2>
                <select className="text-sm border-gray-200 border rounded-md p-1 bg-gray-50 text-gray-600">
                    <option>이번 주</option>
                    <option>지난 주</option>
                </select>
            </div>
            {/* Flex-1 allows chart to fill remaining height of the 500px container */}
            <div className="w-full flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Quick Actions & Recent */}
        <div className="flex flex-col gap-6 h-full min-h-0">
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 shrink-0">
                <h2 className="text-lg font-bold text-gray-800 mb-4">빠른 실행</h2>
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-[#0F4C81]">
                        <PlusCircle size={24} className="mb-2" />
                        <span className="text-sm font-medium">새 업무 등록</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors text-[#00B894]">
                        <FileText size={24} className="mb-2" />
                        <span className="text-sm font-medium">주간 보고</span>
                    </button>
                </div>
            </div>

            {/* Recent Updates Feed */}
            {/* min-h-0 and flex-1 are crucial for nested scrolling within a flex container */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
                <h2 className="text-lg font-bold text-gray-800 mb-4 shrink-0">최근 업데이트</h2>
                <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar flex-1">
                    {updates.map((update) => (
                        <div key={update.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                            <img 
                                src={`https://picsum.photos/seed/${update.avatarId}/32/32`} 
                                alt={update.user} 
                                className="w-8 h-8 rounded-full shrink-0"
                            />
                            <div>
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold">{update.user}</span>님이 <span className="font-medium text-[#0F4C81]">{update.target}</span>을(를) {update.action}했습니다.
                                </p>
                                <span className="text-xs text-gray-400 flex items-center mt-1">
                                    <Clock size={12} className="mr-1" /> {update.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;