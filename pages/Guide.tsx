import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Download, ShieldCheck, Users } from 'lucide-react';
import { FaqItem } from '../types';

const faqData: FaqItem[] = [
  {
    id: '1',
    category: '보고 체계',
    question: '주간 업무 보고는 언제까지 제출해야 하나요?',
    answer: '주간 업무 보고는 매주 금요일 오후 4시까지 팀 공용 폴더 내 "Weekly Report" 양식을 작성하여 업로드해야 합니다. 이슈 사항이 있는 경우, 보고서 내 Highlight 섹션에 반드시 기재해주세요.'
  },
  {
    id: '2',
    category: '툴 사용법',
    question: '새로운 프로젝트 생성 권한은 누구에게 있나요?',
    answer: '프로젝트 생성 권한은 각 파트장 및 PM(Project Manager)에게 부여되어 있습니다. 신규 프로젝트 생성이 필요한 경우, 소속 파트장님께 승인 요청을 먼저 진행해주시기 바랍니다.'
  },
  {
    id: '3',
    category: '휴가 신청',
    question: '연차 사용 시 업무 인수인계는 어떻게 하나요?',
    answer: '연차 사용 3일 전까지 부서 공유 캘린더에 일정을 등록하고, 현재 진행 중인 업무(Doing)의 대리 수행자를 지정하여 메일로 공유해야 합니다. 긴급 연락처를 비상 연락망에 업데이트 해주세요.'
  },
];

const Guide: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('1');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-[#0F4C81]">팀 가이드라인</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          효율적인 업무 수행을 위한 우리 팀의 규칙과 프로세스를 안내합니다.
          신규 입사자 및 기존 구성원 모두 정기적으로 확인해 주세요.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center group">
            <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-[#0F4C81] mb-4 group-hover:bg-[#0F4C81] group-hover:text-white transition-colors">
                <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">보안 규정</h3>
            <p className="text-sm text-gray-500">데이터 보안 및 접근 권한 관리 정책</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center group">
            <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-[#0F4C81] mb-4 group-hover:bg-[#0F4C81] group-hover:text-white transition-colors">
                <Users size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">커뮤니케이션</h3>
            <p className="text-sm text-gray-500">슬랙 및 메일 사용 에티켓 가이드</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center group">
            <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-[#0F4C81] mb-4 group-hover:bg-[#0F4C81] group-hover:text-white transition-colors">
                <FileText size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">문서 양식</h3>
            <p className="text-sm text-gray-500">보고서 및 기획안 표준 템플릿</p>
        </div>
      </div>

      {/* Accordion FAQ */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-[#00B894] pl-3">자주 묻는 질문 (FAQ)</h2>
        <div className="space-y-4">
          {faqData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleAccordion(item.id)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-[#0F4C81] bg-blue-50 px-2 py-1 rounded">
                        {item.category}
                    </span>
                    <span className="font-medium text-gray-800">{item.question}</span>
                </div>
                {openId === item.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </button>
              {openId === item.id && (
                <div className="p-5 pt-0 bg-gray-50 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                  <div className="mt-4">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Downloads Section */}
      <div className="bg-[#0F4C81] rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
            <h3 className="text-xl font-bold mb-2">2024년 팀 핸드북 다운로드</h3>
            <p className="text-blue-200 text-sm">신규 입사자를 위한 모든 정보가 담겨있습니다. (PDF, 2.4MB)</p>
        </div>
        <button className="flex items-center gap-2 bg-white text-[#0F4C81] px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            <Download size={20} />
            다운로드
        </button>
      </div>
    </div>
  );
};

export default Guide;
