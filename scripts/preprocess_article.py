#!/usr/bin/env python3
"""
Content Alchemy - 文章预处理脚本
功能：
1. 将 Markdown 转换为 HTML
2. CSS 内联化
3. 占位符转换（[[IMAGE:xxx]] -> <!--IMG:xxx-->）
4. 中文标点符号规范化
"""

import sys
import os
import re
from pathlib import Path

def read_markdown(filepath):
    """读取 Markdown 文件"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def convert_placeholders(content):
    """
    转换图片占位符
    [[IMAGE:filename.jpg]] -> <!--IMG:filename.jpg-->
    """
    pattern = r'\[\[IMAGE:([^\]]+)\]\]'
    replacement = r'<!--IMG:\1-->'
    return re.sub(pattern, replacement, content)

def normalize_punctuation(content):
    """规范化中文标点符号"""
    code_blocks = []
    
    def save_code_block(match):
        code_blocks.append(match.group(0))
        return f"__CODE_BLOCK_{len(code_blocks)-1}__"
    
    content = re.sub(r'```[\s\S]*?```', save_code_block, content)
    content = re.sub(r'`[^`]+`', save_code_block, content)
    
    replacements = {
        ',': '，', '.': '。', '!': '！', '?': '？',
        ':': '：', ';': '；', '(': '（', ')': '）',
    }
    
    for en, zh in replacements.items():
        content = re.sub(f'([\u4e00-\u9fff]){re.escape(en)}', f'\\1{zh}', content)
        content = re.sub(f'{re.escape(en)}([\u4e00-\u9fff])', f'{zh}\\1', content)
    
    for i, code in enumerate(code_blocks):
        content = content.replace(f"__CODE_BLOCK_{i}__", code)
    
    return content

def markdown_to_html_basic(md_content):
    """基础 Markdown 转 HTML"""
    html = md_content
    
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    html = re.sub(r'`(.+?)`', r'<code>\1</code>', html)
    
    lines = html.split('\n')
    processed = []
    in_p = False
    
    for line in lines:
        s = line.strip()
        if not s:
            if in_p:
                processed.append('</p>')
                in_p = False
        elif s.startswith('<h') or s.startswith('<!--'):
            if in_p:
                processed.append('</p>')
                in_p = False
            processed.append(line)
        else:
            if not in_p:
                processed.append('<p>')
                in_p = True
            processed.append(line)
    
    if in_p:
        processed.append('</p>')
    
    return '\n'.join(processed)

def process_article(input_path):
    md = read_markdown(input_path)
    md = convert_placeholders(md)
    md = normalize_punctuation(md)
    html = markdown_to_html_basic(md)
    
    output_path = input_path.replace('.md', '_processed.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    return output_path

def main():
    if len(sys.argv) < 2:
        print('用法: python3 preprocess_article.py <markdown_file>', file=sys.stderr)
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    if not os.path.exists(input_file):
        print(f'错误: 文件不存在: {input_file}', file=sys.stderr)
        sys.exit(1)
    
    try:
        output_file = process_article(input_file)
        print(output_file)
    except Exception as e:
        print(f'错误: {str(e)}', file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
