#!/usr/bin/env bun
/**
 * 修复微信公众号粘贴问题的补丁
 *
 * 问题: Baoyu 打开新标签页复制 HTML 后，回到编辑器时微信拒绝粘贴
 * 原因: 微信编辑器检测到页面失焦后，会阻止粘贴操作
 *
 * 解决方案: 直接将 HTML 内容写入剪贴板，不打开新标签页
 */

import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

/**
 * 直接将 HTML 内容复制到剪贴板
 * 不需要打开新标签页，避免焦点丢失
 */
function copyHtmlToClipboard(htmlFilePath: string): boolean {
  const html = fs.readFileSync(htmlFilePath, 'utf-8');

  // 提取 #output 或 body 内容
  let content = html;

  // 尝试提取 <div id="output">...</div> 的内容
  const outputMatch = html.match(/<div id="output">([\s\S]*?)<\/div>/i);
  if (outputMatch) {
    content = outputMatch[1];
  } else {
    // 或者提取 <body>...</body> 的内容
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      content = bodyMatch[1];
    }
  }

  if (process.platform === 'darwin') {
    // macOS: 使用 AppleScript 写入剪贴板
    const script = `
      set the clipboard to "${content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
    `;

    const result = spawnSync('osascript', ['-e', script]);
    return result.status === 0;
  } else {
    // Linux: 使用 xclip
    const result = spawnSync('xclip', ['-selection', 'clipboard', '-t', 'text/html'], {
      input: content,
    });
    return result.status === 0;
  }
}

// 测试
if (import.meta.main) {
  const htmlPath = process.argv[2];
  if (!htmlPath) {
    console.error('Usage: bun fix-copy-paste.ts <html-file>');
    process.exit(1);
  }

  if (!fs.existsSync(htmlPath)) {
    console.error(`File not found: ${htmlPath}`);
    process.exit(1);
  }

  const success = copyHtmlToClipboard(htmlPath);
  if (success) {
    console.log('[fix-copy-paste] HTML copied to clipboard');
  } else {
    console.error('[fix-copy-paste] Failed to copy');
    process.exit(1);
  }
}

export { copyHtmlToClipboard };
