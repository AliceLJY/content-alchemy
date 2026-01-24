import { readFileSync, writeFileSync } from 'fs';

/**
 * Formats a markdown file for WeChat publication.
 * Fixes punctuation, spacing, and handles code blocks to avoid corruption.
 */
function formatText(filePath: string) {
    let content = readFileSync(filePath, 'utf-8');

    // 1. Temporarily extract code blocks, inline code, and URLs
    const codeBlocks: string[] = [];
    content = content.replace(/```[\s\S]*?```/g, (match: string) => {
        codeBlocks.push(match);
        return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
    });

    const inlineCodes: string[] = [];
    content = content.replace(/`[^`]+`/g, (match: string) => {
        inlineCodes.push(match);
        return `__INLINE_CODE_${inlineCodes.length - 1}__`;
    });

    const urls: string[] = [];
    content = content.replace(/https?:\/\/[^\s)]+/g, (match: string) => {
        urls.push(match);
        return `__URL_${urls.length - 1}__`;
    });

    // 2. Replace English punctuation with Chinese equivalents
    const punctuationMap: { [key: string]: string } = {
        '\\.': '。',
        ',': '，',
        '!': '！',
        '\\?': '？',
        ':': '：',
        ';': '；',
        '\\(': '（',
        '\\)': '）',
        '\\[': '【',
        '\\]': '】',
    };

    for (const [en, zh] of Object.entries(punctuationMap)) {
        const regex = new RegExp(en, 'g');
        content = content.replace(regex, zh);
    }

    // Handle quotes (simplified logic)
    content = content.replace(/"([^"]+)"/g, '“$1”');
    content = content.replace(/'([^']+)'/g, '‘$1’');

    // 3. Restore code blocks, inline code, and URLs
    urls.forEach((url, i) => {
        content = content.replace(`__URL_${i}__`, url);
    });
    inlineCodes.forEach((code, i) => {
        content = content.replace(`__INLINE_CODE_${i}__`, code);
    });
    codeBlocks.forEach((block, i) => {
        content = content.replace(`__CODE_BLOCK_${i}__`, block);
    });

    // 4. Fix spaces between Chinese and English/Numbers
    content = content.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2');
    content = content.replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2');

    writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Formatted: ${filePath}`);
}

const targetFile = process.argv[2];
if (targetFile) {
    formatText(targetFile);
} else {
    console.error('❌ Please provide a file path');
}
