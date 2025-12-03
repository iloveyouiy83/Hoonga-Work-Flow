import React, { useState } from 'react';
import { Send, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

const Support: React.FC = () => {
  const [formState, setFormState] = useState({
    title: '',
    type: 'technical',
    priority: 'normal',
    content: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
        setIsSubmitted(true);
    }, 800);
  };

  if (isSubmitted) {
      return (
          <div className="max-w-2xl mx-auto py-20 text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">지원 요청이 접수되었습니다.</h2>
              <p className="text-gray-600 mb-8">담당 매니저가 내용을 확인 후 24시간 이내에 메신저로 연락드리겠습니다.</p>
              <button 
                onClick={() => {
                    setIsSubmitted(false);
                    setFormState({ title: '', type: 'technical', priority: 'normal', content: '' });
                }}
                className="text-[#0F4C81] font-medium hover:underline"
              >
                새로운 요청 작성하기
              </button>
          </div>
      )
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Sidebar Info */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <HelpCircle size={18} className="text-[#00B894]" />
                도움이 필요하신가요?
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                업무 수행 중 발생하는 기술적인 문제나 리소스 지원이 필요한 경우 요청서를 작성해주세요.
            </p>
            <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 mb-1">긴급 연락처</p>
                <p className="font-bold text-gray-800">02-1234-5678 (운영팀)</p>
            </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-[#0F4C81] mb-2 text-sm">작성 가이드</h3>
            <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4">
                <li>이슈 발생 상황을 상세히 기술해주세요.</li>
                <li>스크린샷이 있다면 링크로 첨부해주세요.</li>
                <li>긴급한 건은 '우선순위: 높음'을 선택하세요.</li>
            </ul>
        </div>
      </div>

      {/* Main Form */}
      <div className="md:col-span-2">
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">업무 지원 요청</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                    <input 
                        required
                        type="text" 
                        value={formState.title}
                        onChange={(e) => setFormState({...formState, title: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                        placeholder="요청 사항을 요약해주세요"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">요청 유형</label>
                        <select 
                            value={formState.type}
                            onChange={(e) => setFormState({...formState, type: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] outline-none bg-white"
                        >
                            <option value="technical">시스템/기술 지원</option>
                            <option value="resource">인력/리소스 지원</option>
                            <option value="access">권한 요청</option>
                            <option value="etc">기타 문의</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                        <select 
                            value={formState.priority}
                            onChange={(e) => setFormState({...formState, priority: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F4C81] outline-none bg-white"
                        >
                            <option value="low">낮음 (여유 있음)</option>
                            <option value="normal">보통 (일반적)</option>
                            <option value="high">높음 (긴급)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">상세 내용</label>
                    <textarea 
                        required
                        value={formState.content}
                        onChange={(e) => setFormState({...formState, content: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg h-32 resize-none focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all"
                        placeholder="구체적인 내용을 작성해주세요..."
                    ></textarea>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
                    <div className="text-xs text-gray-500 flex items-center">
                        <AlertTriangle size={14} className="mr-1 text-orange-400" />
                        제출 후 수정이 불가능합니다.
                    </div>
                    <button 
                        type="submit"
                        className="bg-[#0F4C81] hover:bg-[#0a355c] text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
                    >
                        <Send size={18} />
                        요청 제출하기
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
