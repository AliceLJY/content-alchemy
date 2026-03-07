#!/usr/bin/env python3
"""
Content Alchemy - 文章预处理脚本
功能：
1. 将 Markdown 转换为 HTML
2. 占位符转换（[[IMAGE:xxx]] -> <!--IMG:xxx-->）
3. 中文标点符号规范化

Note: CSS inlining is handled downstream by content-publisher's format-wechat.ts
"""

import sys
import re
import argparse
from pathlib import Path

IMAGE_PLACEHOLDER_RE = re.compile(r'\[\[IMAGE:([^\]]+)\]\]')
FENCED_CODE_RE = re.compile(r'```[\s\S]*?```')
INLINE_CODE_RE = re.compile(r'`[^`]+`')
CJK_CHAR_RE = r'[\u4e00-\u9fff]'
FRONTMATTER_RE = re.compile(r'^---\r?\n[\s\S]*?\r?\n---\r?\n?')

def read_markdown(filepath: Path) -> str:
    """读取 Markdown 文件"""
    return filepath.read_text(encoding='utf-8')

def convert_placeholders(content):
    """
    转换图片占位符
    [[IMAGE:filename.jpg]] -> <!--IMG:filename.jpg-->
    """
    return IMAGE_PLACEHOLDER_RE.sub(r'<!--IMG:\1-->', content)

def normalize_punctuation(content):
    """规范化中文标点符号"""
    code_blocks = []
    
    def save_code_block(match):
        code_blocks.append(match.group(0))
        return f"__CODE_BLOCK_{len(code_blocks)-1}__"
    
    content = FENCED_CODE_RE.sub(save_code_block, content)
    content = INLINE_CODE_RE.sub(save_code_block, content)
    
    replacements = {
        ',': '，', '.': '。', '!': '！', '?': '？',
        ':': '：', ';': '；', '(': '（', ')': '）',
    }
    
    for en, zh in replacements.items():
        content = re.sub(f'({CJK_CHAR_RE}){re.escape(en)}', f'\\1{zh}', content)
        content = re.sub(f'{re.escape(en)}({CJK_CHAR_RE})', f'{zh}\\1', content)
    
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

def strip_frontmatter(content: str) -> str:
    """移除 YAML frontmatter，避免被当作正文渲染进 HTML"""
    return FRONTMATTER_RE.sub('', content, count=1)

def build_output_path(input_path: Path, output_path: str | None) -> Path:
    if output_path:
        return Path(output_path).expanduser().resolve()
    return input_path.with_name(f"{input_path.stem}_processed.html")

def validate_output_path(output_path: Path) -> None:
    parent = output_path.parent
    if not parent.exists():
        raise FileNotFoundError(f'输出目录不存在: {parent}')
    if not parent.is_dir():
        raise NotADirectoryError(f'输出目录不是目录: {parent}')

def process_article(input_path: Path, output_path: Path) -> Path:
    md = read_markdown(input_path)
    md = strip_frontmatter(md)
    md = convert_placeholders(md)
    md = normalize_punctuation(md)
    html = markdown_to_html_basic(md)

    output_path.write_text(html, encoding='utf-8')

    return output_path

def parse_args():
    parser = argparse.ArgumentParser(
        description='Content Alchemy article preprocessor',
        epilog='Default output: <input>_processed.html',
    )
    parser.add_argument('markdown_file', nargs='?', help='Input markdown file')
    parser.add_argument('-o', '--output', help='Custom output HTML path')
    args = parser.parse_args()

    if not args.markdown_file:
        parser.print_usage(sys.stderr)
        print('错误: 需要提供 markdown 文件路径', file=sys.stderr)
        sys.exit(1)

    return args

def main():
    args = parse_args()
    input_file = Path(args.markdown_file).expanduser().resolve()

    if not input_file.exists():
        print(f'错误: 文件不存在: {input_file}', file=sys.stderr)
        sys.exit(1)

    if not input_file.is_file():
        print(f'错误: 不是文件: {input_file}', file=sys.stderr)
        sys.exit(1)

    try:
        output_file = build_output_path(input_file, args.output)
        validate_output_path(output_file)
        output_file = process_article(input_file, output_file)
        print(output_file)
    except Exception as e:
        print(f'错误: {str(e)}', file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
