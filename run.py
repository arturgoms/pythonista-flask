from threading import Thread
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


t = Thread(target=app.run, kwargs={'host': '0.0.0.0'})
t.start()
