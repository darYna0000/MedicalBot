
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  FileText, 
  Terminal, 
  Activity, 
  ShieldAlert, 
  Globe, 
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ChatSimulator } from './components/ChatSimulator';
import { CodeViewer } from './components/CodeViewer';
import { AnamnesisView } from './components/AnamnesisView';
import { SystemStatus } from './components/SystemStatus';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'anamnesis'>('simulator');
  const [userName, setUserName] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<string>("A");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-indigo-900 text-white flex-shrink-0 border-r border-indigo-800">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bold text-lg leading-tight">MedCoord<br/><span className="text-indigo-300 text-sm">Coordinator AI</span></h1>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('simulator')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'simulator' ? 'bg-indigo-800 shadow-lg border border-indigo-700' : 'hover:bg-indigo-800/50'}`}
            >
              <MessageSquare size={18} />
              <span className="font-medium">Bot Simulator</span>
            </button>
            <button 
              onClick={() => setActiveTab('anamnesis')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'anamnesis' ? 'bg-indigo-800 shadow-lg border border-indigo-700' : 'hover:bg-indigo-800/50'}`}
            >
              <FileText size={18} />
              <span className="font-medium">Anamnesis Live</span>
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'code' ? 'bg-indigo-800 shadow-lg border border-indigo-700' : 'hover:bg-indigo-800/50'}`}
            >
              <Terminal size={18} />
              <span className="font-medium">Python Code</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-indigo-800/50">
          <div className="bg-indigo-800/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-bold uppercase tracking-wider">
              <ShieldAlert size={14} />
              System Limitations
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Bot is strictly a coordinator. No medical advice or prescriptions allowed.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-500">Current Phase:</span>
            <div className="flex gap-2">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(phase => (
                <div key={phase} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === phase ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                  {phase}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm text-slate-500">
               <Globe size={16} />
               <span>RU/EN/UA</span>
             </div>
             <div className="h-4 w-px bg-slate-200"></div>
             <SystemStatus />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {activeTab === 'simulator' && (
              <ChatSimulator onStepChange={setCurrentStep} />
            )}
            {activeTab === 'anamnesis' && (
              <AnamnesisView />
            )}
            {activeTab === 'code' && (
              <CodeViewer />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
