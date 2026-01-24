
import json, websocket, subprocess, time, os

def copy_to_clipboard(file_path):
    # macOS tool to copy image to clipboard
    script = f'set the clipboard to (read (POSIX file "{file_path}") as «class PNGf»)'
    subprocess.run(['osascript', '-e', script])

def send_cmd(ws, method, params):
    msg = {'id': int(time.time()*1000), 'method': method, 'params': params}
    ws.send(json.dumps(msg))
    # Drain the socket
    res = json.loads(ws.recv())
    return res

print('🔵 正在进行图片自动化替换...')
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
        # JavaScript to find and select the placeholder
        js_find = f'''
        (function() {{
            const e = document.querySelector('.ProseMirror');
            if (!e) return false;
            const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while ((node = walker.nextNode())) {{
                if (node.textContent.includes("{placeholder}")) {{
                    const index = node.textContent.indexOf("{placeholder}");
                    const range = document.createRange();
                    range.setStart(node, index);
                    range.setEnd(node, index + {len(placeholder)});
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    node.parentElement.scrollIntoView({{behavior: "smooth", block: "center"}});
                    return true;
                }}
            }}
            return false;
        }})();
        '''
        res = send_cmd(ws, 'Runtime.evaluate', {'expression': js_find, 'returnByValue': True})
        if res.get('result', {}).get('result', {}).get('value'):
            print(f'   ✅ 发现并记录坐标，准备粘贴: {os.path.basename(path)}')
            copy_to_clipboard(path)
            time.sleep(1) # Wait for clipboard
            
            # 1. Backspace to clear selection
            send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyDown', 'windowsVirtualKeyCode': 8, 'key': 'Backspace', 'code': 'Backspace'})
            send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyUp', 'windowsVirtualKeyCode': 8, 'key': 'Backspace', 'code': 'Backspace'})
            time.sleep(0.5)
            
            # 2. Command + V to paste
            # On Mac, 'modifiers': 4 is Command
            send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyDown', 'modifiers': 4, 'windowsVirtualKeyCode': 86, 'key': 'v', 'code': 'KeyV'})
            send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyUp', 'modifiers': 4, 'windowsVirtualKeyCode': 86, 'key': 'v', 'code': 'KeyV'})
            print(f'   ✨ 已完成替换')
            time.sleep(3) # Wait for upload to WeChat servers
        else:
            print(f'   ⚠️ 未找到占位符')

    print('\n🎉 全部替换流程执行完毕！请刷新微信页面查看最终效果。')

except Exception as e:
    print(f'❌ 错误: {e}')
finally:
    if 'ws' in locals(): ws.close()
