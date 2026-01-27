
import React, { useState } from 'react';

interface AnamnesisDraftProps {
  report: { ru: string; en: string };
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const AnamnesisDraft: React.FC<AnamnesisDraftProps> = ({ report, onClose, onConfirm, isLoading }) => {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-left">
        <header className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Medical Anamnesis</h2>
            <p className="text-sm text-gray-500">Draft version for your review</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-4 bg-gray-50 flex space-x-2">
          <button 
            onClick={() => setLang('ru')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              lang === 'ru' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border'
            }`}
          >
            Русский (RU)
          </button>
          <button 
            onClick={() => setLang('en')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              lang === 'en' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border'
            }`}
          >
            English (EN)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 prose prose-sm max-w-none prose-blue">
          <div className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed bg-gray-50/50 p-6 rounded-xl border border-gray-100">
            {lang === 'ru' ? report.ru : report.en}
          </div>
        </div>

        <div className="p-6 border-t bg-white flex items-center justify-between">
          <p className="text-xs text-gray-400 italic max-w-[200px]">
            Please review the details. Once confirmed, data is sent to the medical curator.
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50"
            >
              Edit
            </button>
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Syncing...</span>
                </>
              ) : (
                <span>Confirm & Send</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnamnesisDraft;
