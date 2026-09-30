import os
import sys
import json
import urllib.parse
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler

from server.java_runner import JavaRunner
from server.ticket_manager import TicketManager
from server.chat_bot import ChatBot

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
WORKSPACE_ROOT = os.path.join(BASE_DIR, "workspace/nextpay-core")

java_runner = JavaRunner(WORKSPACE_ROOT)
ticket_manager = TicketManager(WORKSPACE_ROOT)
chat_bot = ChatBot()

class NextPayHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path.startswith("/api/"):
            self._handle_api_get(path, query)
        else:
            if path == "/":
                self.path = "/index.html"
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith("/api/"):
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
            try:
                data = json.loads(body)
            except Exception:
                data = {}
            self._handle_api_post(path, data)
        else:
            self._send_json({"error": "Not Found"}, status=404)

    def _handle_api_get(self, path, query):
        if path == "/api/status":
            status = java_runner.get_system_status()
            status["workspace_root"] = WORKSPACE_ROOT
            self._send_json(status)

        elif path == "/api/user_status":
            self._send_json(ticket_manager.get_user_status())

        elif path == "/api/tasks":
            tasks = ticket_manager.get_all_tasks()
            self._send_json({"tasks": tasks})

        elif path == "/api/task":
            task_id = query.get("id", ["STEP-01"])[0]
            task = ticket_manager.get_task(task_id)
            if task:
                self._send_json(task)
            else:
                self._send_json({"error": "Task not found"}, status=404)

        elif path == "/api/file":
            rel_path = query.get("path", [""])[0]
            safe_path = os.path.normpath(os.path.join(WORKSPACE_ROOT, rel_path))
            if not safe_path.startswith(WORKSPACE_ROOT):
                self._send_json({"error": "Invalid path"}, status=403)
                return

            if os.path.exists(safe_path) and os.path.isfile(safe_path):
                with open(safe_path, "r", encoding="utf-8") as f:
                    content = f.read()
                self._send_json({"path": rel_path, "content": content})
            else:
                self._send_json({"error": "File not found"}, status=404)

        elif path == "/api/file_tree":
            tree = self._build_file_tree(WORKSPACE_ROOT)
            self._send_json({"tree": tree})

        else:
            self._send_json({"error": "API route not found"}, status=404)

    def _handle_api_post(self, path, data):
        if path == "/api/file":
            rel_path = data.get("path", "")
            content = data.get("content", "")
            safe_path = os.path.normpath(os.path.join(WORKSPACE_ROOT, rel_path))
            if not safe_path.startswith(WORKSPACE_ROOT):
                self._send_json({"error": "Invalid path"}, status=403)
                return

            os.makedirs(os.path.dirname(safe_path), exist_ok=True)
            with open(safe_path, "w", encoding="utf-8") as f:
                f.write(content)
            self._send_json({"success": True, "message": "File saved successfully"})

        elif path == "/api/run_test":
            ticket_id = data.get("ticket_id", "STEP-01")
            result = java_runner.run_test(ticket_id)
            self._send_json(result)

        elif path == "/api/submit_code":
            task_id = data.get("task_id", "STEP-01")
            review_result = ticket_manager.submit_code(task_id)
            self._send_json(review_result)

        elif path == "/api/chat":
            message = data.get("message", "")
            target_member = data.get("target_member", "mentor")
            current_ticket = data.get("current_ticket", "STEP-01")
            reply = chat_bot.reply(message, target_member, current_ticket)
            self._send_json(reply)

        else:
            self._send_json({"error": "API route not found"}, status=404)

    def _build_file_tree(self, root_dir):
        items = []
        for entry in sorted(os.listdir(root_dir)):
            if entry.startswith(".") or entry == "bin":
                continue
            full_path = os.path.join(root_dir, entry)
            rel_path = os.path.relpath(full_path, WORKSPACE_ROOT)
            if os.path.isdir(full_path):
                items.append({
                    "name": entry,
                    "path": rel_path,
                    "type": "directory",
                    "children": self._build_file_tree(full_path)
                })
            else:
                items.append({
                    "name": entry,
                    "path": rel_path,
                    "type": "file"
                })
        return items

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

def run_server(port=8899):
    server_address = ("127.0.0.1", port)
    try:
        httpd = HTTPServer(server_address, NextPayHandler)
    except OSError:
        server_address = ("127.0.0.1", port + 1)
        httpd = HTTPServer(server_address, NextPayHandler)
        port = port + 1

    url = f"http://127.0.0.1:{port}"
    print("=" * 60)
    print(f"🚀 (주)넥스트페이 신입 엔지니어 온보딩 & Web IDE 구동 완료!")
    print(f"📌 접속 URL: {url}")
    print("=" * 60)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다.")
        httpd.server_close()

if __name__ == "__main__":
    port = 8899
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port)
