#!/usr/bin/env bun
/**
 * format-wechat.ts - WeChat article formatter CLI
 * Converts markdown to styled HTML with inline styles for WeChat Official Accounts.
 * Ported from 小试AI排版器 (wechat_editor_xiaoshiai.html).
 *
 * Usage:
 *   bun format-wechat.ts --input article.md --output styled.html [--style <name>]
 *   bun format-wechat.ts --list
 */

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import fm from 'front-matter';
import fs from 'node:fs';
import path from 'node:path';

// ── Style definitions (from 小试AI排版器) ─────────────────────────────────

interface StyleConfig {
  name: string;
  recommended?: boolean;
  styles: Record<string, string>;
}

const STYLES: Record<string, StyleConfig> = {
  'wechat-default': {
    name: '默认公众号',
    styles: {
      container: 'max-width: 740px; margin: 0 auto; padding: 10px 12px 20px 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.8 !important; color: #3f3f3f !important; background-color: #fff !important; word-wrap: break-word;',
      h1: 'font-size: 24px; font-weight: 600; color: #2c3e50 !important; line-height: 1.4 !important; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #3498db;',
      h2: 'font-size: 22px; font-weight: 600; color: #2c3e50 !important; line-height: 1.4 !important; margin: 28px 0 14px; padding-left: 12px; border-left: 4px solid #3498db;',
      h3: 'font-size: 20px; font-weight: 600; color: #34495e !important; line-height: 1.4 !important; margin: 24px 0 12px;',
      h4: 'font-size: 18px; font-weight: 600; color: #34495e !important; line-height: 1.4 !important; margin: 20px 0 10px;',
      p: 'margin: 16px 0 !important; line-height: 1.8 !important; color: #3f3f3f !important;',
      strong: 'font-weight: 600; color: #2c3e50 !important;',
      em: 'font-style: italic; color: #555 !important;',
      a: 'color: #3498db !important; text-decoration: none; border-bottom: 1px solid #3498db;',
      ul: 'margin: 16px 0; padding-left: 24px;',
      ol: 'margin: 16px 0; padding-left: 24px;',
      li: 'margin: 8px 0; line-height: 1.8 !important;',
      blockquote: 'margin: 16px 0; padding: 8px 16px; background-color: #fafafa !important; border-left: 3px solid #999; color: #666 !important; line-height: 1.5 !important;',
      code: 'font-family: Consolas, Monaco, "Courier New", monospace; font-size: 14px; padding: 2px 6px; background-color: #f5f5f5 !important; color: #e74c3c !important; border-radius: 3px;',
      pre: 'margin: 20px 0; padding: 16px; background-color: #2d2d2d !important; border-radius: 8px; overflow-x: auto; line-height: 1.6 !important;',
      hr: 'margin: 32px 0; border: none; border-top: 1px solid #e0e0e0;',
      img: 'max-width: 100%; max-height: 600px !important; height: auto; display: block; margin: 20px auto; border-radius: 8px;',
      table: 'width: 100%; margin: 20px 0; border-collapse: collapse; font-size: 15px;',
      th: 'background-color: #f0f0f0 !important; padding: 10px; text-align: left; border: 1px solid #e0e0e0; font-weight: 600;',
      td: 'padding: 10px; border: 1px solid #e0e0e0;',
      tr: 'border-bottom: 1px solid #e0e0e0;',
    }
  },

  'wechat-tech': {
    name: '技术风格',
    styles: {
      container: 'max-width: 740px; margin: 0 auto; padding: 10px 20px 20px 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.75 !important; color: #2c3e50 !important; background-color: #fff !important; word-wrap: break-word;',
      h1: 'font-size: 26px; font-weight: 700; color: #1a1a1a !important; line-height: 1.3 !important; margin: 36px 0 18px; padding: 0 0 12px; border-bottom: 3px solid #0066cc;',
      h2: 'font-size: 22px; font-weight: 700; color: #1a1a1a !important; line-height: 1.3 !important; margin: 32px 0 16px; padding-left: 16px; padding-top: 4px; padding-bottom: 4px; border-left: 5px solid #00a67d;',
      h3: 'font-size: 20px; font-weight: 600; color: #2c3e50 !important; line-height: 1.4 !important; margin: 28px 0 14px; padding-left: 12px; border-left: 3px solid #ff9800;',
      h4: 'font-size: 18px; font-weight: 600; color: #34495e !important; line-height: 1.4 !important; margin: 24px 0 12px;',
      p: 'margin: 18px 0 !important; line-height: 1.8 !important; color: #3a3a3a !important;',
      strong: 'font-weight: 700; color: #1a1a1a !important; background-color: #fff3cd !important; padding: 2px 4px; border-radius: 8px;',
      em: 'font-style: italic; color: #666 !important;',
      a: 'color: #0066cc !important; text-decoration: none; border-bottom: 1px solid #0066cc;',
      ul: 'margin: 18px 0; padding-left: 28px;',
      ol: 'margin: 18px 0; padding-left: 28px;',
      li: 'margin: 10px 0; line-height: 1.8 !important; color: #3a3a3a !important;',
      blockquote: 'margin: 16px 0; padding: 8px 16px; background-color: #f5f9fc !important; border-left: 3px solid #2196f3; color: #555 !important; line-height: 1.5 !important;',
      code: 'font-family: "Fira Code", Consolas, Monaco, "Courier New", monospace; font-size: 14px; padding: 3px 6px; background-color: #ffe6e6 !important; color: #d63031 !important; border-radius: 8px; font-weight: 500;',
      pre: 'margin: 24px 0; padding: 20px; background-color: #1e1e1e !important; border-radius: 8px; overflow-x: auto; line-height: 1.6 !important; box-shadow: 0 2px 8px rgba(0,0,0,0.1);',
      hr: 'margin: 36px 0; border: none; height: 2px; background: linear-gradient(to right, transparent, #0066cc, transparent);',
      img: 'max-width: 100%; max-height: 600px !important; height: auto; display: block; margin: 24px auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px; box-shadow: 0 1px 4px rgba(0,0,0,0.1);',
      th: 'background-color: #0066cc !important; color: #fff !important; padding: 12px; text-align: left; border: 1px solid #0052a3; font-weight: 600;',
      td: 'padding: 12px; border: 1px solid #e0e0e0; background-color: #fff !important;',
      tr: 'border-bottom: 1px solid #e0e0e0;',
    }
  },

  'wechat-elegant': {
    name: '优雅简约',
    styles: {
      container: 'max-width: 720px; margin: 0 auto; padding: 12px 20px 30px 20px; font-family: "Songti SC", "SimSun", Georgia, serif; font-size: 17px; line-height: 1.85 !important; color: #333 !important; background-color: #fff !important; word-wrap: break-word;',
      h1: 'font-size: 26px; font-weight: 400; color: #1a1a1a !important; line-height: 1.4 !important; margin: 36px 0 18px; text-align: center; letter-spacing: 2px;',
      h2: 'font-size: 22px; font-weight: 400; color: #2c2c2c !important; line-height: 1.45 !important; margin: 32px 0 16px; text-align: center; letter-spacing: 1px;',
      h3: 'font-size: 19px; font-weight: 400; color: #3a3a3a !important; line-height: 1.5 !important; margin: 28px 0 14px; letter-spacing: 0.5px;',
      h4: 'font-size: 17px; font-weight: 400; color: #444 !important; line-height: 1.55 !important; margin: 24px 0 12px;',
      p: 'margin: 18px 0 !important; line-height: 1.85 !important; color: #444 !important; text-indent: 2em; letter-spacing: 0.5px;',
      strong: 'font-weight: 600; color: #1a1a1a !important;',
      em: 'font-style: italic; color: #666 !important;',
      a: 'color: #8b7355 !important; text-decoration: none; border-bottom: 1px dotted #8b7355;',
      ul: 'margin: 18px 0; padding-left: 28px;',
      ol: 'margin: 18px 0; padding-left: 28px;',
      li: 'margin: 10px 0; line-height: 1.85 !important;',
      blockquote: 'margin: 18px auto; padding: 10px 20px; background-color: transparent !important; border-left: 2px solid #ccc; color: #666 !important; max-width: 600px; line-height: 1.6 !important;',
      code: 'font-family: Menlo, Monaco, "Courier New", monospace; font-size: 14px; padding: 2px 6px; background-color: #f5f5f5 !important; color: #8b4513 !important; border-radius: 3px;',
      pre: 'margin: 24px 0; padding: 18px; background-color: #f9f9f9 !important; border: 1px solid #e5e5e5; border-radius: 8px; overflow-x: auto; line-height: 1.7 !important;',
      hr: 'margin: 36px auto; border: none; text-align: center; height: 1px; background-color: #e0e0e0 !important; max-width: 200px;',
      img: 'max-width: 100%; max-height: 500px !important; height: auto; display: block; margin: 24px auto; border-radius: 8px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;',
      th: 'background-color: #f8f8f8 !important; padding: 10px; text-align: left; border-bottom: 2px solid #d0d0d0; font-weight: 400; color: #555 !important;',
      td: 'padding: 10px; border-bottom: 1px solid #e5e5e5;',
      tr: 'border-bottom: 1px solid #e5e5e5;',
    }
  },

  'wechat-deepread': {
    name: '深度阅读',
    styles: {
      container: 'max-width: 680px; margin: 0 auto; padding: 14px 12px 32px 12px; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 17px; line-height: 1.75 !important; color: #1a1a1a !important; background-color: #fff !important; word-wrap: break-word; letter-spacing: 0.01em;',
      h1: 'font-size: 26px; font-weight: 700; color: #0a0a0a !important; line-height: 1.25 !important; margin: 36px 0 18px; letter-spacing: -0.02em;',
      h2: 'font-size: 22px; font-weight: 700; color: #0a0a0a !important; line-height: 1.3 !important; margin: 32px 0 16px; letter-spacing: -0.01em;',
      h3: 'font-size: 19px; font-weight: 600; color: #1a1a1a !important; line-height: 1.35 !important; margin: 28px 0 14px;',
      h4: 'font-size: 17px; font-weight: 600; color: #2a2a2a !important; line-height: 1.4 !important; margin: 24px 0 12px;',
      p: 'margin: 20px 0 !important; line-height: 1.8 !important; color: #1a1a1a !important;',
      strong: 'font-weight: 700; color: #0a0a0a !important;',
      em: 'font-style: italic; color: #2a2a2a !important;',
      a: 'color: #0066cc !important; text-decoration: none; border-bottom: 1px solid #0066cc;',
      ul: 'margin: 20px 0; padding-left: 28px;',
      ol: 'margin: 20px 0; padding-left: 28px;',
      li: 'margin: 10px 0; line-height: 1.8 !important; color: #1a1a1a !important;',
      blockquote: 'margin: 20px 0; padding: 12px 18px; background-color: #f8f9fa !important; border-left: 4px solid #0a0a0a; color: #1a1a1a !important; font-size: 16px; line-height: 1.6 !important; font-style: normal;',
      code: 'font-family: "SF Mono", Consolas, Monaco, "Courier New", monospace; font-size: 15px; padding: 2px 6px; background-color: #f5f5f5 !important; color: #d73a49 !important; border-radius: 3px;',
      pre: 'margin: 24px 0; padding: 20px; background-color: #f6f8fa !important; border-radius: 8px; overflow-x: auto; line-height: 1.6 !important; border: 1px solid #e1e4e8;',
      hr: 'margin: 36px 0; border: none; height: 1px; background-color: #e1e4e8 !important;',
      img: 'max-width: 100%; max-height: 500px !important; height: auto; display: block; margin: 24px auto; border-radius: 8px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 16px;',
      th: 'background-color: #f6f8fa !important; padding: 10px 14px; text-align: left; border: 1px solid #e1e4e8; font-weight: 600; color: #1a1a1a !important;',
      td: 'padding: 10px 14px; border: 1px solid #e1e4e8; color: #1a1a1a !important;',
      tr: 'border-bottom: 1px solid #e1e4e8;',
    }
  },

  'latepost-depth': {
    name: '晚点LatePost',
    styles: {
      container: 'max-width: 700px; margin: 0 auto; padding: 16px 12px 36px 12px; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 17px; line-height: 1.8 !important; color: #1a1a1a !important; background-color: #fff !important; word-wrap: break-word;',
      h1: 'font-size: 26px; font-weight: 700; color: #1a1a1a !important; line-height: 1.3 !important; margin: 36px 0 18px; padding-left: 16px; border-left: 5px solid #d32f2f;',
      h2: 'font-size: 20px; font-weight: 600; color: #fff !important; line-height: 1.4 !important; margin: 32px 0 16px; padding: 12px 20px; background-color: #d32f2f !important; border-radius: 4px;',
      h3: 'font-size: 18px; font-weight: 600; color: #d32f2f !important; line-height: 1.45 !important; margin: 28px 0 14px; padding-left: 14px; border-left: 4px solid #d32f2f;',
      h4: 'font-size: 17px; font-weight: 600; color: #1a1a1a !important; line-height: 1.5 !important; margin: 24px 0 12px; padding: 6px 10px; background-color: #f5f5f5 !important; border-left: 3px solid #ff5252;',
      p: 'margin: 18px 0 !important; line-height: 1.85 !important; color: #1a1a1a !important;',
      strong: 'font-weight: 700; color: #d32f2f !important; background-color: rgba(211, 47, 47, 0.08) !important; padding: 2px 6px; border-radius: 3px;',
      em: 'font-style: italic; color: #666 !important;',
      a: 'color: #d32f2f !important; text-decoration: none; border-bottom: 1px solid #d32f2f;',
      ul: 'margin: 20px 0; padding-left: 28px;',
      ol: 'margin: 20px 0; padding-left: 28px;',
      li: 'margin: 10px 0; line-height: 1.8 !important; color: #1a1a1a !important;',
      blockquote: 'margin: 20px 0; padding: 12px 18px; background-color: #f5f5f5 !important; border-left: 4px solid #d32f2f; color: #1a1a1a !important; font-size: 16px; line-height: 1.6 !important; border-radius: 4px;',
      code: 'font-family: "SF Mono", Menlo, Consolas, monospace; font-size: 15px; padding: 3px 8px; background-color: #f5f5f5 !important; color: #d32f2f !important; border-radius: 4px; font-weight: 500;',
      pre: 'margin: 24px 0; padding: 18px; background-color: #2a2a2a !important; color: #f5f5f5 !important; border-radius: 6px; overflow-x: auto; line-height: 1.6 !important; border-left: 4px solid #d32f2f;',
      hr: 'margin: 36px auto; border: none; height: 2px; background: linear-gradient(to right, transparent, #d32f2f, transparent); max-width: 200px;',
      img: 'max-width: 100%; max-height: 500px !important; height: auto; display: block; margin: 24px auto; border-radius: 6px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 16px; border-radius: 6px; overflow: hidden;',
      th: 'background-color: #d32f2f !important; color: #fff !important; padding: 10px 14px; text-align: left; font-weight: 600; border: none;',
      td: 'padding: 10px 14px; border: none; border-bottom: 1px solid #e0e0e0; color: #1a1a1a !important; background-color: #fff !important;',
      tr: 'border-bottom: 1px solid #e0e0e0;',
    }
  },

  'wechat-nyt': {
    name: '纽约时报',
    styles: {
      container: 'max-width: 680px; margin: 0 auto; padding: 20px 12px 48px 12px; font-family: Georgia, "Times New Roman", Times, serif; font-size: 18px; line-height: 1.8 !important; color: #121212 !important; background-color: #fff !important; word-wrap: break-word;',
      h1: 'font-size: 42px; font-weight: 700; color: #000 !important; line-height: 1.2 !important; margin: 56px 0 16px; font-family: Georgia, serif; letter-spacing: -0.02em; border-bottom: 1px solid #000; padding-bottom: 16px;',
      h2: 'font-size: 32px; font-weight: 700; color: #000 !important; line-height: 1.3 !important; margin: 48px 0 16px; font-family: Georgia, serif; letter-spacing: -0.01em;',
      h3: 'font-size: 24px; font-weight: 700; color: #121212 !important; line-height: 1.4 !important; margin: 40px 0 16px; font-family: Georgia, serif;',
      h4: 'font-size: 20px; font-weight: 700; color: #1a1a1a !important; line-height: 1.5 !important; margin: 32px 0 12px; font-family: Georgia, serif;',
      p: 'margin: 20px 0 !important; line-height: 1.8 !important; color: #121212 !important; text-align: left;',
      strong: 'font-weight: 700; color: #000 !important;',
      em: 'font-style: italic; color: #121212 !important;',
      a: 'color: #326891 !important; text-decoration: none; border-bottom: 1px solid #326891;',
      ul: 'margin: 24px 0; padding-left: 40px;',
      ol: 'margin: 24px 0; padding-left: 40px;',
      li: 'margin: 12px 0; line-height: 1.8 !important; color: #121212 !important;',
      blockquote: 'margin: 24px 0; padding: 14px 24px; background-color: #f7f7f7 !important; border-left: 5px solid #121212; color: #121212 !important; font-size: 18px; line-height: 1.6 !important; font-style: italic; font-family: Georgia, serif;',
      code: 'font-family: "Courier New", Courier, monospace; font-size: 16px; padding: 2px 6px; background-color: #f0f0f0 !important; color: #666 !important; border: 1px solid #ddd;',
      pre: 'margin: 28px 0; padding: 24px; background-color: #f7f7f7 !important; border: 1px solid #ddd; overflow-x: auto; line-height: 1.6 !important;',
      hr: 'margin: 48px auto; border: none; height: 1px; background-color: #ddd !important; max-width: 100px;',
      img: 'max-width: 100%; max-height: 600px !important; height: auto; display: block; margin: 32px auto; border: 1px solid #ddd;',
      table: 'width: 100%; margin: 32px 0; border-collapse: collapse; font-size: 16px; border: 1px solid #ddd;',
      th: 'background-color: #f7f7f7 !important; padding: 14px 16px; text-align: left; border: 1px solid #ddd; font-weight: 700; color: #121212 !important; font-family: Georgia, serif;',
      td: 'padding: 14px 16px; border: 1px solid #ddd; color: #121212 !important;',
      tr: 'border-bottom: 1px solid #ddd;',
    }
  },

  'wechat-ft': {
    name: '金融时报',
    styles: {
      container: 'max-width: 680px; margin: 0 auto; padding: 16px 20px 40px 20px; font-family: Georgia, "Times New Roman", Times, serif; font-size: 17px; line-height: 1.75 !important; color: #33302e !important; background-color: #fff1e5 !important; word-wrap: break-word;',
      h1: 'font-size: 38px; font-weight: 600; color: #000 !important; line-height: 1.2 !important; margin: 56px 0 24px; font-family: Georgia, serif; border-bottom: 4px solid #990f3d; padding-bottom: 16px;',
      h2: 'font-size: 30px; font-weight: 600; color: #990f3d !important; line-height: 1.3 !important; margin: 48px 0 20px; font-family: Georgia, serif; border-left: 6px solid #990f3d; padding-left: 20px;',
      h3: 'font-size: 24px; font-weight: 600; color: #33302e !important; line-height: 1.4 !important; margin: 40px 0 16px; font-family: Georgia, serif; border-bottom: 2px solid #cec6b9; padding-bottom: 8px;',
      h4: 'font-size: 20px; font-weight: 600; color: #33302e !important; line-height: 1.5 !important; margin: 32px 0 12px; font-family: Georgia, serif;',
      p: 'margin: 20px 0 !important; line-height: 1.75 !important; color: #33302e !important;',
      strong: 'font-weight: 700; color: #990f3d !important;',
      em: 'font-style: italic; color: #33302e !important;',
      a: 'color: #0d7680 !important; text-decoration: none; border-bottom: 2px solid #0d7680; font-weight: 600;',
      ul: 'margin: 24px 0; padding-left: 32px;',
      ol: 'margin: 24px 0; padding-left: 32px;',
      li: 'margin: 12px 0; line-height: 1.75 !important; color: #33302e !important;',
      blockquote: 'margin: 24px 0; padding: 14px 20px; background-color: #fff1e5 !important; color: #990f3d !important; font-size: 17px; line-height: 1.6 !important; font-style: italic; font-family: Georgia, serif; border-left: 6px solid #990f3d;',
      code: 'font-family: "Courier New", Courier, monospace; font-size: 15px; padding: 3px 8px; background-color: #fff !important; color: #990f3d !important; border: 1px solid #cec6b9; font-weight: 600;',
      pre: 'margin: 28px 0; padding: 24px; background-color: #fff !important; border-left: 4px solid #990f3d; overflow-x: auto; line-height: 1.6 !important;',
      hr: 'margin: 48px auto; border: none; height: 2px; background-color: #990f3d !important; max-width: 80px;',
      img: 'max-width: 100%; max-height: 600px !important; height: auto; display: block; margin: 32px auto; border: 3px solid #990f3d;',
      table: 'width: 100%; margin: 32px 0; border-collapse: collapse; font-size: 16px; background-color: #fff !important;',
      th: 'background-color: #990f3d !important; color: #fff !important; padding: 14px 16px; text-align: left; border: 1px solid #990f3d; font-weight: 700; font-family: Georgia, serif;',
      td: 'padding: 14px 16px; border: 1px solid #cec6b9; color: #33302e !important; background-color: #fff !important;',
      tr: 'border-bottom: 1px solid #cec6b9;',
    }
  },

  'wechat-jonyive': {
    name: 'Jony Ive',
    styles: {
      container: 'max-width: 620px; margin: 0 auto; padding: 16px 24px 40px 24px; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif; font-size: 17px; line-height: 1.6 !important; color: #6e6e73 !important; background-color: #fbfbfd !important; word-wrap: break-word;',
      h1: 'font-size: 39px; font-weight: 200; color: #1d1d1f !important; line-height: 1.15 !important; margin: 48px 0 24px; letter-spacing: -0.025em;',
      h2: 'font-size: 28px; font-weight: 300; color: #1d1d1f !important; line-height: 1.2 !important; margin: 40px 0 20px; letter-spacing: -0.018em;',
      h3: 'font-size: 20px; font-weight: 400; color: #1d1d1f !important; line-height: 1.25 !important; margin: 32px 0 16px;',
      h4: 'font-size: 15px; font-weight: 500; color: #1d1d1f !important; line-height: 1.3 !important; margin: 24px 0 12px;',
      p: 'margin: 20px 0 !important; line-height: 1.6 !important; color: #6e6e73 !important; font-weight: 300;',
      strong: 'font-weight: 500; color: #1d1d1f !important;',
      em: 'font-style: normal; color: #6e6e73 !important; font-weight: 300;',
      a: 'color: #06c !important; text-decoration: none; font-weight: 400;',
      ul: 'margin: 20px 0; padding-left: 28px;',
      ol: 'margin: 20px 0; padding-left: 28px;',
      li: 'margin: 12px 0; line-height: 1.6 !important; color: #6e6e73 !important; font-weight: 300;',
      blockquote: 'margin: 32px auto; padding: 0; background-color: transparent !important; border-left: none; color: #1d1d1f !important; font-size: 18px; line-height: 1.4 !important; font-weight: 300; text-align: center; max-width: 520px; font-style: normal;',
      code: 'font-family: "SF Mono", Monaco, Menlo, monospace; font-size: 14px; padding: 2px 6px; background-color: #f5f5f7 !important; color: #6e6e73 !important; border-radius: 6px; font-weight: 400;',
      pre: 'margin: 28px 0; padding: 20px; background-color: #f5f5f7 !important; border-radius: 10px; overflow-x: auto; line-height: 1.5 !important;',
      hr: 'margin: 56px auto; border: none; height: 1px; background-color: #d2d2d7 !important; max-width: 48px;',
      img: 'max-width: 100%; max-height: 600px !important; height: auto; display: block; margin: 40px auto; border-radius: 10px;',
      table: 'width: 100%; margin: 32px 0; border-collapse: collapse; font-size: 15px;',
      th: 'background-color: #f5f5f7 !important; padding: 12px 16px; text-align: left; border: none; font-weight: 500; color: #1d1d1f !important;',
      td: 'padding: 12px 16px; border: none; border-top: 1px solid #d2d2d7; color: #6e6e73 !important; font-weight: 300;',
      tr: 'border: none;',
    }
  },

  'wechat-medium': {
    name: 'Medium',
    styles: {
      container: 'max-width: 680px; margin: 0 auto; padding: 20px 12px 40px 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 17px; line-height: 1.7 !important; color: #242424 !important; background-color: #fff !important; word-wrap: break-word;',
      h1: 'font-size: 28px; font-weight: 700; color: #242424 !important; line-height: 1.2 !important; margin: 36px 0 18px; font-family: Georgia, "Times New Roman", serif;',
      h2: 'font-size: 24px; font-weight: 700; color: #242424 !important; line-height: 1.25 !important; margin: 32px 0 16px; font-family: Georgia, "Times New Roman", serif;',
      h3: 'font-size: 20px; font-weight: 700; color: #242424 !important; line-height: 1.3 !important; margin: 28px 0 14px; font-family: Georgia, "Times New Roman", serif;',
      h4: 'font-size: 18px; font-weight: 700; color: #242424 !important; line-height: 1.35 !important; margin: 24px 0 12px; font-family: Georgia, "Times New Roman", serif;',
      p: 'margin: 20px 0 !important; line-height: 1.75 !important; color: #242424 !important; font-size: 17px;',
      strong: 'font-weight: 700; color: #242424 !important;',
      em: 'font-style: italic; color: #242424 !important;',
      a: 'color: #242424 !important; text-decoration: none; border-bottom: 1px solid #242424;',
      ul: 'margin: 20px 0; padding-left: 32px;',
      ol: 'margin: 20px 0; padding-left: 32px;',
      li: 'margin: 10px 0; line-height: 1.7 !important; color: #242424 !important; font-size: 17px;',
      blockquote: 'margin: 20px 0; padding: 0 20px; border-left: 3px solid #242424; color: #242424 !important; font-size: 17px; line-height: 1.6 !important; font-style: italic; font-family: Georgia, "Times New Roman", serif;',
      code: 'font-family: Menlo, Monaco, "Courier New", monospace; font-size: 15px; padding: 2px 6px; background-color: #f5f5f5 !important; color: #d73a49 !important; border-radius: 3px;',
      pre: 'margin: 24px 0; padding: 20px; background-color: #f7f7f7 !important; border-radius: 8px; overflow-x: auto; line-height: 1.5 !important;',
      hr: 'margin: 36px auto; border: none; height: 1px; background-color: #e6e6e6 !important; max-width: 300px;',
      img: 'max-width: 100%; max-height: 500px !important; height: auto; display: block; margin: 24px auto;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 16px;',
      th: 'background-color: #f7f7f7 !important; padding: 10px 14px; text-align: left; border-bottom: 2px solid #e6e6e6; font-weight: 700; color: #242424 !important;',
      td: 'padding: 10px 14px; border-bottom: 1px solid #e6e6e6; color: #242424 !important;',
      tr: 'border: none;',
    }
  },

  'wechat-apple': {
    name: 'Apple 极简',
    styles: {
      container: 'max-width: 640px; margin: 0 auto; padding: 20px 12px 40px 12px; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif; font-size: 17px; line-height: 1.65 !important; color: #86868b !important; background-color: #fbfbfd !important; word-wrap: break-word;',
      h1: 'font-size: 32px; font-weight: 600; color: #1d1d1f !important; line-height: 1.15 !important; margin: 36px 0 18px;',
      h2: 'font-size: 26px; font-weight: 600; color: #1d1d1f !important; line-height: 1.2 !important; margin: 32px 0 16px;',
      h3: 'font-size: 21px; font-weight: 600; color: #1d1d1f !important; line-height: 1.25 !important; margin: 28px 0 14px;',
      h4: 'font-size: 18px; font-weight: 600; color: #1d1d1f !important; line-height: 1.3 !important; margin: 24px 0 12px;',
      p: 'margin: 20px 0 !important; line-height: 1.7 !important; color: #86868b !important; font-size: 17px;',
      strong: 'font-weight: 600; color: #1d1d1f !important;',
      em: 'font-style: normal; color: #86868b !important;',
      a: 'color: #06c !important; text-decoration: none;',
      ul: 'margin: 20px 0; padding-left: 28px;',
      ol: 'margin: 20px 0; padding-left: 28px;',
      li: 'margin: 10px 0; line-height: 1.65 !important; color: #86868b !important;',
      blockquote: 'margin: 24px auto; padding: 0; background-color: transparent !important; border-left: none; color: #1d1d1f !important; font-size: 18px; line-height: 1.45 !important; font-weight: 600; text-align: center; max-width: 560px; font-style: normal;',
      code: 'font-family: "SF Mono", Monaco, Menlo, monospace; font-size: 15px; padding: 2px 6px; background-color: #f5f5f7 !important; color: #86868b !important; border-radius: 8px;',
      pre: 'margin: 24px 0; padding: 20px; background-color: #f5f5f7 !important; border-radius: 10px; overflow-x: auto; line-height: 1.5 !important;',
      hr: 'margin: 36px auto; border: none; height: 1px; background-color: #d2d2d7 !important; max-width: 48px;',
      img: 'max-width: 100%; max-height: 500px !important; height: auto; display: block; margin: 24px auto; border-radius: 10px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;',
      th: 'background-color: #f5f5f7 !important; padding: 10px 16px; text-align: left; border: none; font-weight: 600; color: #1d1d1f !important;',
      td: 'padding: 10px 16px; border: none; border-top: 1px solid #d2d2d7; color: #86868b !important;',
      tr: 'border: none;',
    }
  },

  'wechat-anthropic': {
    name: 'Claude',
    recommended: true,
    styles: {
      container: 'max-width: 700px; margin: 0 auto; padding: 20px 24px 40px 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif; font-size: 17px; line-height: 1.75 !important; color: #2b2b2b !important; background-color: #faf9f7 !important; word-wrap: break-word;',
      h1: 'font-size: 32px; font-weight: 600; color: #C15F3C !important; line-height: 1.2 !important; margin: 36px 0 18px;',
      h2: 'font-size: 26px; font-weight: 600; color: #C15F3C !important; line-height: 1.25 !important; margin: 32px 0 16px;',
      h3: 'font-size: 22px; font-weight: 600; color: #2b2b2b !important; line-height: 1.3 !important; margin: 28px 0 14px;',
      h4: 'font-size: 19px; font-weight: 600; color: #3a3a3a !important; line-height: 1.35 !important; margin: 24px 0 12px;',
      p: 'margin: 20px 0 !important; line-height: 1.8 !important; color: #2b2b2b !important; font-size: 17px;',
      strong: 'font-weight: 600; color: #C15F3C !important; background-color: rgba(193, 95, 60, 0.08) !important; padding: 2px 6px; border-radius: 3px;',
      em: 'font-style: italic; color: #5a5a5a !important;',
      a: 'color: #C15F3C !important; text-decoration: none; border-bottom: 1px solid rgba(193, 95, 60, 0.4); font-weight: 500;',
      ul: 'margin: 20px 0; padding-left: 28px;',
      ol: 'margin: 20px 0; padding-left: 28px;',
      li: 'margin: 10px 0; line-height: 1.8 !important; color: #2b2b2b !important; font-size: 17px;',
      blockquote: 'margin: 18px 0; padding: 10px 16px; background: linear-gradient(135deg, rgba(193, 95, 60, 0.06) 0%, rgba(157, 200, 141, 0.06) 100%); border-left: 4px solid #C15F3C; color: #2b2b2b !important; font-size: 17px; line-height: 1.6 !important; font-style: italic; border-radius: 6px;',
      code: 'font-family: "SF Mono", Consolas, Monaco, monospace; font-size: 15px; padding: 2px 6px; background-color: rgba(193, 95, 60, 0.08) !important; color: #C15F3C !important; border-radius: 6px; font-weight: 500; border: 1px solid rgba(193, 95, 60, 0.15);',
      pre: 'margin: 24px 0; padding: 20px; background: linear-gradient(135deg, #2b2b2b 0%, #3a3a3a 100%); color: #f5f5f5 !important; border-radius: 10px; overflow-x: auto; line-height: 1.55 !important;',
      hr: 'margin: 36px auto; border: none; height: 2px; background: linear-gradient(to right, transparent, rgba(193, 95, 60, 0.3), rgba(157, 200, 141, 0.3), transparent); max-width: 200px;',
      img: 'max-width: 100%; max-height: 500px !important; height: auto; display: block; margin: 24px auto; border-radius: 10px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 16px; border-radius: 8px; overflow: hidden;',
      th: 'background: linear-gradient(135deg, rgba(193, 95, 60, 0.08) 0%, rgba(157, 200, 141, 0.08) 100%); padding: 12px 16px; text-align: left; border: none; font-weight: 600; color: #2b2b2b !important; border-bottom: 2px solid rgba(193, 95, 60, 0.2);',
      td: 'padding: 12px 16px; border: none; border-bottom: 1px solid rgba(193, 95, 60, 0.1); color: #2b2b2b !important;',
      tr: 'border: none;',
    }
  },

  'xiaomuwu-journal': {
    name: '小木屋手账',
    recommended: true,
    styles: {
      container: 'max-width: 700px; margin: 0 auto; padding: 16px 20px 36px 20px; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 16px; line-height: 1.8 !important; color: #4A3728 !important; background-color: #FFF8F0 !important; word-wrap: break-word;',
      h1: 'font-size: 26px; font-weight: 700; color: #8B4513 !important; line-height: 1.3 !important; margin: 36px 0 16px; padding-bottom: 10px; border-bottom: 3px dashed #D2A679;',
      h2: 'font-size: 22px; font-weight: 600; color: #A0522D !important; line-height: 1.35 !important; margin: 30px 0 14px; padding-left: 14px; border-left: 5px solid #D2A679; background-color: rgba(210, 166, 121, 0.08) !important;',
      h3: 'font-size: 19px; font-weight: 600; color: #6B4226 !important; line-height: 1.4 !important; margin: 26px 0 12px; padding-left: 10px; border-left: 3px solid #E8B87A;',
      h4: 'font-size: 17px; font-weight: 600; color: #7B5B3A !important; line-height: 1.45 !important; margin: 22px 0 10px;',
      p: 'margin: 18px 0 !important; line-height: 1.85 !important; color: #4A3728 !important; font-size: 16px;',
      strong: 'font-weight: 700; color: #8B4513 !important; background-color: rgba(255, 200, 87, 0.25) !important; padding: 2px 6px; border-radius: 4px;',
      em: 'font-style: italic; color: #7B5B3A !important;',
      a: 'color: #B8860B !important; text-decoration: none; border-bottom: 1px dashed #B8860B; font-weight: 500;',
      ul: 'margin: 18px 0; padding-left: 28px;',
      ol: 'margin: 18px 0; padding-left: 28px;',
      li: 'margin: 10px 0; line-height: 1.8 !important; color: #4A3728 !important;',
      blockquote: 'margin: 20px 0; padding: 14px 18px; background-color: #FFF3E0 !important; border-left: 5px solid #D2A679; color: #6B4226 !important; font-size: 16px; line-height: 1.65 !important; font-style: italic; border-radius: 0 8px 8px 0;',
      code: 'font-family: "SF Mono", Consolas, Monaco, monospace; font-size: 14px; padding: 2px 6px; background-color: rgba(210, 166, 121, 0.15) !important; color: #8B4513 !important; border-radius: 4px; font-weight: 500;',
      pre: 'margin: 24px 0; padding: 20px; background-color: #3E2723 !important; color: #FFCCBC !important; border-radius: 10px; overflow-x: auto; line-height: 1.55 !important;',
      hr: 'margin: 36px auto; border: none; height: 2px; background: linear-gradient(to right, transparent, #D2A679, transparent); max-width: 200px;',
      img: 'max-width: 100%; max-height: 500px !important; height: auto; display: block; margin: 24px auto; border-radius: 10px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px; border-radius: 8px; overflow: hidden;',
      th: 'background-color: #D2A679 !important; color: #fff !important; padding: 12px 16px; text-align: left; font-weight: 600;',
      td: 'padding: 12px 16px; border-bottom: 1px solid #E8D5B5; color: #4A3728 !important; background-color: #FFFBF5 !important;',
      tr: 'border-bottom: 1px solid #E8D5B5;',
    }
  },

  'sunset-orange': {
    name: '日落橘',
    recommended: true,
    styles: {
      container: 'max-width: 700px; margin: 0 auto; padding: 16px 20px 36px 20px; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 16px; line-height: 1.8 !important; color: #3D2C2C !important; background-color: #FFFAF5 !important; word-wrap: break-word;',
      h1: 'font-size: 26px; font-weight: 700; color: #E8632B !important; line-height: 1.3 !important; margin: 36px 0 16px; padding-bottom: 10px; border-bottom: 3px solid #F4A460;',
      h2: 'font-size: 22px; font-weight: 600; color: #D2691E !important; line-height: 1.35 !important; margin: 30px 0 14px; padding: 6px 16px; background: linear-gradient(135deg, rgba(232, 99, 43, 0.08), rgba(244, 164, 96, 0.08)) !important; border-radius: 6px;',
      h3: 'font-size: 19px; font-weight: 600; color: #C04000 !important; line-height: 1.4 !important; margin: 26px 0 12px; padding-left: 12px; border-left: 4px solid #F4A460;',
      h4: 'font-size: 17px; font-weight: 600; color: #B7410E !important; line-height: 1.45 !important; margin: 22px 0 10px;',
      p: 'margin: 18px 0 !important; line-height: 1.85 !important; color: #3D2C2C !important; font-size: 16px;',
      strong: 'font-weight: 700; color: #E8632B !important; background-color: rgba(244, 164, 96, 0.18) !important; padding: 2px 6px; border-radius: 4px;',
      em: 'font-style: italic; color: #8B4513 !important;',
      a: 'color: #E8632B !important; text-decoration: none; border-bottom: 1px solid rgba(232, 99, 43, 0.4); font-weight: 500;',
      ul: 'margin: 18px 0; padding-left: 28px;',
      ol: 'margin: 18px 0; padding-left: 28px;',
      li: 'margin: 10px 0; line-height: 1.8 !important; color: #3D2C2C !important;',
      blockquote: 'margin: 20px 0; padding: 14px 18px; background: linear-gradient(135deg, #FFF3E8, #FFECD2) !important; border-left: 5px solid #E8632B; color: #5D3A1A !important; font-size: 16px; line-height: 1.65 !important; font-style: italic; border-radius: 0 8px 8px 0;',
      code: 'font-family: "SF Mono", Consolas, Monaco, monospace; font-size: 14px; padding: 2px 6px; background-color: rgba(232, 99, 43, 0.1) !important; color: #D2691E !important; border-radius: 4px; font-weight: 500;',
      pre: 'margin: 24px 0; padding: 20px; background: linear-gradient(135deg, #2C1810, #3E2723) !important; color: #FFCCBC !important; border-radius: 10px; overflow-x: auto; line-height: 1.55 !important;',
      hr: 'margin: 36px auto; border: none; height: 2px; background: linear-gradient(to right, transparent, #E8632B, #F4A460, transparent); max-width: 200px;',
      img: 'max-width: 100%; max-height: 500px !important; height: auto; display: block; margin: 24px auto; border-radius: 10px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px; border-radius: 8px; overflow: hidden;',
      th: 'background-color: #E8632B !important; color: #fff !important; padding: 12px 16px; text-align: left; font-weight: 600;',
      td: 'padding: 12px 16px; border-bottom: 1px solid #F4D1B0; color: #3D2C2C !important; background-color: #FFFBF8 !important;',
      tr: 'border-bottom: 1px solid #F4D1B0;',
    }
  },

  'matcha-latte': {
    name: '抹茶拿铁',
    styles: {
      container: 'max-width: 700px; margin: 0 auto; padding: 16px 20px 36px 20px; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 16px; line-height: 1.8 !important; color: #3A3D38 !important; background-color: #FAFDF7 !important; word-wrap: break-word;',
      h1: 'font-size: 26px; font-weight: 700; color: #4A7C3F !important; line-height: 1.3 !important; margin: 36px 0 16px; padding-bottom: 10px; border-bottom: 3px solid #8FBC8F;',
      h2: 'font-size: 22px; font-weight: 600; color: #5D7E3D !important; line-height: 1.35 !important; margin: 30px 0 14px; padding-left: 14px; border-left: 5px solid #8FBC8F; background-color: rgba(143, 188, 143, 0.06) !important;',
      h3: 'font-size: 19px; font-weight: 600; color: #556B2F !important; line-height: 1.4 !important; margin: 26px 0 12px; padding-left: 10px; border-left: 3px solid #9DC88D;',
      h4: 'font-size: 17px; font-weight: 600; color: #4A6741 !important; line-height: 1.45 !important; margin: 22px 0 10px;',
      p: 'margin: 18px 0 !important; line-height: 1.85 !important; color: #3A3D38 !important; font-size: 16px;',
      strong: 'font-weight: 700; color: #4A7C3F !important; background-color: rgba(143, 188, 143, 0.18) !important; padding: 2px 6px; border-radius: 4px;',
      em: 'font-style: italic; color: #556B2F !important;',
      a: 'color: #4A7C3F !important; text-decoration: none; border-bottom: 1px dashed #8FBC8F; font-weight: 500;',
      ul: 'margin: 18px 0; padding-left: 28px;',
      ol: 'margin: 18px 0; padding-left: 28px;',
      li: 'margin: 10px 0; line-height: 1.8 !important; color: #3A3D38 !important;',
      blockquote: 'margin: 20px 0; padding: 14px 18px; background-color: #F0F7ED !important; border-left: 5px solid #8FBC8F; color: #3A5F3A !important; font-size: 16px; line-height: 1.65 !important; font-style: italic; border-radius: 0 8px 8px 0;',
      code: 'font-family: "SF Mono", Consolas, Monaco, monospace; font-size: 14px; padding: 2px 6px; background-color: rgba(143, 188, 143, 0.15) !important; color: #4A7C3F !important; border-radius: 4px; font-weight: 500;',
      pre: 'margin: 24px 0; padding: 20px; background-color: #1B2E1B !important; color: #C8E6C9 !important; border-radius: 10px; overflow-x: auto; line-height: 1.55 !important;',
      hr: 'margin: 36px auto; border: none; height: 2px; background: linear-gradient(to right, transparent, #8FBC8F, transparent); max-width: 200px;',
      img: 'max-width: 100%; max-height: 500px !important; height: auto; display: block; margin: 24px auto; border-radius: 10px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px; border-radius: 8px; overflow: hidden;',
      th: 'background-color: #5D7E3D !important; color: #fff !important; padding: 12px 16px; text-align: left; font-weight: 600;',
      td: 'padding: 12px 16px; border-bottom: 1px solid #D4E8C8; color: #3A3D38 !important; background-color: #FBFDF8 !important;',
      tr: 'border-bottom: 1px solid #D4E8C8;',
    }
  },

  'sakura-letter': {
    name: '樱花信笺',
    styles: {
      container: 'max-width: 700px; margin: 0 auto; padding: 16px 20px 36px 20px; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: 16px; line-height: 1.8 !important; color: #4A3545 !important; background-color: #FFF5F8 !important; word-wrap: break-word;',
      h1: 'font-size: 26px; font-weight: 700; color: #C4486C !important; line-height: 1.3 !important; margin: 36px 0 16px; padding-bottom: 10px; border-bottom: 3px solid #E8A0BF;',
      h2: 'font-size: 22px; font-weight: 600; color: #B8456B !important; line-height: 1.35 !important; margin: 30px 0 14px; padding: 6px 16px; background-color: rgba(200, 100, 140, 0.06) !important; border-radius: 6px; border-left: 5px solid #E8A0BF;',
      h3: 'font-size: 19px; font-weight: 600; color: #9B3A5A !important; line-height: 1.4 !important; margin: 26px 0 12px; padding-left: 10px; border-left: 3px solid #F0C0D8;',
      h4: 'font-size: 17px; font-weight: 600; color: #A0456B !important; line-height: 1.45 !important; margin: 22px 0 10px;',
      p: 'margin: 18px 0 !important; line-height: 1.85 !important; color: #4A3545 !important; font-size: 16px;',
      strong: 'font-weight: 700; color: #C4486C !important; background-color: rgba(232, 160, 191, 0.18) !important; padding: 2px 6px; border-radius: 4px;',
      em: 'font-style: italic; color: #8B5070 !important;',
      a: 'color: #C4486C !important; text-decoration: none; border-bottom: 1px dashed #E8A0BF; font-weight: 500;',
      ul: 'margin: 18px 0; padding-left: 28px;',
      ol: 'margin: 18px 0; padding-left: 28px;',
      li: 'margin: 10px 0; line-height: 1.8 !important; color: #4A3545 !important;',
      blockquote: 'margin: 20px 0; padding: 14px 18px; background: linear-gradient(135deg, #FFF0F5, #FFE4EE) !important; border-left: 5px solid #E8A0BF; color: #6B3050 !important; font-size: 16px; line-height: 1.65 !important; font-style: italic; border-radius: 0 8px 8px 0;',
      code: 'font-family: "SF Mono", Consolas, Monaco, monospace; font-size: 14px; padding: 2px 6px; background-color: rgba(200, 100, 140, 0.1) !important; color: #B8456B !important; border-radius: 4px; font-weight: 500;',
      pre: 'margin: 24px 0; padding: 20px; background-color: #2D1F28 !important; color: #F8C8D8 !important; border-radius: 10px; overflow-x: auto; line-height: 1.55 !important;',
      hr: 'margin: 36px auto; border: none; height: 2px; background: linear-gradient(to right, transparent, #E8A0BF, #F0C0D8, transparent); max-width: 200px;',
      img: 'max-width: 100%; max-height: 500px !important; height: auto; display: block; margin: 24px auto; border-radius: 10px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px; border-radius: 8px; overflow: hidden;',
      th: 'background-color: #C4486C !important; color: #fff !important; padding: 12px 16px; text-align: left; font-weight: 600;',
      td: 'padding: 12px 16px; border-bottom: 1px solid #F0D0E0; color: #4A3545 !important; background-color: #FFFAFC !important;',
      tr: 'border-bottom: 1px solid #F0D0E0;',
    }
  },

  'vibecoding-tech': {
    name: 'VibeCoding',
    recommended: true,
    styles: {
      container: 'max-width: 720px; margin: 0 auto; padding: 12px 8px 32px 8px; font-family: -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", PingFang SC, "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif; font-size: 15px; line-height: 1.75 !important; color: #3f3f3f !important; background-color: #fff !important; word-wrap: break-word;',
      h1: 'font-size: 19px; font-weight: 700; color: #0056b3 !important; line-height: 1.5 !important; margin: 24px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #0056b3;',
      h2: 'font-size: 18px; font-weight: 600; color: #0056b3 !important; line-height: 1.5 !important; margin: 20px 0 10px; padding-left: 10px; border-left: 4px solid #0056b3;',
      h3: 'font-size: 17px; font-weight: 600; color: #1a1a1a !important; line-height: 1.5 !important; margin: 18px 0 9px; padding-left: 8px; border-left: 3px solid #8b949e;',
      h4: 'font-size: 16px; font-weight: 600; color: #34495e !important; line-height: 1.5 !important; margin: 16px 0 8px;',
      p: 'margin: 12px 0 !important; line-height: 1.75 !important; color: #3f3f3f !important; font-size: 15px;',
      strong: 'font-weight: bold; color: #0F4C81 !important;',
      em: 'font-style: italic; color: #3f3f3f !important;',
      a: 'color: #0056b3 !important; text-decoration: none; border-bottom: 1px solid #0056b3;',
      ul: 'margin: 12px 0; padding-left: 24px;',
      ol: 'margin: 12px 0; padding-left: 24px;',
      li: 'margin: 6px 0; line-height: 1.75 !important; color: #3f3f3f !important;',
      blockquote: 'margin: 16px 0; padding: 12px 16px; background-color: #f6f8fa !important; border-left: 4px solid #0056b3; color: #3f3f3f !important; line-height: 1.6 !important; border-radius: 4px;',
      code: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif; font-size: 90%; background-color: rgba(110,118,129,0.4) !important; color: #c9d1d9 !important; border-radius: 6px;',
      pre: 'margin: 10px 8px !important; padding: 0 !important; background-color: #0d1117 !important; color: #c9d1d9 !important; border-radius: 8px !important; overflow-x: auto; line-height: 1.5 !important; font-size: 90% !important; border: 1px solid #30363d;',
      hr: 'margin: 32px auto; border: none; height: 1px; background-color: #e1e4e8 !important;',
      img: 'max-width: 100%; max-height: 600px !important; height: auto; display: block; margin: 20px auto; border-radius: 8px;',
      table: 'width: 100%; margin: 20px 0; border-collapse: collapse; font-size: 14px;',
      th: 'background-color: #0056b3 !important; color: #fff !important; padding: 10px 14px; text-align: left; font-weight: 600;',
      td: 'padding: 10px 14px; border: 1px solid #e0e0e0; color: #3f3f3f !important;',
      tr: 'border-bottom: 1px solid #e0e0e0;',
    }
  },
};

