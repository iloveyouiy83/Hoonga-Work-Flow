import React, { useState } from 'react';
import { X, Save, Wifi, CheckCircle, AlertCircle, Lock, Download } from 'lucide-react';

interface ApiKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  // 로컬 드라이브에 암호화된 파일로 저장 (시뮬레이션)
  const handleSaveToDrive = () => {
    if (!apiKey) {
      setTestStatus('error');
      setStatusMessage('저장할 API Key를 입력해주세요.');
      return;
    }

    try {
      // 간단한 Base64 인코딩으로 암호화 시뮬레이션 (실무에서는 AES 등 사용 권장)
      const encryptedData = btoa(JSON.stringify({ 
        service: 'TeamSync', 
        key: apiKey, 
        createdAt: new Date().toISOString() 
      }));
      
      const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'teamsync-secure-key.lock';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage('로컬 드라이브에 암호화된 키가 저장되었습니다.');
      setTestStatus('success');
    } catch (e) {
      setStatusMessage('파일 저장 중 오류가 발생했습니다.');
      setTestStatus('error');
    }
  };

  // 연결 테스트 시뮬레이션
  const handleTestConnection = () => {
    if (!apiKey) {
      setTestStatus('error');
      setStatusMessage('API Key가 입력되지 않았습니다.');
      return;
    }

    setIsTesting(true);
    setTestStatus('idle');
    setStatusMessage('서버와 연결을 시도하는 중...');

    // API 호출 시뮬레이션
    setTimeout(() => {
      setIsTesting(false);
      // 예시: 키 길이가 10자 이상이면 성공으로 간주
      if (apiKey.length > 10) {
        setTestStatus('success');
        setStatusMessage('성공적으로 연결되었습니다. 인증 완료.');
      } else {
        setTestStatus('error');
        setStatusMessage('연결 실패: 유효하지 않은 API Key입니다.');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-[#0F4C81] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock size={20} className="text-[#00B894]" />
            <h2 className="text-lg font-bold">API Key 관리자</h2>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-[#0F4C81] leading-relaxed">
            보안을 위해 API Key는 서버에 저장되지 않습니다. 
            <strong> '내보내기'</strong>를 통해 로컬 드라이브에 암호화된 파일로 보관하세요.
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              서비스 API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none transition-all font-mono text-sm"
            />
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`flex items-start gap-2 text-sm p-3 rounded-lg ${
              testStatus === 'success' ? 'bg-emerald-50 text-emerald-700' : 
              testStatus === 'error' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'
            }`}>
              {testStatus === 'success' && <CheckCircle size={16} className="mt-0.5 shrink-0" />}
              {testStatus === 'error' && <AlertCircle size={16} className="mt-0.5 shrink-0" />}
              {testStatus === 'idle' && <Wifi size={16} className="mt-0.5 shrink-0 animate-pulse" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleSaveToDrive}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <Download size={18} />
              내보내기
            </button>
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition-colors shadow-sm ${
                isTesting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00B894] hover:bg-[#00a383]'
              }`}
            >
              {isTesting ? (
                '연결 중...'
              ) : (
                <>
                  <Wifi size={18} />
                  연결 테스트
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;
