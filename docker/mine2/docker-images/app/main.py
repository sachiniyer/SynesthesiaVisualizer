import os
import uuid
import wave
from flask import Flask, render_template
from flask_socketio import SocketIO, emit, socketio
import librosa

app = Flask(__name__)
app.config['FILEDIR'] = 'static'
socketio = SocketIO(app)

buffsize = 0
maxbuffsize = 20
totalaudio = []

@app.route('/')
def index():
    """Return the client application."""
    return render_template('main.html', connected="hello world")


@socketio.on('sound')
def connect(message):
    aggaudio(message)


def aggaudio(audio):
    totalaudio = totalaudio.append(audio)
    buffsize += 1
    if buffsize >= maxbuffsize:
        processtotalaudio(totalaudio)
        totalaudio = []
        buffsize = 0

def processtotalaudio(y):
    y_harmonic, y_percussive = librosa.effecs.hpss(y)
    chromagraph = librosa.feature.chroma_cqt(y=y_harmonic, sr=samplerate)
    emit('data', chromagraph)


if __name__ == '__main__':
    app.run(host="0.0.0.0",port=80, debug=True)
    socketio.run(app)