// ── Inline style injection ────────────────────────────────────────────────

const STYLED_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr', 'img', 'table', 'th', 'td', 'tr'];

function injectStyle(html: string, tag: string, style: string): string {
  // CSS values like font-family: "SF Mono" use double quotes;
  // replace with single quotes to avoid breaking HTML style="..." attribute
  const safeStyle = style.replace(/"/g, "'");
  const regex = new RegExp(`<${tag}(>|\\s)`, 'gi');
  return html.replace(regex, (_match, suffix) => `<${tag} style="${safeStyle}"${suffix}`);
}

function applyStyles(html: string, styleName: string): string {
  const style = STYLES[styleName];
  if (!style) return html;

  // Extract signature block to avoid re-styling it
  const sigRegex = /<section style="font-size: 12px[\s\S]*?<\/section>/;
  const sigMatch = html.match(sigRegex);
  let signature = '';
  if (sigMatch) {
    signature = sigMatch[0];
    html = html.replace(sigRegex, '{{__SIG__}}');
  }

  // Apply inline styles to each element type
  for (const tag of STYLED_TAGS) {
    const rule = style.styles[tag];
    if (rule) html = injectStyle(html, tag, rule);
  }

  // Fix pre > code: code inside pre needs transparent background
  html = html.replace(/<pre\s+style="[^"]*">\s*<code\s+style="([^"]*)"/g,
    (match, codeStyle) => match.replace(
      `style="${codeStyle}"`,
      `style="${codeStyle}background: none !important; padding: 0 !important;"`
    )
  );

  // Restore signature
  if (signature) html = html.replace('{{__SIG__}}', signature);

  // Wrap in container
  return `<div style="${style.styles.container}">${html}</div>`;
}

// ── Main ──────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--list')) {
    console.log('Available styles:\n');
    for (const [key, style] of Object.entries(STYLES)) {
      const tag = style.recommended ? ' (recommended)' : '';
      console.log(`  ${key.padEnd(22)} ${style.name}${tag}`);
    }
    process.exit(0);
  }

  let inputPath = '';
  let outputPath = '';
  let styleName = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if ((arg === '--input' || arg === '-i') && args[i + 1]) inputPath = args[++i]!;
    else if ((arg === '--output' || arg === '-o') && args[i + 1]) outputPath = args[++i]!;
    else if ((arg === '--style' || arg === '-s') && args[i + 1]) styleName = args[++i]!;
    else if (arg === '--help' || arg === '-h') {
      console.log(`WeChat Article Formatter (from 小试AI排版器)

Usage:
  bun format-wechat.ts --input article.md --output styled.html [--style <name>]
  bun format-wechat.ts --list

Options:
  -i, --input <path>    Input markdown file (required)
  -o, --output <path>   Output HTML file (default: same dir as input, .html extension)
  -s, --style <name>    Style name (default: random, use --list to see options)
      --list            List available styles
  -h, --help            Show this help

Recommended styles: xiaomuwu-journal, wechat-anthropic, sunset-orange, vibecoding-tech

Pipeline:
  1. sed replaces {{IMAGE_*}} placeholders in article.md
  2. bun format-wechat.ts --input article.md --output styled.html
  3. bun wechat-article.ts --html styled.html
`);
      process.exit(0);
    }
    else if (!inputPath && !arg.startsWith('-')) inputPath = arg;
  }

  if (!inputPath) {
    console.error('Error: --input is required. Use --help for usage.');
    process.exit(1);
  }

  inputPath = path.resolve(inputPath);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found: ${inputPath}`);
    process.exit(1);
  }

  if (!outputPath) {
    outputPath = inputPath.replace(/\.md$/i, '.html');
  }
  outputPath = path.resolve(outputPath);

  // Pick style: specified > random
  if (styleName && !STYLES[styleName]) {
    console.error(`Error: Unknown style "${styleName}". Use --list to see options.`);
    process.exit(1);
  }
  if (!styleName) {
    const keys = Object.keys(STYLES);
    styleName = keys[Math.floor(Math.random() * keys.length)]!;
  }
  console.log(`[format] Style: ${STYLES[styleName]!.name} (${styleName})`);

  // Read and parse frontmatter
  const raw = fs.readFileSync(inputPath, 'utf-8');
  const { attributes, body } = fm<Record<string, string>>(raw);
  const title = attributes.title || '';
  const author = attributes.author || '';

  // Initialize markdown-it with highlight.js
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(str: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try { return hljs.highlight(str, { language: lang }).value; } catch {}
      }
      return '';
    }
  });

  // Render markdown to HTML
  let html = md.render(body);

  // Apply inline styles
  html = applyStyles(html, styleName);

  // Build full HTML document (for parseHtmlMeta in wechat-article.ts)
  const escapedTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapedAuthor = author.replace(/"/g, '&quot;');
  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>${escapedTitle}</title>
<meta name="author" content="${escapedAuthor}">
</head>
<body>
${html}
</body>
</html>`;

  fs.writeFileSync(outputPath, fullHtml, 'utf-8');
  console.log(`[format] Output: ${outputPath}`);
  console.log(`[format] Title: ${title || '(none)'}`);
  console.log(`[format] Author: ${author || '(none)'}`);
}

main();
