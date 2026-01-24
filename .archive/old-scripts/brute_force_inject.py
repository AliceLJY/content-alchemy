
#!/usr/bin/env python3
import json, websocket, subprocess, time, os, re

def send_cmd(ws, method, params):
    msg = {'id': int(time.time()*1000), 'method': method, 'params': params}
    ws.send(json.dumps(msg))
    return json.loads(ws.recv())

print('🔵 正在进行深度扫描注入...')
try:
    r = subprocess.run(['curl', '-s', 'http://127.0.0.1:9222/json'], capture_output=True, text=True)
    pages = json.loads(r.stdout)
    editor_page = next((p for p in pages if 'mp.weixin.qq.com' in p.get('url', '') and 'edit' in p.get('url', '')), None)
    
    if not editor_page:
        print('❌ 没找到微信相关页面，请确保已打开编辑器')
        exit(1)

    ws = websocket.create_connection(editor_page['webSocketDebuggerUrl'])
    print(f'✅ 已连接到: {editor_page["title"]}')

    # Load Content
    with open('/tmp/final_rendered_article.html', 'r') as f:
        html = f.read()
    match = re.search(r'<div id="output">([\s\S]*)</div>', html)
    body = match.group(1) if match else html

    # Universal Discovery and Inject JS
    js_universal = f'''
    (function() {{
        // 1. Title
        const titleEl = document.querySelector('#title, #js_editor_title, input[placeholder*="标题"]');
        if (titleEl) {{ 
            titleEl.value = "AI Agent 如何改变内容创作流程"; 
            titleEl.dispatchEvent(new Event('input', {{bubbles: true}})); 
        }}
        
        // 2. Body Discovery
        let editor = document.querySelector('.ProseMirror, .editor, #js_content, [contenteditable="true"]');
        
        if (!editor) {{
            // Deep scan
            const all = document.querySelectorAll('div, section, article');
            for (let el of all) {{
                if (el.getAttribute('contenteditable') === 'true' || el.className.includes('editor')) {{
                    editor = el;
                    break;
                }}
            }}
        }}

        if (editor) {{
            editor.focus();
            // Clear and Insert
            editor.innerHTML = '';
            const success = document.execCommand('insertHTML', false, {json.dumps(body)});
            editor.dispatchEvent(new Event('input', {{bubbles: true}}));
            return {{ok: true, tag: editor.tagName, class: editor.className}};
        }}
        return {{ok: false}};
    }})();
    '''
    
    res = send_cmd(ws, 'Runtime.evaluate', {'expression': js_universal, 'returnByValue': True})
    v = res.get('result', {}).get('result', {}).get('value', {})

    if v.get('ok'):
        print(f'✅ 成功发现并注入编辑器！标签: {v.get("tag")}, 类名: {v.get("class")}')
        print('🎉 任务完成。图片由于占位符已注入，您只需点击“图片”上传即可（全自动图片粘贴需稳定选择器，当前环境建议手动补全图片）。')
    else:
        print('❌ 即使是深度扫描也未发现编辑器，请确认您是否正处于“图文消息”编辑界面。')

except Exception as e:
    print(f'❌ 报错: {e}')
finally:
    if 'ws' in locals(): ws.close()
