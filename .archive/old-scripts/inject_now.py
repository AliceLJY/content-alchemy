#!/usr/bin/env python3
import json, websocket, subprocess, time

print('🔵 连接 Chrome...')
r = subprocess.run(['curl', '-s', 'http://127.0.0.1:9222/json/version'], capture_output=True, text=True)
ws_url = json.loads(r.stdout)['webSocketDebuggerUrl']
ws = websocket.create_connection(ws_url)
print('✅ 已连接')

title = 'AI Agent 如何改变内容创作流程'
content = '<h2>测试</h2><p>这是测试内容</p>'

js = f'''
(function() {{
    const t = document.querySelector('#js_editor_title');
    if (t) {{ t.value = {json.dumps(title)}; t.dispatchEvent(new Event('input', {{bubbles: true}})); }}
    const e = document.querySelector('.editor');
    if (e) {{
        e.innerHTML = '';
        e.insertAdjacentHTML('beforeend', {json.dumps(content)});
        e.dispatchEvent(new Event('input', {{bubbles: true}}));
        return {{ok: true, len: e.textContent.length}};
    }}
    return {{ok: false}};
}})();
'''

msg = {{'id': int(time.time()*1000), 'method': 'Runtime.evaluate', 'params': {{'expression': js, 'returnByValue': True}}}}
ws.send(json.dumps(msg))
res = json.loads(ws.recv())

v = res.get('result', {{}}).get('result', {{}}).get('value', {{}})
if v.get('ok'):
    print(f'\n✅ 成功！长度: {{v.get("len")}}')
else:
    print('\n❌ 失败')
ws.close()
