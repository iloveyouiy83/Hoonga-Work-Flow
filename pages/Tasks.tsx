import React from 'react';
import { Plus, GripVertical, Calendar, User } from 'lucide-react';
import { Task } from '../types';
import { useData } from '../context/DataContext';

const Tasks: React.FC = () => {
  const { tasks, updateTask } = useData();

  // Simple drag and drop handlers
  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
    const taskId = e.dataTransfer.getData('taskId');
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate && taskToUpdate.status !== targetStatus) {
      updateTask({ ...taskToUpdate, status: targetStatus });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-gray-600';
    }
  };

  const Column = ({ status, title, colorClass }: { status: Task['status'], title: string, colorClass: string }) => {
    const columnTasks = tasks.filter(t => t.status === status);

    return (
      <div 
        className="flex flex-col h-full bg-gray-50 rounded-xl p-4 border border-gray-200 min-h-[500px]"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
      >
        <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${colorClass}`}>
          <h2 className="font-bold text-gray-700 flex items-center gap-2">
            {title}
            <span className="bg-white text-gray-500 text-xs px-2 py-0.5 rounded-full border border-gray-200">
              {columnTasks.length}
            </span>
          </h2>
          <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded">
            <Plus size={18} />
          </button>
        </div>
        
        <div className="space-y-3 flex-grow">
          {columnTasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <GripVertical size={16} className="text-gray-300 opacity-0 group-hover:opacity-100" />
              </div>
              <h3 className="font-medium text-gray-800 mb-3">{task.title}</h3>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{task.assignee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{task.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">업무 보드</h1>
            <p className="text-gray-500 text-sm">드래그 앤 드롭으로 업무 진행 상태를 변경하세요.</p>
        </div>
        <button className="bg-[#0F4C81] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0a355c] transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} /> 새 업무 생성
        </button>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
        <Column status="todo" title="할 일 (To Do)" colorClass="border-gray-300" />
        <Column status="doing" title="진행 중 (Doing)" colorClass="border-blue-500" />
        <Column status="done" title="완료 (Done)" colorClass="border-emerald-500" />
      </div>
    </div>
  );
};

export default Tasks;
