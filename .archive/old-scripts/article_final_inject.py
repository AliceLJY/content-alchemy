
import json, websocket, subprocess, time, os, re

def copy_to_clipboard(file_path):
    # macOS tool to copy image to clipboard
    script = f'set the clipboard to (read (POSIX file "{file_path}") as «class PNGf»)'
    subprocess.run(['osascript', '-e', script])

def send_cmd(ws, method, params):
    msg = {'id': int(time.time()*1000), 'method': method, 'params': params}
    ws.send(json.dumps(msg))
    return json.loads(ws.recv())

print('🔵 正在连接文章编辑器...')
try:
    r = subprocess.run(['curl', '-s', 'http://127.0.0.1:9222/json'], capture_output=True, text=True)
    pages = json.loads(r.stdout)
    # Target the specific article editor tab
    editor_page = next((p for p in pages if 'media/appmsg_edit' in p.get('url', '')), None)
    
    if not editor_page:
        print('❌ 没找到活跃的文章编辑器，请确保已经在浏览器中打开了“文章”编辑页')
        exit(1)

    ws = websocket.create_connection(editor_page['webSocketDebuggerUrl'])
    print(f'✅ 已连接: {editor_page["title"]}')
    
    send_cmd(ws, 'Page.bringToFront', {})

    # Content
    title = 'AI Agent 如何改变内容创作流程'
    with open('/tmp/final_rendered_article.html', 'r') as f:
        full_html = f.read()

    # The Core Injector with CSS Inlining
    js_inject = f'''
    (function() {{
        const title = {json.dumps(title)};
        const fullHtml = {json.dumps(full_html)};
        
        // 1. Prepare a temporary container for inlining
        const temp = document.createElement('div');
        temp.style.display = 'none';
        temp.innerHTML = fullHtml;
        document.body.appendChild(temp);
        
        // 2. Inline CSS from <style> blocks
        const styles = temp.querySelectorAll('style');
        styles.forEach(styleTag => {{
            const sheet = document.createElement('style');
            sheet.textContent = styleTag.textContent;
            document.head.appendChild(sheet);
            try {{
                const rules = sheet.sheet.cssRules;
                for (let i = 0; i < rules.length; i++) {{
                    const rule = rules[i];
                    if (rule.selectorText) {{
                        const elements = temp.querySelectorAll(rule.selectorText);
                        elements.forEach(el => {{
                            // Merge styles
                            el.style.cssText += ';' + rule.style.cssText;
                        }});
                    }}
                }}
            }} catch (e) {{ console.error("CSS Inline Error:", e); }}
            document.head.removeChild(sheet);
            styleTag.remove();
        }});
        
        // 3. Extract content from #output
        const outputNode = temp.querySelector('#output') || temp;
        // Wrap with a WeChat-safe section to prevent layout breakdown
        const wrapperStyle = "max-width: 100%; box-sizing: border-box; overflow-wrap: break-word; font-family: -apple-system-font,BlinkMacSystemFont,'Helvetica Neue','PingFang SC','Hiragino Sans GB','Microsoft YaHei UI','Microsoft YaHei',Arial,sans-serif; font-size: 16px; padding: 10px; line-height: 1.6;";
        const wrappedContent = `<section style="${{wrapperStyle}}">${{outputNode.innerHTML}}</section>`;
        
        document.body.removeChild(temp);
        
        // 4. Update Title
        const t = document.querySelector('#title') || document.querySelector('#js_editor_title');
        if (t) {{ 
            t.value = title; 
            t.dispatchEvent(new Event('input', {{bubbles: true}})); 
        }}
        
        // 5. Inject Body
        let editor = document.querySelector('.ProseMirror') || document.querySelector('[contenteditable="true"]');
        if (editor) {{
            editor.focus();
            editor.innerHTML = '';
            // Using execCommand for undo-stack and better compatibility with editor events
            document.execCommand('insertHTML', false, wrappedContent);
            editor.dispatchEvent(new Event('input', {{bubbles: true}}));
            return {{ok: true, len: editor.innerText.length}};
        }}
        return {{ok: false}};
    }})();
    '''
    
    res = send_cmd(ws, 'Runtime.evaluate', {'expression': js_inject, 'returnByValue': True})
    v = res.get('result', {}).get('result', {}).get('value', {})

    if v.get('ok'):
        print(f'✅ 正文注入 (带CSS内联) 成功 (长度: {v.get("len")})')
        
        # Images (One by one)
        # Using images from the actual context if available
        images = [
            ('[[IMAGE_PLACEHOLDER_1]]', '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/ai_agent_content_creation_cover_1769190702934.png'),
            ('[[IMAGE_PLACEHOLDER_2]]', '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/langgraph_workflow_diagram_1769191157147.png'),
            ('[[IMAGE_PLACEHOLDER_3]]', '/Users/anxianjingya/content-alchemy-repo/ai-agent-content-creation/multi_agent_collaboration_1769191181007.png')
        ]
        
        for placeholder, path in images:
            if not os.path.exists(path):
                print(f'⚠️ 图片不存在，跳过: {path}')
                continue
                
            print(f'🖼️ 正在处理图片: {placeholder}')
            js_find = f'''
            (function() {{
                const e = document.querySelector('.ProseMirror') || document.querySelector('[contenteditable="true"]');
                const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, null, false);
                let node;
                while ((node = walker.nextNode())) {{
                    if (node.textContent.includes("{placeholder}")) {{
                        const idx = node.textContent.indexOf("{placeholder}");
                        const range = document.createRange();
                        range.setStart(node, idx);
                        range.setEnd(node, idx + {len(placeholder)});
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
                # Select and Replace
                send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyDown', 'windowsVirtualKeyCode': 8, 'key': 'Backspace'})
                send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyUp', 'windowsVirtualKeyCode': 8, 'key': 'Backspace'})
                time.sleep(0.1)
                # Paste
                send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyDown', 'modifiers': 4, 'windowsVirtualKeyCode': 86, 'key': 'v'})
                send_cmd(ws, 'Input.dispatchKeyEvent', {'type': 'keyUp', 'modifiers': 4, 'windowsVirtualKeyCode': 86, 'key': 'v'})
                print('   ✅ 已替换')
                time.sleep(2.0) # Wait for upload

        print('\n🚀 注入全部完成！请检查预览。若排版仍有问题，请告知。')
    else:
        print('❌ 注入失败：未找到编辑器容器')

except Exception as e:
    print(f'❌ 报错: {e}')
finally:
    if 'ws' in locals(): ws.close()
