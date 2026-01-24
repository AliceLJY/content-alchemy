
import json, websocket, subprocess, time, os

def copy_to_clipboard(file_path):
    # macOS tool to copy image to clipboard
    script = f'set the clipboard to (read (POSIX file "{file_path}") as «class PNGf»)'
    subprocess.run(['osascript', '-e', script])

def send_cmd(ws, method, params):
    msg = {'id': int(time.time()*1000), 'method': method, 'params': params}
    ws.send(json.dumps(msg))
    return json.loads(ws.recv())

print('🔵 正在进行图片自动化替换-改进版...')
try:
    r = subprocess.run(['curl', '-s', 'http://127.0.0.1:9222/json'], capture_output=True, text=True)
    pages = json.loads(r.stdout)
    editor_page = next((p for p in pages if 'appmsg_edit' in p.get('url', '')), None)
    
    if not editor_page:
        print('❌ 没找到编辑器')
        exit(1)

    ws = websocket.create_connection(editor_page['webSocketDebuggerUrl'])
    print(f'✅ 已连接: {editor_page["title"]}')

    images = [
        ('[[IMAGE_PLACEHOLDER_1]]', '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/ai_agent_content_creation_cover_1769190702934.png'),
        ('[[IMAGE_PLACEHOLDER_2]]', '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/langgraph_workflow_diagram_1769191157147.png'),
        ('[[IMAGE_PLACEHOLDER_3]]', '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/multi_agent_collaboration_1769191181007.png')
    ]

    for placeholder, path in images:
        print(f'🖼️ 正在寻觅占位符: {placeholder}')
        
        # JS to select the placeholder text rigorously
        js_select = f'''
        (() => {{
            const editor = document.querySelector('.ProseMirror');
            const findText = (node) => {{
                if (node.nodeType === 3) {{ // Text node
                    const idx = node.textContent.indexOf("{placeholder}");
                    if (idx !== -1) {{
                        const range = document.createRange();
                        range.setStart(node, idx);
                        range.setEnd(node, idx + {len(placeholder)});
                        const sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                        node.parentElement.scrollIntoView({{behavior: "auto", block: "center"}});
                        return true;
                    }}
                }}
                for (let child of node.childNodes) {{
                    if (findText(child)) return true;
                }}
                return false;
            }};
            return findText(editor);
        }})()
        '''
        
        res = send_cmd(ws, 'Runtime.evaluate', {'expression': js_select, 'returnByValue': True})
        if res.get('result', {}).get('result', {}).get('value'):
            print(f'   ✅ 已选中，准备粘贴...')
            copy_to_clipboard(path)
            time.sleep(1)
            
            # Use Input.dispatchKeyEvent for Backspace and Paste
            # Backspace
            send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyDown', 'windowsVirtualKeyCode': 8, 'key': 'Backspace', 'code': 'Backspace'})
            send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyUp', 'windowsVirtualKeyCode': 8, 'key': 'Backspace', 'code': 'Backspace'})
            time.sleep(0.5)
            
            # Cmd + V
            send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyDown', 'modifiers': 4, 'windowsVirtualKeyCode': 86, 'key': 'v', 'code': 'KeyV'})
            send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyUp', 'modifiers': 4, 'windowsVirtualKeyCode': 86, 'key': 'v', 'code': 'KeyV'})
            print(f'   ✨ 已粘贴图片')
            time.sleep(4) # Waiting for upload
        else:
            print(f'   ⚠️ 未在 DOM 中发现此占位符')

    print('\n🎉 自动化流程全部闭环！')

except Exception as e:
    print(f'❌ 错误: {e}')
finally:
    if 'ws' in locals(): ws.close()
