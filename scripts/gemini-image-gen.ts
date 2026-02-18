#!/usr/bin/env bun
/**
 * Gemini 生图 - 官方 API 直连 / CDP 浏览器兜底
 *
 * Usage:
 *   bun gemini-image-gen.ts --prompt "A red apple" --output /path/to/image.png
 *   bun gemini-image-gen.ts --prompt "..." --output /path/to/image.png --method cdp
 *   bun gemini-image-gen.ts --prompt "..." --output /path/to/image.png --aspect 2.5:1
 *
 * API key: reads GOOGLE_API_KEY from env or ~/.baoyu-skills/.env
 */
import path from 'node:path';
import { mkdir, writeFile, readFile, stat, readdir, rename } from 'node:fs/promises';

const args = {
  prompt: '',
  output: '',
  method: 'auto', // auto | api | cdp
  aspect: '',      // optional: "16:9", "2.5:1", "1:1" etc.
};

for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--prompt' || process.argv[i] === '-p') args.prompt = process.argv[++i] || '';
  else if (process.argv[i] === '--output' || process.argv[i] === '-o') args.output = process.argv[++i] || '';
  else if (process.argv[i] === '--method') args.method = process.argv[++i] || 'auto';
  else if (process.argv[i] === '--aspect') args.aspect = process.argv[++i] || '';
}

if (!args.prompt || !args.output) {
  console.error('Usage: bun gemini-image-gen.ts --prompt "A red apple" --output /path/to/image.png [--method auto|api|cdp] [--aspect 16:9]');
  process.exit(1);
}

await mkdir(path.dirname(args.output), { recursive: true });

// Load API key from env or .env file
async function getApiKey(): Promise<string | null> {
  if (process.env.GOOGLE_API_KEY) return process.env.GOOGLE_API_KEY;

  try {
    const envPath = path.join(process.env.HOME!, '.baoyu-skills', '.env');
    const content = await readFile(envPath, 'utf-8');
    const match = content.match(/^GOOGLE_API_KEY=(.+)$/m);
    return match?.[1]?.trim() || null;
  } catch {
    return null;
  }
}

// 方法 1: 官方 Gemini API 直连
async function tryApiMethod(): Promise<boolean> {
  const apiKey = await getApiKey();
  if (!apiKey) {
    console.log('[API] No GOOGLE_API_KEY found');
    return false;
  }

  const model = 'gemini-3-pro-image-preview';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Build prompt with optional aspect ratio hint
  let fullPrompt = args.prompt;
  if (args.aspect) {
    fullPrompt = `Generate an image with aspect ratio ${args.aspect}. ${fullPrompt}`;
  }

  console.log(`[API] Generating image with ${model}...`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[API] HTTP ${response.status}: ${error.substring(0, 200)}`);
      return false;
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts;

    if (!parts || parts.length === 0) {
      console.error('[API] No content in response');
      return false;
    }

    // Find image part
    for (const part of parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        // Determine extension from mime type
        const ext = path.extname(args.output).toLowerCase();
        const mimeType = part.inlineData.mimeType || 'image/png';

        // If output expects png but got jpeg (or vice versa), still save with correct format
        await writeFile(args.output, buffer);
        console.log(`[API] Image generated: ${mimeType}, ${(buffer.length / 1024).toFixed(1)}KB`);
        return true;
      }
    }

    // Only got text, no image
    const textParts = parts.filter((p: any) => p.text).map((p: any) => p.text).join('\n');
    console.error(`[API] No image in response. Text: ${textParts.substring(0, 200)}`);
    return false;

  } catch (err: any) {
    console.error(`[API] Error: ${err.message}`);
    return false;
  }
}

// 方法 2: CDP 浏览器模式（兜底）
async function cdpMethod() {
  const cdpPath = path.join(import.meta.dir, '../dependencies/baoyu-skills/skills/baoyu-post-to-wechat/scripts/cdp.ts');
  const { tryConnectExisting, findExistingChromeDebugPort, launchChrome, getPageSession, evaluate, typeText, sleep } = await import(cdpPath);

  // 优先连接已有的 Chromium (port 9222)，再 fallback 到自动发现
  let cdp = await tryConnectExisting(9222);
  let chrome = null;

  if (!cdp) {
    const port = await findExistingChromeDebugPort();
    cdp = port ? await tryConnectExisting(port) : null;
  }

  if (!cdp) {
    console.log('[CDP] No existing browser found, launching Chrome...');
    const result = await launchChrome('https://gemini.google.com/app');
    cdp = result.cdp;
    chrome = result.chrome;
    await sleep(5000);
  } else {
    console.log('[CDP] Connected to existing browser');
  }

  try {
    const session = await getPageSession(cdp, 'gemini.google.com');

    const existingImages = await session.cdp.send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('img')).map(img => img.src)`,
      returnByValue: true
    }, { sessionId: session.sessionId });

    const beforeUrls = new Set(existingImages.result.value || []);
    console.log(`[CDP] Found ${beforeUrls.size} existing images before generation`);

    console.log('[CDP] Entering prompt...');
    await session.cdp.send('Runtime.evaluate', {
      expression: `document.querySelector('rich-textarea')?.focus()`
    }, { sessionId: session.sessionId });
    await sleep(500);

    await typeText(session, `Generate an image: ${args.prompt}`);
    await sleep(500);

    console.log('[CDP] Submitting...');
    await session.cdp.send('Input.dispatchKeyEvent', {
      type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13
    }, { sessionId: session.sessionId });
    await session.cdp.send('Input.dispatchKeyEvent', {
      type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13
    }, { sessionId: session.sessionId });

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

    console.log('[CDP] Hovering over image and clicking download button...');

    await session.cdp.send('Runtime.evaluate', {
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
          const hoverEvent = new MouseEvent('mouseenter', { bubbles: true });
          img.dispatchEvent(hoverEvent);

          const parent = img.closest('[class*="response"], [class*="message"], div');
          if (!parent) return { success: false, error: 'Cannot find parent container' };

          setTimeout(() => {
            const buttons = Array.from(parent.querySelectorAll('button[aria-label*="下载"], button[aria-label*="Download"], button[download]'));
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

    await sleep(2000);

    console.log('[CDP] Waiting for download to complete...');
    const downloadDir = path.join(process.env.HOME!, 'Downloads');

    let downloadedFile = null;
    for (let i = 0; i < 10; i++) {
      await sleep(1000);

      const files = await readdir(downloadDir);
      const imageFiles = files.filter(f =>
        /\.(png|jpg|jpeg|webp)$/i.test(f) && !f.includes('.crdownload')
      );

      if (imageFiles.length > 0) {
        const stats = await Promise.all(
          imageFiles.map(async f => ({
            name: f,
            stat: await stat(path.join(downloadDir, f))
          }))
        );

        stats.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);

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
    await rename(downloadedFile, args.output);

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
    console.error('[API] Failed');
    process.exit(1);
  }
} else if (args.method === 'cdp') {
  await cdpMethod();
} else {
  // auto: 先试官方 API，失败则 CDP
  console.log('[AUTO] Trying Gemini API...');
  const apiSuccess = await tryApiMethod();

  if (!apiSuccess) {
    console.log('[AUTO] API failed, switching to CDP method...');
    await cdpMethod();
  }
}

const fileStat = await stat(args.output);
console.log(`Image saved: ${args.output} (${(fileStat.size / 1024).toFixed(1)}KB)`);
