"""Entry point for the packaged executable (PyInstaller)."""

import threading
import webbrowser

import uvicorn

from backend.main import app


def _open_browser():
    webbrowser.open("http://localhost:8001")


if __name__ == "__main__":
    threading.Timer(1.5, _open_browser).start()
    uvicorn.run(app, host="127.0.0.1", port=8001)
