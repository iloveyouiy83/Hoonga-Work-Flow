import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, BookOpen, LifeBuoy, Menu, X, Bell, Settings } from 'lucide-react';
import ApiKeyManager from './ApiKeyManager';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: '대시보드', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: '프로젝트 현황', path: '/projects', icon: <ListTodo size={20} /> },
    { name: '업무 보드', path: '/tasks', icon: <ListTodo size={20} /> }, // Using ListTodo as generic task icon
    { name: '팀 가이드', path: '/guide', icon: <BookOpen size={20} /> },
    { name: '지원 요청', path: '/support', icon: <LifeBuoy size={20} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#0F4C81] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <div className="w-8 h-8 bg-[#00B894] rounded-lg flex items-center justify-center text-white">
                  TS
                </div>
                TeamSync
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                    isActive(item.path)
                      ? 'bg-[#0a355c] text-white'
                      : 'text-blue-100 hover:bg-[#165a96] hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setIsApiKeyModalOpen(true)}
                className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="API Key 관리"
              >
                <Settings size={20} />
              </button>
              
              <button className="p-2 text-blue-100 hover:text-white relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00B894] rounded-full"></span>
              </button>
              
              <div className="hidden md:flex items-center gap-2">
                <img
                  src="https://picsum.photos/seed/user1/40/40"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-blue-300"
                />
              </div>
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-blue-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0d4270] border-t border-blue-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-[#0a355c] text-white'
                      : 'text-blue-100 hover:bg-[#165a96] hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="mb-4 md:mb-0">
              <span className="font-semibold text-gray-700">TeamSync</span> &copy; {new Date().getFullYear()} Project Management System. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[#0F4C81]">개인정보처리방침</a>
              <a href="#" className="hover:text-[#0F4C81]">이용약관</a>
              <a href="#" className="hover:text-[#0F4C81]">사내 인트라넷</a>
            </div>
          </div>
        </div>
      </footer>

      {/* API Key Manager Modal */}
      <ApiKeyManager 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
      />
    </div>
  );
};

export default Layout;
