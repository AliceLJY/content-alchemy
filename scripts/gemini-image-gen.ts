#!/usr/bin/env bun
/**
 * Gemini 生图 - 自动切换 API/CDP 模式
 */
import path from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';

const args = {
  prompt: '',
  output: '',
  method: 'auto' // auto | api | cdp
};

for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--prompt' || process.argv[i] === '-p') args.prompt = process.argv[++i] || '';
  else if (process.argv[i] === '--output' || process.argv[i] === '-o') args.output = process.argv[++i] || '';
  else if (process.argv[i] === '--method') args.method = process.argv[++i] || 'auto';
}

if (!args.prompt || !args.output) {
  console.error('Usage: bun gemini-image-gen.ts --prompt "A red apple" --output /path/to/image.png');
  process.exit(1);
}

await mkdir(path.dirname(args.output), { recursive: true });

// 方法 1: 尝试 API 模式
async function tryApiMethod() {
  try {
    const geminiWebPath = path.join(import.meta.dir, '../dependencies/baoyu-skills/skills/baoyu-danger-gemini-web/scripts/main.ts');
    const { spawn } = await import('node:child_process');
    
    return new Promise<boolean>((resolve) => {
      const proc = spawn('bun', [geminiWebPath, '--prompt', args.prompt, '--image', args.output], {
        stdio: 'inherit',
        timeout: 60000
      });
      
      proc.on('close', (code) => resolve(code === 0));
      proc.on('error', () => resolve(false));
    });
  } catch {
    return false;
  }
}

// 方法 2: CDP 浏览器模式
async function cdpMethod() {
  const cdpPath = path.join(import.meta.dir, '../dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/cdp.ts');
  const { tryConnectExisting, findExistingChromeDebugPort, launchChrome, getPageSession, evaluate, typeText, sleep } = await import(cdpPath);
  
  // 查找或启动 Chrome
  let port = await findExistingChromeDebugPort();
  let cdp = port ? await tryConnectExisting(port) : null;
  let chrome = null;
  
  if (!cdp) {
    console.log('[CDP] Launching Chrome...');
    const result = await launchChrome('https://gemini.google.com/app');
    cdp = result.cdp;
    chrome = result.chrome;
    await sleep(5000); // 等待页面加载
  }
  
  try {
    const session = await getPageSession(cdp, 'gemini.google.com');
    
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
    
    // 等待生成
    console.log('[CDP] Waiting for image (20s)...');
    await sleep(20000);
    
    // 提取图片
    const result = await session.cdp.send('Runtime.evaluate', {
      expression: `
        (function() {
          const imgs = Array.from(document.querySelectorAll('img')).filter(img => 
            img.src.startsWith('data:image') || img.src.includes('googleusercontent')
          );
          const latestImg = imgs[imgs.length - 1];
          return latestImg ? latestImg.src : null;
        })()
      `,
      returnByValue: true
    }, { sessionId: session.sessionId });
    
    const imageUrl = result.result.value;
    if (!imageUrl) throw new Error('No image found');
    
    // 下载
    if (imageUrl.startsWith('data:image')) {
      const buffer = Buffer.from(imageUrl.split(',')[1], 'base64');
      await writeFile(args.output, buffer);
    } else {
      const res = await fetch(imageUrl);
      await writeFile(args.output, Buffer.from(await res.arrayBuffer()));
    }
    
    return true;
    
  } finally {
    cdp.close();
    if (chrome) chrome.kill();
  }
}

// 执行
if (args.method === 'api') {
  const success = await tryApiMethod();
  if (!success) {
    console.error('❌ API method failed');
    process.exit(1);
  }
} else if (args.method === 'cdp') {
  await cdpMethod();
} else {
  // auto: 先试 API，失败则 CDP
  console.log('[AUTO] Trying API method first...');
  const apiSuccess = await tryApiMethod();
  
  if (!apiSuccess) {
    console.log('[AUTO] API failed, switching to CDP method...');
    await cdpMethod();
  }
}

console.log(`✅ Image saved: ${args.output}`);
