import React, { useState } from 'react';
import { Copy, Terminal, Download, FileJson, Server, ExternalLink, Cpu, Code2, Check, FileCode } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'bot' | 'req' | 'render'>('bot');
  const [copied, setCopied] = useState(false);

  const files = {
    bot: `import os
import logging
import requests
from flask import Flask, request
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters
import google.generativeai as genai

# НАЛАШТУВАННЯ ДЛЯ RENDER.COM
API_KEY = os.environ.get("API_KEY")
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")
PORT = int(os.environ.get("PORT", 8443))

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')
app = Flask(__name__)
tg_app = Application.builder().token(TELEGRAM_TOKEN).build()

@app.route(f"/{TELEGRAM_TOKEN}", methods=["POST"])
async def webhook():
    update = Update.de_json(request.get_json(force=True), tg_app.bot)
    await tg_app.process_update(update)
    return "OK", 200

if __name__ == "__main__":
    tg_app.add_handler(CommandHandler("start", lambda u, c: u.message.reply_text("Бот активований!")))
    app.run(host="0.0.0.0", port=PORT)`,
    req: `python-telegram-bot==20.8
google-generativeai==0.3.2
flask==3.0.0
gunicorn==21.2.0
requests==2.31.0
python-dotenv==1.0.0`,
    render: `services:
  - type: web
    name: med-tourism-bot
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn bot_main:app
    envVars:
      - key: PYTHON_VERSION
        value: 3.10.0`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(files[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex flex-col h-[550px] shadow-2xl">
        <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex gap-2">
            {[
              { id: 'bot', name: 'bot_main.py', icon: <FileCode size={14} /> },
              { id: 'req', name: 'requirements.txt', icon: <Terminal size={14} /> },
              { id: 'render', name: 'render.yaml', icon: <Server size={14} /> }
            ].map((f) => (
              <button 
                key={f.id}
                onClick={() => setActiveFile(f.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeFile === f.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {f.icon}
                {f.name}
              </button>
            ))}
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? 'Скопійовано!' : 'Копіювати'}
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6 font-mono text-sm text-indigo-300 leading-relaxed">
          <pre>{files[activeFile]}</pre>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Download size={20} className="text-indigo-600" />
          Як використовувати ці файли?
        </h3>
        <div className="space-y-3 text-sm text-slate-600">
          <p>1. Створіть на комп'ютері нову папку проекту.</p>
          <p>2. Створіть у ній файл <code className="bg-slate-100 px-1 rounded text-indigo-600 font-bold">requirements.txt</code> і вставте туди скопійований текст залежностей.</p>
          <p>3. Створіть файл <code className="bg-slate-100 px-1 rounded text-indigo-600 font-bold">bot_main.py</code> для основного коду.</p>
          <p>4. Створіть <code className="bg-slate-100 px-1 rounded text-indigo-600 font-bold">render.yaml</code> для налаштувань деплою.</p>
          <p className="pt-2 text-xs text-slate-400 italic">Ці три файли — це мінімально необхідний набір для запуску вашого бота в хмарі Render.</p>
        </div>
      </div>
    </div>
  );
};
