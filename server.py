from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
import webbrowser

root = Path(__file__).resolve().parent
try:
    server = ThreadingHTTPServer(('127.0.0.1', 8000), partial(SimpleHTTPRequestHandler, directory=str(root)))
except OSError as error:
    print(f'Cannot start localhost:8000: {error}')
    print('Close the other server or open index.html directly.')
    raise SystemExit(1)
print('Braille Mirror: http://localhost:8000')
print('Keep this window open. Press Ctrl+C to stop.')
webbrowser.open('http://localhost:8000')
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
