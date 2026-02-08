#!/usr/bin/env bun
import { marked } from 'marked';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

interface ImageInfo {
  placeholder: string;
  localPath: string;
  originalPath: string;
}

interface ParseResult {
  title: string;
  author: string;
  summary: string;
  htmlPath: string;
  contentImages: ImageInfo[];
}

// 简化的 Markdown 转 HTML 工具
// 专门为微信公众号优化

function extractTitle(markdown: string): string {
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  return h1Match ? h1Match[1].trim() : '';
}

function extractSummary(markdown: string): string {
  // 查找引用块中的导读
  const quoteMatch = markdown.match(/>\s*\*\*导读\*\*[：:]\s*(.+?)(?:\n|$)/);
  if (quoteMatch) return quoteMatch[1].trim();

  // 或者找第一个段落
  const lines = markdown.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('![')) continue;
    if (trimmed.startsWith('>')) continue;
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) continue;
    if (/^\d+\./.test(trimmed)) continue;

    const cleanText = trimmed
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1');

    if (cleanText.length > 20) {
      return cleanText.length > 120 ? cleanText.slice(0, 117) + '...' : cleanText;
    }
  }
  return '';
}

async function processMarkdown(markdownPath: string): Promise<ParseResult> {
  const content = fs.readFileSync(markdownPath, 'utf-8');
  const baseDir = path.dirname(markdownPath);
  const tempDir = path.join(os.tmpdir(), 'wechat-article-images');

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const title = extractTitle(content);
  const author = ''; // 可以从 frontmatter 提取
  const summary = extractSummary(content);

  // 处理图片: 替换为占位符
  // 支持标准 Markdown 格式: ![alt](path)
  // 也支持中文符号格式: ！【alt】（path）
  const images: Array<{ src: string; placeholder: string }> = [];
  let imageCounter = 0;

  let modifiedMarkdown = content;

  // 1. 处理标准格式
  modifiedMarkdown = modifiedMarkdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    const placeholder = `WECHATIMGPH_${++imageCounter}`;
    images.push({ src: src.trim(), placeholder });
    return placeholder;
  });

  // 2. 处理中文符号格式 (Antigravity 生成的)
  modifiedMarkdown = modifiedMarkdown.replace(/！【([^】]*)】（([^）]+)）/g, (match, alt, src) => {
    const placeholder = `WECHATIMGPH_${++imageCounter}`;
    // 处理文件名中的中文句号
    const cleanSrc = src.replace(/。/g, '.').trim();
    images.push({ src: cleanSrc, placeholder });
    return placeholder;
  });

  // 使用 marked 转换
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  let html = marked.parse(modifiedMarkdown) as string;

  // 读取专业的微信公众号样式
  const stylesPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'wechat-styles.css');
  const wechatStyles = fs.readFileSync(stylesPath, 'utf-8');

  // 添加样式到 HTML
  html = `
<style>
${wechatStyles}
</style>
${html}
  `;

  // 写入 HTML 文件
  const htmlPath = path.join(tempDir, 'temp-article.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');

  // 解析图片路径
  const contentImages: ImageInfo[] = [];
  for (const img of images) {
    let localPath: string;

    if (img.src.startsWith('http://') || img.src.startsWith('https://')) {
      // 对于 URL 图片,记录但不下载 (可以让用户手动处理)
      console.error(`[simple-md] Warning: Remote image not downloaded: ${img.src}`);
      localPath = img.src; // 保留原路径
    } else if (path.isAbsolute(img.src)) {
      localPath = img.src;
    } else {
      localPath = path.resolve(baseDir, img.src);
    }

    contentImages.push({
      placeholder: img.placeholder,
      localPath,
      originalPath: img.src,
    });
  }

  return {
    title,
    author,
    summary,
    htmlPath,
    contentImages,
  };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`Simple Markdown to WeChat HTML Converter

Usage:
  bun simple-md-to-html.ts <markdown_file>

Output: JSON with title, htmlPath, and image placeholders
`);
    process.exit(args.includes('--help') ? 0 : 1);
  }

  const markdownPath = path.resolve(process.cwd(), args[0]);

  if (!fs.existsSync(markdownPath)) {
    console.error(`File not found: ${markdownPath}`);
    process.exit(1);
  }

  const result = await processMarkdown(markdownPath);
  console.log(JSON.stringify(result, null, 2));
}

await main();
