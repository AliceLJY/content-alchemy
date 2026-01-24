
import json, websocket, subprocess, time, os

def copy_to_clipboard(file_path):
    # On Mac, use AppleScript to copy image to clipboard
    script = f'set the clipboard to (read (POSIX file "{file_path}") as «class PNGf»)'
    subprocess.run(['osascript', '-e', script])

print('🔵 连接 Chrome...')
try:
    r = subprocess.run(['curl', '-s', 'http://127.0.0.1:9222/json'], capture_output=True, text=True)
    pages = json.loads(r.stdout)
    # Find the editor tab
    editor_page = None
    for page in pages:
        if 'mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit' in page.get('url', ''):
            editor_page = page
            break
    
    if not editor_page:
        print('❌ 没找到微信编辑器页面，请确保编辑器已打开')
        exit(1)

    ws_url = editor_page['webSocketDebuggerUrl']
    ws = websocket.create_connection(ws_url)
    print(f'✅ 已连接到: {editor_page["title"]}')

    # Load Article
    title = 'AI Agent 如何改变内容创作流程'
    html_body_path = '/tmp/final_rendered_article.html'
    with open(html_body_path, 'r') as f:
        full_html = f.read()
    
    # Extract just the content inside #output
    import re
    match = re.search(r'<div id="output">([\s\S]*)</div>', full_html)
    content = match.group(1) if match else full_html

    # Inject Title and Body
    js_inject = f'''
    (function() {{
        const t = document.querySelector('#title') || document.querySelector('#js_editor_title');
        if (t) {{ t.value = {json.dumps(title)}; t.dispatchEvent(new Event('input', {{bubbles: true}})); }}
        
        const editor = document.querySelector('.ProseMirror') || document.querySelector('.editor');
        if (editor) {{
            editor.innerHTML = '';
            editor.insertAdjacentHTML('beforeend', {json.dumps(content)});
            editor.dispatchEvent(new Event('input', {{bubbles: true}}));
            return {{ok: true, len: editor.textContent.length}};
        }}
        return {{ok: false}};
    }})();
    '''
    
    def send_cmd(method, params):
        msg = {'id': int(time.time()*1000), 'method': method, 'params': params}
        ws.send(json.dumps(msg))
        return json.loads(ws.recv())

    res = send_cmd('Runtime.evaluate', {'expression': js_inject, 'returnByValue': True})
    v = res.get('result', {}).get('result', {}).get('value', {})
    
    if v.get('ok'):
        print(f'✅ 正文注入成功！长度: {v.get("len")}')
        
        # Now handle images
        images = [
            {'placeholder': '[[IMAGE_PLACEHOLDER_1]]', 'path': '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/ai_agent_content_creation_cover_1769190702934.png'},
            {'placeholder': '[[IMAGE_PLACEHOLDER_2]]', 'path': '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/langgraph_workflow_diagram_1769191157147.png'},
            {'placeholder': '[[IMAGE_PLACEHOLDER_3]]', 'path': '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/multi_agent_collaboration_1769191181007.png'}
        ]
        
        for img in images:
            placeholder = img['placeholder']
            local_path = img['path']
            print(f'🖼️ 正在处理图片: {placeholder} -> {os.path.basename(local_path)}')
            
            # Select placeholder
            js_select = f'''
            (function() {{
                const editor = document.querySelector('.ProseMirror') || document.querySelector('.editor');
                const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null, false);
                let node;
                while ((node = walker.nextNode())) {{
                    if (node.textContent.includes("{placeholder}")) {{
                        const idx = node.textContent.indexOf("{placeholder}");
                        const range = document.createRange();
                        range.setStart(node, idx);
                        range.setEnd(node, idx + {len(placeholder)});
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
            sel_res = send_cmd('Runtime.evaluate', {'expression': js_select, 'returnByValue': True})
            if sel_res.get('result', {}).get('result', {}).get('value'):
                # Copy to clipboard
                copy_to_clipboard(local_path)
                time.sleep(0.5)
                # Press Backspace then Cmd+V
                # Backspace
                send_cmd('Input.dispatchKeyEvent', {'type': 'keyDown', 'windowsVirtualKeyCode': 8, 'key': 'Backspace', 'code': 'Backspace'})
                send_cmd('Input.dispatchKeyEvent', {'type': 'keyUp', 'windowsVirtualKeyCode': 8, 'key': 'Backspace', 'code': 'Backspace'})
                time.sleep(0.2)
                # Cmd+V
                send_cmd('Input.dispatchKeyEvent', {'type': 'keyDown', 'modifiers': 4, 'windowsVirtualKeyCode': 86, 'key': 'v', 'code': 'KeyV'})
                send_cmd('Input.dispatchKeyEvent', {'type': 'keyUp', 'modifiers': 4, 'windowsVirtualKeyCode': 86, 'key': 'v', 'code': 'KeyV'})
                print('   ✅ 已粘贴')
                time.sleep(2)
            else:
                print(f'   ⚠️ 未找到占位符: {placeholder}')

        print('\n🎉 全部完成！请检查预览。')
    else:
        print('\n❌ 注入失败，可能选择器不匹配')

except Exception as e:
    print(f'❌ 错误: {e}')
finally:
    if 'ws' in locals():
        ws.close()
