import os
import logging
import requests
from flask import Flask, request
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters
import google.generativeai as genai

# Налаштування логування
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

# Отримання змінних середовища
API_KEY = os.environ.get("API_KEY")
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")
WEBHOOK_URL = os.environ.get("WEBHOOK_URL") 
PORT = int(os.environ.get("PORT", 8443))

# Налаштування Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Налаштування Flask
app = Flask(__name__)

# Налаштування Telegram Application
tg_app = Application.builder().token(TELEGRAM_TOKEN).build()

async def start(update: Update, context):
    await update.message.reply_text("Вітаю! Я MedCoord AI — ваш медичний секретар в Ізраїлі. Очікую на ваші документи або опис ситуації.")

async def handle_message(update: Update, context):
    user_text = update.message.text
    # Логіка обробки через Gemini
    chat = model.start_chat(history=[])
    response = chat.send_message(f"Ти медичний координатор. Клієнт каже: {user_text}")
    await update.message.reply_text(response.text)

@app.route(f"/{TELEGRAM_TOKEN}", methods=["POST"])
async def webhook():
    if request.method == "POST":
        update = Update.de_json(request.get_json(force=True), tg_app.bot)
        await tg_app.process_update(update)
    return "OK", 200

@app.route("/", methods=["GET"])
def index():
    return "Bot is running", 200

if __name__ == "__main__":
    tg_app.add_handler(CommandHandler("start", start))
    tg_app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    # Запуск сервера
    app.run(host="0.0.0.0", port=PORT)
