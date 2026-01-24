#!/usr/bin/env python3
import sys
import os
import re

def fix_image_syntax(content):
    '''修复中文标点的图片语法'''
    # 匹配：！【alt】（filename。png）
    pattern = r'！【([^】]+)】（([^）]+)。(png|jpg|jpeg|gif)）'
    
    def replace_func(match):
        alt = match.group(1)
        filename = match.group(2)
        ext = match.group(3)
        # 转换为标准 Markdown
        return f'![{alt}]({filename}.{ext})'
    
    return re.sub(pattern, replace_func, content)

def convert_placeholders(content):
    '''转换占位符'''
    # [[IMAGE:xxx]] -> <!--IMG:xxx-->
    content = re.sub(r'\[\[IMAGE:([^\]]+)\]\]', r'<!--IMG:\1-->', content)
    return content

def main():
    if len(sys.argv) < 2:
        print('Usage: python3 fix_images.py <file>', file=sys.stderr)
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 修复图片语法
    content = fix_image_syntax(content)
    
    # 转换占位符
    content = convert_placeholders(content)
    
    # 输出到临时文件
    output = filepath.replace('.md', '_fixed.md')
    with open(output, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(output)

if __name__ == '__main__':
    main()
