import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Users, DollarSign, CheckSquare, Plus, 
  ArrowUpRight, Phone, Mail, Clock, Filter, Sparkles 
} from 'lucide-react';
import { CrmLead, BusinessTask } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const INITIAL_LEADS: CrmLead[] = [
  {
    id: 'LEAD-101',
    name: 'Berhane Tesfay',
    company: 'Asmara Solar Distribution Ltd',
    email: 'berhane@asmarasolar.er',
    phone: '+291 1 123456',
    dealSizeUsd: 14500,
    pipelineStage: 'proposal_sent',
    priority: 'high',
    lastContact: '2026-08-16',
    notes: 'Interested in 200kW commercial solar kit for bakery facility.',
  },
  {
    id: 'LEAD-102',
    name: 'Rahel Gebremariam',
    company: 'Gheralta Eco-Lodge & Tours',
    email: 'rahel@gheraltatours.com',
    phone: '+251 91 2345678',
    dealSizeUsd: 8200,
    pipelineStage: 'negotiation',
    priority: 'high',
    lastContact: '2026-08-17',
    notes: 'Contract draft sent for multi-season cultural tourist booking software.',
  },
  {
    id: 'LEAD-103',
    name: 'Klaus Schmidt',
    company: 'Frankfurt Specialty Roasters',
    email: 'k.schmidt@frankfurtcoffee.de',
    phone: '+49 69 987654',
    dealSizeUsd: 22000,
    pipelineStage: 'closed_won',
    priority: 'high',
    lastContact: '2026-08-15',
    notes: 'Confirmed 2 containers of organic sun-dried highland arabica.',
  },
  {
    id: 'LEAD-104',
    name: 'Yemane Woldu',
    company: 'Massawa Port Logistics Co',
    email: 'yemane@massawaport.com',
    phone: '+291 7 554433',
    dealSizeUsd: 6500,
    pipelineStage: 'contacted',
    priority: 'medium',
    lastContact: '2026-08-14',
    notes: 'Initial inquiry on automated customs declaration plugin.',
  },
];

const INITIAL_TASKS: BusinessTask[] = [
  { id: 'TSK-1', title: 'Submit quarterly export tax declarations', status: 'in_progress', priority: 'high', dueDate: '2026-08-25', assignedTo: 'Finance Team', category: 'finance' },
  { id: 'TSK-2', title: 'Launch TikTok campaign for diaspora youth gift baskets', status: 'todo', priority: 'medium', dueDate: '2026-08-28', assignedTo: 'Marketing', category: 'marketing' },
  { id: 'TSK-3', title: 'Finalize SLA contract with Frankfurt roasting partner', status: 'review', priority: 'high', dueDate: '2026-08-22', assignedTo: 'Legal Advisor', category: 'sales' },
  { id: 'TSK-4', title: 'Onboard 3 new warehouse logistics managers', status: 'done', priority: 'low', dueDate: '2026-08-10', assignedTo: 'Operations', category: 'operations' },
];

