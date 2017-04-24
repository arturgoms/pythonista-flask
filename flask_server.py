import os

# PyPI
from flask import Flask, render_template, request


app = Flask(__name__)

# Index / search
@app.route('/', methods=['GET', 'POST'])
def index():
  return render_template('index.html')


# Launch server
if __name__ == "__main__":
  port = int(os.environ.get("PORT", 5000))
  app.run(host='0.0.0.0', port=port)
