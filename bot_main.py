import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters
import google.generativeai as genai
from keep_alive import keep_alive  # Імпортуємо наш файл-будильник

# --- НАЛАШТУВАННЯ ---
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

# Отримуємо ключі з налаштувань Render
API_KEY = os.environ.get("API_KEY")
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")

# Перевірка на помилки налаштування
if not API_KEY or not TELEGRAM_TOKEN:
    print("ПОМИЛКА: Не знайдено API_KEY або TELEGRAM_TOKEN у змінних середовища!")

# Налаштування Gemini
try:
    genai.configure(api_key=API_KEY)
    # Використовуємо модель Flash (вона швидка і дешева)
    model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    print(f"Помилка налаштування Gemini: {e}")

# --- ФУНКЦІЇ БОТА ---
async def start(update: Update, context):
    await update.message.reply_text("Вітаю! Я MedCoord AI — ваш медичний секретар в Ізраїлі. Очікую на ваші документи або опис ситуації.")

async def handle_message(update: Update, context):
    user_text = update.message.text
    
    # Показуємо користувачу, що бот "друкує" (щоб не думали, що завис)
    await update.message.chat.send_action(action="typing")
    
    try:
        # Створюємо чат з AI
        chat = model.start_chat(history=[])
        
        # Формуємо запит (Prompt)
        prompt = f"Ти професійний медичний координатор в Ізраїлі. Клієнт пише: {user_text}. Дай коротку, чітку та корисну відповідь українською мовою."
        
        response = chat.send_message(prompt)
        await update.message.reply_text(response.text)
        
    except Exception as e:
        logging.error(f"Error calling Gemini: {e}")
        await update.message.reply_text("Вибачте, сталася технічна помилка обробки запиту.")

# --- ЗАПУСК ---
if __name__ == "__main__":
    # 1. Запускаємо веб-сервер (щоб Render бачив, що ми працюємо)
    keep_alive()
    
    # 2. Запускаємо бота
    tg_app = Application.builder().token(TELEGRAM_TOKEN).build()
    
    tg_app.add_handler(CommandHandler("start", start))
    tg_app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    print("Бот запущено успішно!")
    tg_app.run_polling()
