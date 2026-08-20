import React, { useState } from 'react';
import { 
  X, MessageCircle, Sparkles, CheckCircle2, ListTodo, Calendar, 
  Lightbulb, ArrowRight, Check, Plus, Trash2, Send
} from 'lucide-react';
import { UserProfile } from '../types';

interface SmartAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigateToChat?: (prompt: string) => void;
}

export const SmartAssistantModal: React.FC<SmartAssistantModalProps> = ({
  isOpen,
  onClose,
  user,
  onNavigateToChat,
}) => {
  const [activeCategory, setActiveCategory] = useState<'daily' | 'planner' | 'ideas' | 'habits'>('daily');
  const [tasks, setTasks] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Review quarterly project deliverables', done: false },
    { id: '2', text: 'Practice 15 minutes of Tigrinya Ge\'ez language vocabulary', done: true },
    { id: '3', text: 'Prepare financial budget overview', done: false },
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  if (!isOpen) return null;

  const handleToggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now().toString(), text: newTaskInput.trim(), done: false }]);
    setNewTaskInput('');
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAskAssistant = (promptText: string) => {
    if (onNavigateToChat) {
      onNavigateToChat(promptText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-5 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] text-[#0F2856]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#34D399] text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F2856] flex items-center space-x-2">
                <span>Smart Assistant</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-700 font-black rounded-full font-mono">AUTONOMOUS</span>
              </h3>
              <p className="text-xs text-slate-500">Tasks, executive summaries, planning & intelligent recommendations</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Quick Recommendations Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'daily', label: 'Daily Brief' },
              { id: 'planner', label: 'Task Planner' },
              { id: 'ideas', label: 'Idea Generator' },
              { id: 'habits', label: 'Productivity' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                  activeCategory === cat.id
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Assistant Action Prompts */}
          <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-2xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0F2856]">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Recommended Quick Actions for You:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { title: 'Summarize Today\'s Priorities', prompt: 'Please act as my executive assistant and summarize my high-priority goals and schedule for today.' },
                { title: 'Draft a Strategic Email', prompt: 'Help me draft a polite, professional follow-up email regarding our upcoming project proposal.' },
                { title: 'Weekly Sprint Planning', prompt: 'Create a 5-day action schedule to achieve my main project milestones.' },
                { title: 'Brainstorm 5 Growth Ideas', prompt: 'Give me 5 creative, practical ideas to grow our audience and service adoption.' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAskAssistant(item.prompt)}
                  className="p-3 bg-white hover:bg-emerald-50/80 rounded-xl border border-emerald-100 text-left transition-all hover:border-emerald-300 shadow-2xs group flex items-center justify-between cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#0F2856] group-hover:text-emerald-700">{item.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Task Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <ListTodo className="w-4 h-4 text-emerald-600" />
                <span>Today's Task Organizer</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {tasks.filter((t) => t.done).length} of {tasks.length} completed
              </span>
            </div>

            <form onSubmit={handleAddTask} className="flex space-x-2">
              <input
                type="text"
                placeholder="Add a new task or reminder..."
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F2856] focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    task.done ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' : 'bg-white border-slate-200/90 text-[#0F2856]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-center space-x-2.5 text-left flex-1 cursor-pointer"
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      task.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                    }`}>
                      {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-medium">{task.text}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
