from flask import Flask

app = Flask(__name__)

from .core import app_setup

@app.route("/")
def hello():
    version = "{}.{}".format(sys.version_info.major, sys.version_info.minor)
    message = "Hello World from Flask in a uWSGI Nginx Docker container with Python {} (default)".format(
        version
    )
    return message

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host="0.0.0.0", debug=True, port=80)
