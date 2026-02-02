#!/usr/bin/env bun
/**
 * Gemini 生图 - 改进的图片识别逻辑
 */
import path from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

const args = {
  prompt: '',
  output: '',
  method: 'auto'
};

for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--prompt' || process.argv[i] === '-p') args.prompt = process.argv[++i] || '';
  else if (process.argv[i] === '--output' || process.argv[i] === '-o') args.output = process.argv[++i] || '';
  else if (process.argv[i] === '--method') args.method = process.argv[++i] || 'auto';
}

if (!args.prompt || !args.output) {
  console.error('Usage: bun gemini-image-gen-v2.ts --prompt "A red apple" --output /path/to/image.png');
  process.exit(1);
}

await mkdir(path.dirname(args.output), { recursive: true });

// CDP 浏览器模式（改进的图片识别）
async function cdpMethod() {
  const cdpPath = path.join(import.meta.dir, '../dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/cdp.ts');
  const { tryConnectExisting, findExistingChromeDebugPort, launchChrome, getPageSession, evaluate, typeText, sleep } = await import(cdpPath);
  
  let port = await findExistingChromeDebugPort();
  let cdp = port ? await tryConnectExisting(port) : null;
  let chrome = null;
  
  if (!cdp) {
    console.log('[CDP] Launching Chrome...');
    const result = await launchChrome('https://gemini.google.com/app');
    cdp = result.cdp;
    chrome = result.chrome;
    await sleep(5000);
  }
  
  try {
    const session = await getPageSession(cdp, 'gemini.google.com');
    
    // 记录当前页面所有图片的 URL（用于排除）
    const existingImages = await session.cdp.send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('img')).map(img => img.src)`,
      returnByValue: true
    }, { sessionId: session.sessionId });
    
    const beforeUrls = new Set(existingImages.result.value || []);
    console.log(`[CDP] Found ${beforeUrls.size} existing images before generation`);
    
    // 输入 prompt
    console.log('[CDP] Entering prompt...');
    await session.cdp.send('Runtime.evaluate', {
      expression: `document.querySelector('rich-textarea')?.focus()`
    }, { sessionId: session.sessionId });
    await sleep(500);
    
    await typeText(session, `Generate an image: ${args.prompt}`);
    await sleep(500);
    
    // 发送
    console.log('[CDP] Submitting...');
    await session.cdp.send('Input.dispatchKeyEvent', {
      type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13
    }, { sessionId: session.sessionId });
    await session.cdp.send('Input.dispatchKeyEvent', {
      type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13
    }, { sessionId: session.sessionId });
    
    // 等待并查找新图片
    console.log('[CDP] Waiting for image generation...');
    let imageUrl = null;
    
    for (let attempt = 0; attempt < 30; attempt++) {
      await sleep(1000);
      
      const result = await session.cdp.send('Runtime.evaluate', {
        expression: `
          (function() {
            const existingUrls = ${JSON.stringify(Array.from(beforeUrls))};
            const imgs = Array.from(document.querySelectorAll('img'))
              .filter(img => 
                (img.src.startsWith('data:image') || img.src.includes('googleusercontent')) &&
                !existingUrls.includes(img.src) &&
                img.width > 100 && img.height > 100
              )
              .sort((a, b) => b.width * b.height - a.width * a.height);
            
            return imgs.length > 0 ? imgs[0].src : null;
          })()
        `,
        returnByValue: true
      }, { sessionId: session.sessionId });
      
      imageUrl = result.result.value;
      
      if (imageUrl) {
        console.log(`[CDP] Found new image after ${attempt + 1}s`);
        break;
      }
      
      if ((attempt + 1) % 5 === 0) {
        console.log(`[CDP] Still waiting... (${attempt + 1}s)`);
      }
    }
    
    if (!imageUrl) throw new Error('No generated image found after 30s');
    
    console.log(`[CDP] Image URL: ${imageUrl.substring(0, 80)}...`);

    // 模拟点击下载按钮
    console.log('[CDP] Hovering over image and clicking download button...');

    // Hover 图片并点击下载按钮
    const clickResult = await session.cdp.send('Runtime.evaluate', {
      expression: `
        (function() {
          const existingUrls = ${JSON.stringify(Array.from(beforeUrls))};
          const imgs = Array.from(document.querySelectorAll('img'))
            .filter(img =>
              (img.src.startsWith('data:image') || img.src.includes('googleusercontent')) &&
              !existingUrls.includes(img.src) &&
              img.width > 100 && img.height > 100
            )
            .sort((a, b) => b.width * b.height - a.width * a.height);

          if (imgs.length === 0) return { success: false, error: 'No image found' };

          const img = imgs[0];

          // 触发 hover 事件
          const hoverEvent = new MouseEvent('mouseenter', { bubbles: true });
          img.dispatchEvent(hoverEvent);

          // 查找下载按钮（右上角第三个按钮）
          const parent = img.closest('[class*="response"], [class*="message"], div');
          if (!parent) return { success: false, error: 'Cannot find parent container' };

          // 等待按钮显示
          setTimeout(() => {
            const buttons = Array.from(parent.querySelectorAll('button[aria-label*="下载"], button[aria-label*="Download"], button[download]'));

            // 也尝试找所有按钮，下载按钮通常是最后一个
            if (buttons.length === 0) {
              const allButtons = Array.from(parent.querySelectorAll('button'));
              if (allButtons.length >= 3) {
                allButtons[allButtons.length - 1].click();
                return { success: true };
              }
            } else {
              buttons[0].click();
              return { success: true };
            }
          }, 500);

          return { success: true, pending: true };
        })()
      `,
      returnByValue: true
    }, { sessionId: session.sessionId });

    await sleep(2000); // 等待下载开始

    // 从默认下载目录查找最新的图片文件
    console.log('[CDP] Waiting for download to complete...');
    const { readdir, stat: fsStat } = await import('node:fs/promises');
    const downloadDir = path.join(process.env.HOME!, 'Downloads');

    let downloadedFile = null;
    for (let i = 0; i < 10; i++) {
      await sleep(1000);

      const files = await readdir(downloadDir);
      const imageFiles = files.filter(f =>
        /\.(png|jpg|jpeg|webp)$/i.test(f) && !f.includes('.crdownload')
      );

      if (imageFiles.length > 0) {
        // 找最新的文件
        const stats = await Promise.all(
          imageFiles.map(async f => ({
            name: f,
            stat: await fsStat(path.join(downloadDir, f))
          }))
        );

        stats.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);

        // 检查文件是否在最近10秒内创建
        const now = Date.now();
        if (now - stats[0].stat.mtimeMs < 10000) {
          downloadedFile = path.join(downloadDir, stats[0].name);
          break;
        }
      }
    }

    if (!downloadedFile) {
      throw new Error('Download failed or timed out');
    }

    console.log(`[CDP] Download completed: ${downloadedFile}`);

    // 移动文件到目标位置
    const { rename } = await import('node:fs/promises');
    await rename(downloadedFile, args.output);
    
    return true;
    
  } finally {
    cdp.close();
    if (chrome) chrome.kill();
  }
}

// 执行
await cdpMethod();

const fs = await import('node:fs/promises');
const stat = await fs.stat(args.output);
console.log(`✅ Image saved: ${args.output} (${(stat.size / 1024).toFixed(1)}KB)`);
