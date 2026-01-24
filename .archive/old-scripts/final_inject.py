
#!/usr/bin/env python3
import json, websocket, subprocess, time, os, re

def copy_to_clipboard(file_path):
    script = f'set the clipboard to (read (POSIX file "{file_path}") as «class PNGf»)'
    subprocess.run(['osascript', '-e', script])

def send_cmd(ws, method, params):
    msg = {'id': int(time.time()*1000), 'method': method, 'params': params}
    ws.send(json.dumps(msg))
    return json.loads(ws.recv())

print('🔵 正在寻找微信编辑器窗口...')
try:
    r = subprocess.run(['curl', '-s', 'http://127.0.0.1:9222/json'], capture_output=True, text=True)
    pages = json.loads(r.stdout)
    editor_page = next((p for p in pages if 'mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit' in p.get('url', '')), None)
    
    if not editor_page:
        print('❌ 没找到编辑器标签页，请先在 Chrome 中点开文章编辑页面')
        exit(1)

    ws = websocket.create_connection(editor_page['webSocketDebuggerUrl'])
    print(f'✅ 已连接到: {editor_page["title"]}')

    # Activate the tab
    send_cmd(ws, 'Page.bringToFront', {})
    time.sleep(1)

    # Prepare Content
    title = 'AI Agent 如何改变内容创作流程'
    with open('/tmp/final_rendered_article.html', 'r') as f:
        content = f.read()
    
    # Simple extraction
    match = re.search(r'<div id="output">([\s\S]*)</div>', content)
    body_content = match.group(1) if match else content

    # Inject
    js_inject = f'''
    (function() {{
        const t = document.querySelector('#title') || document.querySelector('#js_editor_title');
        if (t) {{ t.value = {json.dumps(title)}; t.dispatchEvent(new Event('input', {{bubbles: true}})); }}
        
        const e = document.querySelector('.ProseMirror') || document.querySelector('.editor');
        if (e) {{
            e.focus();
            e.innerHTML = '';
            document.execCommand('insertHTML', false, {json.dumps(body_content)});
            e.dispatchEvent(new Event('input', {{bubbles: true}}));
            return {{ok: true, len: e.textContent.length}};
        }}
        return {{ok: false}};
    }})();
    '''
    
    res = send_cmd(ws, 'Runtime.evaluate', {'expression': js_inject, 'returnByValue': True})
    v = res.get('result', {}).get('result', {}).get('value', {})

    if v.get('ok'):
        print(f'✅ 正文注入成功 (长度: {v.get("len")})')
        
        # Images
        images = [
            ('[[IMAGE_PLACEHOLDER_1]]', '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/ai_agent_content_creation_cover_1769190702934.png'),
            ('[[IMAGE_PLACEHOLDER_2]]', '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/langgraph_workflow_diagram_1769191157147.png'),
            ('[[IMAGE_PLACEHOLDER_3]]', '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/multi_agent_collaboration_1769191181007.png')
        ]
        
        for placeholder, path in images:
            print(f'🖼️ 正在插入: {placeholder}')
            js_find = f'''
            (function() {{
                const e = document.querySelector('.ProseMirror') || document.querySelector('.editor');
                const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, null, false);
                let node;
                while ((node = walker.nextNode())) {{
                    if (node.textContent.includes("{placeholder}")) {{
                        const start = node.textContent.indexOf("{placeholder}");
                        const range = document.createRange();
                        range.setStart(node, start);
                        range.setEnd(node, start + {len(placeholder)});
                        const sel = window.getSelection();
                        sel.removeAllRanges(); sel.addRange(range);
                        node.parentElement.scrollIntoView({{behavior: "smooth", block: "center"}});
                        return true;
                    }}
                }}
                return false;
            }})();
            '''
            if send_cmd(ws, 'Runtime.evaluate', {'expression': js_find, 'returnByValue': True}).get('result', {}).get('result', {}).get('value'):
                copy_to_clipboard(path)
                time.sleep(0.5)
                send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyDown', 'windowsVirtualKeyCode': 8, 'key': 'Backspace'})
                send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyUp', 'windowsVirtualKeyCode': 8, 'key': 'Backspace'})
                time.sleep(0.2)
                send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyDown', 'modifiers': 4, 'windowsVirtualKeyCode': 86, 'key': 'v', 'code': 'KeyV'})
                send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyUp', 'modifiers': 4, 'windowsVirtualKeyCode': 86, 'key': 'v', 'code': 'KeyV'})
                print('   ✅ 已粘贴')
                time.sleep(2)

        print('\n🎉 任务完成！')
    else:
        print('❌ 失败：未找到编辑器容器')

except Exception as e:
    print(f'❌ 致命错误: {e}')
finally:
    if 'ws' in locals(): ws.close()
