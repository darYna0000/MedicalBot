
import React from 'react';
import { Clock, Calendar, FileCheck, AlertCircle, FileText, Languages } from 'lucide-react';

export const AnamnesisView: React.FC = () => {
  const mockTimeline = [
    { date: 'Жовтень 2023', type: 'Symptom', desc: 'Перші болі в епігастрії, слабкість.', status: 'confirmed' },
    { date: '15.11.2023', type: 'Diagnostics', desc: 'КТ ОЧП: Новоутворення в ділянці підшлункової залози.', status: 'extracted' },
    { date: '02.12.2023', type: 'Treatment', desc: 'Біопсія: Аденокарцинома. Початок хіміотерапії (FOLFIRINOX).', status: 'confirmed' },
    { date: 'Дата невідома', type: 'Query', desc: 'Чи було ПЕТ-КТ після першого курсу?', status: 'pending' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-indigo-600" size={20} />
              Chronological History (Draft)
            </h3>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Phase D in progress
            </span>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-slate-200 before:to-transparent">
            {mockTimeline.map((item, idx) => (
              <div key={idx} className="relative pl-10">
                <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${
                  item.status === 'confirmed' ? 'bg-indigo-600' : 
                  item.status === 'extracted' ? 'bg-blue-400' : 'bg-amber-400'
                }`}>
                  {item.status === 'confirmed' ? <FileCheck size={12} className="text-white" /> : <AlertCircle size={12} className="text-white" />}
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{item.date}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      item.type === 'Diagnostics' ? 'bg-blue-100 text-blue-700' :
                      item.type === 'Treatment' ? 'bg-green-100 text-green-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>{item.type}</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="text-indigo-600" size={20} />
            Documents Recognized
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentCard name="CT_Abdomen_Nov23.pdf" type="CT Scan" date="15.11.2023" />
            <DocumentCard name="Biopsy_Report.jpg" type="Histology" date="02.12.2023" />
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center text-slate-400 text-sm italic">
              Waiting for PET-CT...
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Languages size={24} className="text-indigo-300" />
              <h3 className="font-bold">Multilingual Export</h3>
            </div>
            <p className="text-sm text-indigo-100 mb-6 leading-relaxed">
              Once verified, the AI generates the summary in RU + EN for Israeli experts.
            </p>
            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-lg border border-white/10 text-xs font-mono">
                Generating Summary_RU.pdf...
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10 text-xs font-mono">
                Generating Summary_EN.pdf...
              </div>
            </div>
            <button className="w-full mt-6 bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50" disabled>
              Preview Document
            </button>
          </div>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">CRM Integration (GHL)</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-500">Contact Status</span>
                 <span className="text-green-600 font-bold">Created</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-500">Opportunity</span>
                 <span className="text-slate-400">Waiting for Verification</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-600 w-2/3"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const DocumentCard = ({ name, type, date }: { name: string; type: string; date: string }) => (
  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3">
    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
      <FileText size={18} />
    </div>
    <div>
      <p className="text-sm font-bold text-slate-800 truncate w-32">{name}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase">{type}</span>
        <span className="text-[10px] text-slate-400">{date}</span>
      </div>
    </div>
  </div>
);
