from flask import Flask
from threading import Thread

app = Flask('')

@app.route('/')
def home():
    return "I'm alive! Bot is running."

def run():
    # Render очікує порт 8080 або 10000, 
    # але 0.0.0.0 дозволяє доступ ззовні
    app.run(host='0.0.0.0', port=8080)

def keep_alive():
    t = Thread(target=run)
    t.start()