export const BusinessDashboard: React.FC = () => {
  const { language } = useLanguage();
  const [leads, setLeads] = useState<CrmLead[]>(INITIAL_LEADS);
  const [tasks, setTasks] = useState<BusinessTask[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<'crm' | 'kanban'>('crm');

  // Summary Metrics
  const totalPipelineValue = leads.reduce((sum, lead) => sum + lead.dealSizeUsd, 0);
  const wonDealsValue = leads.filter(l => l.pipelineStage === 'closed_won').reduce((sum, l) => sum + l.dealSizeUsd, 0);
  const activeLeadsCount = leads.filter(l => l.pipelineStage !== 'closed_lost').length;

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id !== taskId) return t;
      const nextStatus: Record<string, BusinessTask['status']> = {
        todo: 'in_progress',
        in_progress: 'review',
        review: 'done',
        done: 'todo',
      };
      return { ...t, status: nextStatus[t.status] };
    }));
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>TOTAL PIPELINE</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-stone-100">${totalPipelineValue.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% this quarter</span>
          </div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>CLOSED REVENUE</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">${wonDealsValue.toLocaleString()}</div>
          <div className="text-xs text-stone-400">Export & B2B contracts</div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>ACTIVE LEADS</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300">{activeLeadsCount} Accounts</div>
          <div className="text-xs text-stone-400">High-intent pipeline</div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>TASKS PENDING</span>
            <CheckSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-stone-100">{tasks.filter(t => t.status !== 'done').length} Active</div>
          <div className="text-xs text-stone-400">Operations & Strategy</div>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'crm' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'}`}
          >
            {language === 'ti' ? 'ዓማዊልን መሸጣን (CRM Leads)' : language === 'de' ? 'Kunden- & Vertriebspipeline' : 'CRM & Sales Pipeline'}
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === 'kanban' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'}`}
          >
            {language === 'ti' ? 'ዕማማትን ስራሕትን (Kanban Tasks)' : language === 'de' ? 'Aufgaben- & Kanban-Board' : 'Task & Kanban Board'}
          </button>
        </div>
      </div>

      {/* CRM Lead Table */}
      {activeTab === 'crm' && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-stone-950 flex items-center justify-between border-b border-stone-800">
            <h4 className="text-sm font-bold text-stone-200">Active Deals & Leads</h4>
            <span className="text-xs text-stone-400 font-mono">{leads.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 uppercase font-mono border-b border-stone-800">
                <tr>
                  <th className="p-3.5">Customer / Company</th>
                  <th className="p-3.5">Deal Size</th>
                  <th className="p-3.5">Stage</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Last Contact</th>
                  <th className="p-3.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 bg-stone-950/40 text-stone-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-900/60 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-stone-100">{lead.name}</div>
                      <div className="text-stone-400 text-[11px]">{lead.company}</div>
                    </td>
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">
                      ${lead.dealSizeUsd.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                        lead.pipelineStage === 'closed_won' ? 'bg-emerald-500/20 text-emerald-300' :
                        lead.pipelineStage === 'negotiation' ? 'bg-amber-500/20 text-amber-300' :
                        lead.pipelineStage === 'proposal_sent' ? 'bg-cyan-500/20 text-cyan-300' :
                        'bg-stone-800 text-stone-300'
                      }`}>
                        {lead.pipelineStage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                        lead.priority === 'high' ? 'text-rose-400 bg-rose-950/40' : 'text-amber-400 bg-amber-950/40'
                      }`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-stone-400">{lead.lastContact}</td>
                    <td className="p-3.5 text-stone-300 max-w-xs truncate">{lead.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kanban Tasks Board */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['todo', 'in_progress', 'review', 'done'] as BusinessTask['status'][]).map((colStatus) => {
            const colTasks = tasks.filter(t => t.status === colStatus);
            const statusLabels: Record<string, string> = {
              todo: 'To Do (ዝግበር)',
              in_progress: 'In Progress (ኣብ ስራሕ)',
              review: 'Review (ምርመራ)',
              done: 'Completed (ዝተወድአ)',
            };
            return (
              <div key={colStatus} className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-xs font-bold text-stone-300">
                  <span>{statusLabels[colStatus]}</span>
                  <span className="px-2 py-0.5 bg-stone-800 text-stone-400 rounded-full font-mono">{colTasks.length}</span>
                </div>
                <div className="space-y-2.5">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTaskStatus(t.id)}
                      className="bg-stone-950 p-3 rounded-xl border border-stone-800/80 hover:border-amber-500/50 cursor-pointer space-y-2 transition-all shadow-sm"
                    >
                      <div className="text-xs font-semibold text-stone-200">{t.title}</div>
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span className="text-amber-400/90 font-mono">{t.assignedTo}</span>
                        <span>Due: {t.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
