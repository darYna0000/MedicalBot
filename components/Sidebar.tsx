
import React from 'react';
import { UserProfile, MedicalDocument, BotStage } from '../types';

interface SidebarProps {
  profile: Partial<UserProfile>;
  documents: MedicalDocument[];
  stage: BotStage;
}

const Sidebar: React.FC<SidebarProps> = ({ profile, documents, stage }) => {
  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Статус кейсу</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Етап</span>
            <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
              {stage.replace('_', ' ')}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500" 
              style={{ width: `${(Object.values(BotStage).indexOf(stage) + 1) * 12.5}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {}
        <section>
          <h3 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">CRM Інтеграція</h3>
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
             <div className="flex items-center space-x-2 mb-1">
               <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
               <span className="text-[11px] font-bold text-orange-700 uppercase">Режим симуляції</span>
             </div>
             <p className="text-[10px] text-orange-600 leading-tight">
               Дані відображаються в консолі. Для реальної синхронізації підключіть GoHighLevel API.
             </p>
          </div>
        </section>

        {/* Profile Info */}
        <section>
          <h3 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Профіль пацієнта</h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400">Мова</span>
              <span className="text-sm font-medium">{profile.language}</span>
            </div>
            {profile.name && profile.name !== "Unknown" && (
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400">Ім'я</span>
                <span className="text-sm font-medium">{profile.name}</span>
              </div>
            )}
            {(profile.country && profile.country !== "Unknown") && (
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400">Локація</span>
                <span className="text-sm font-medium">{profile.country}, {profile.city}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 pt-1">
               <div className={`w-2 h-2 rounded-full ${profile.oncoCase ? 'bg-red-500' : 'bg-green-500'}`}></div>
               <span className="text-xs font-medium">{profile.oncoCase ? 'Онкологічний випадок' : 'Стандартний випадок'}</span>
            </div>
          </div>
        </section>

        {/* Document Timeline */}
        <section>
          <h3 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Медичні документи</h3>
          {documents.length === 0 ? (
            <div className="text-xs text-gray-400 italic">Документи ще не завантажені.</div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="relative pl-6 pb-2 border-l border-gray-100 last:border-0">
                  <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                  <div className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">{doc.type}</span>
                      <span className="text-[10px] text-gray-400">{doc.date}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-900 truncate">{doc.fileName}</p>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{doc.keyFindings}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="p-4 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400">MedCoord Israel © 2024</p>
      </div>
    </div>
  );
};

export default Sidebar;
