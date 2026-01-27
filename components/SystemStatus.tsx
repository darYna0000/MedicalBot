
import React from 'react';

export const SystemStatus: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Gemini 3 Flash</span>
        <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Connected
        </span>
      </div>
      <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center overflow-hidden bg-slate-50">
         <img src="https://picsum.photos/40/40" alt="Admin" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};
