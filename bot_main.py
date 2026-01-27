import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters
import google.generativeai as genai
from keep_alive import keep_alive  # Імпортуємо наш "будильник"

# Налаштування логування
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

# Отримання змінних середовища
# Важливо: переконайтеся, що на Render в Environment Variables імена саме такі!
API_KEY = os.environ.get("API_KEY") 
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")

# Налаштування Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

async def start(update: Update, context):
    await update.message.reply_text("Вітаю! Я MedCoord AI — ваш медичний секретар в Ізраїлі. Очікую на ваші документи або опис ситуації.")

async def handle_message(update: Update, context):
    user_text = update.message.text
    
    try:
        # Логіка обробки через Gemini
        chat = model.start_chat(history=[])
        # Додаємо try/except для безпеки запиту до AI
        response = chat.send_message(f"Ти медичний координатор. Клієнт каже: {user_text}")
        await update.message.reply_text(response.text)
    except Exception as e:
        logging.error(f"Error calling Gemini: {e}")
        await update.message.reply_text("Вибачте, зараз я не можу обробити запит. Спробуйте пізніше.")

if __name__ == "__main__":
    # 1. ЗАПУСКАЄМО ВЕБ-СЕРВЕР (щоб Render не вимикав бота)
    keep_alive()
    
    # 2. Створюємо бота
    tg_app = Application.builder().token(TELEGRAM_TOKEN).build()

    # 3. Додаємо хендлери
    tg_app.add_handler(CommandHandler("start", start))
    tg_app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    print("Бот запускається...")
    
    # 4. ЗАПУСКАЄМО БОТА (Polling)
    # allowed_updates=Update.ALL_TYPES дозволяє отримувати всі види повідомлень
    tg_app.run_polling(allowed_updates=Update.ALL_TYPES)
