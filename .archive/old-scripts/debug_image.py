
import json, websocket, subprocess, time, os

def copy_to_clipboard(file_path):
    script = f'set the clipboard to (read (POSIX file "{file_path}") as «class PNGf»)'
    subprocess.run(['osascript', '-e', script])

def send_cmd(ws, method, params):
    msg = {'id': int(time.time()*1000), 'method': method, 'params': params}
    ws.send(json.dumps(msg))
    return json.loads(ws.recv())

print('🔵 调试模式：图片替换...')
try:
    r = subprocess.run(['curl', '-s', 'http://127.0.0.1:9222/json'], capture_output=True, text=True)
    pages = json.loads(r.stdout)
    editor_page = next((p for p in pages if 'appmsg_edit' in p.get('url', '')), None)
    ws = websocket.create_connection(editor_page['webSocketDebuggerUrl'])
    
    # DEBUG: Get text
    get_text_js = "document.querySelector('.ProseMirror').innerText"
    res = send_cmd(ws, 'Runtime.evaluate', {'expression': get_text_js, 'returnByValue': True})
    text = res.get('result', {}).get('result', {}).get('value', '')
    print(f"DEBUG: Found body text (first 100 chars): {repr(text[:100])}")
    
    if '[[IMAGE_PLACEHOLDER_1]]' in text:
        print("✅ Python script CAN see the placeholder in text.")
    else:
        print("❌ Python script CANNOT see the placeholder in text.")

    images = [
        ('[[IMAGE_PLACEHOLDER_1]]', '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/ai_agent_content_creation_cover_1769190702934.png'),
    ]

    for placeholder, path in images:
        # Try a different approach: Replace text with a unique string FIRST, then find that.
        js_replace = f'''
        (() => {{
            const e = document.querySelector('.ProseMirror');
            if (e.innerHTML.includes("{placeholder}")) {{
                e.innerHTML = e.innerHTML.replace("{placeholder}", "HERE_IS_IMAGE_1");
                return true;
            }}
            return false;
        }})()
        '''
        res = send_cmd(ws, 'Runtime.evaluate', {'expression': js_replace, 'returnByValue': True})
        print(f"DEBUG: HTML replace result for {placeholder}: {res}")

except Exception as e:
    print(f'❌ 错误: {e}')
finally:
    if 'ws' in locals(): ws.close()
