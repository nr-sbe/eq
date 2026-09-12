"""Serve only the game's static assets; no directory listing or workspace access."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote,urlsplit
import argparse,mimetypes,socket

ROOT=Path(__file__).resolve().parent
ALLOWED={'.html','.js','.css','.json','.mp3','.wav','.ogg','.oga','.glb','.png','.jpg','.webp','.svg','.ico','.txt','.md'}
def resolve_asset(raw):
    path=unquote(urlsplit(raw).path)
    if '\\' in path or '\x00' in path:return None
    parts=Path(path.lstrip('/')).parts
    if any(p.startswith('.') or p in ('tests','scripts','node_modules') for p in parts):return None
    if path in ('/','/Fivefold-3D.html','/Fivefold.html'):path='/index.html'
    target=(ROOT/path.lstrip('/')).resolve()
    if not target.is_relative_to(ROOT) or target.suffix.lower() not in ALLOWED or not target.is_file():return None
    return target
class Handler(BaseHTTPRequestHandler):
    def do_HEAD(self):self.respond(False)
    def do_GET(self):self.respond(True)
    def respond(self,body):
        target=resolve_asset(self.path)
        if target is None:self.send_error(404);return
        size=target.stat().st_size;start=0;end=size-1;status=200
        rng=self.headers.get('Range','')
        if rng.startswith('bytes=') and ',' not in rng:
            try:
                a,b=rng[6:].split('-');start=int(a) if a else max(0,size-int(b));end=min(size-1,int(b)) if b and a else size-1
                if start<0 or start>end:raise ValueError()
                status=206
            except ValueError:self.send_error(416);return
        self.send_response(status);self.send_header('Content-Type',mimetypes.guess_type(str(target))[0] or 'application/octet-stream');self.send_header('Content-Length',str(end-start+1));self.send_header('Accept-Ranges','bytes');self.send_header('X-Content-Type-Options','nosniff');self.send_header('Cache-Control','no-cache')
        if status==206:self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
        self.end_headers()
        if body:
            try:
                with target.open('rb') as stream:
                    stream.seek(start);remaining=end-start+1
                    while remaining:
                        data=stream.read(min(65536,remaining))
                        if not data:break
                        self.wfile.write(data);remaining-=len(data)
            except (ConnectionResetError,BrokenPipeError,ConnectionAbortedError):pass
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8768);parser.add_argument('--host',default='127.0.0.1');args=parser.parse_args()
    server=ThreadingHTTPServer((args.host,args.port),Handler)
    print(f'Fivefold: http://127.0.0.1:{args.port}/',flush=True)
    if args.host=='0.0.0.0':
        for addr in sorted({e[4][0] for e in socket.getaddrinfo(socket.gethostname(),None,socket.AF_INET)}):
            if not addr.startswith('127.'):print(f'Phone on the same Wi-Fi: http://{addr}:{args.port}/',flush=True)
    print('Only game assets are served. Ctrl+C stops the server.',flush=True)
    try:server.serve_forever()
    except KeyboardInterrupt:server.server_close()
if __name__=='__main__':main()
