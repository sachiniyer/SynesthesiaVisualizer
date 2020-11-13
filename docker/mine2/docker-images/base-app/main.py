import sys

from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/")
def hello():
    return render_template('home.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=80)
    socketio.run(app)
