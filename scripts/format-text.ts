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

    // Protect Markdown links [text](url) and images ![alt](url)
    const mdLinks: string[] = [];
    content = content.replace(/!?\[[^\]]*\]\([^)]*\)/g, (match: string) => {
        mdLinks.push(match);
        return `__MD_LINK_${mdLinks.length - 1}__`;
    });

    // Protect Markdown headings (# ## ### etc.)
    const headings: string[] = [];
    content = content.replace(/^(#{1,6}\s.*)$/gm, (match: string) => {
        headings.push(match);
        return `__HEADING_${headings.length - 1}__`;
    });

    // Protect YAML frontmatter
    const frontmatter: string[] = [];
    content = content.replace(/^---\n[\s\S]*?\n---/m, (match: string) => {
        frontmatter.push(match);
        return `__FRONTMATTER_${frontmatter.length - 1}__`;
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
        // Note: [] and () are NOT replaced globally — they are used in Markdown syntax
        // Only replace standalone brackets not part of Markdown links (handled by protection above)
    };

    for (const [en, zh] of Object.entries(punctuationMap)) {
        const regex = new RegExp(en, 'g');
        content = content.replace(regex, zh);
    }

    // Handle quotes (simplified logic)
    content = content.replace(/"([^"]+)"/g, '“$1”');
    content = content.replace(/'([^']+)'/g, '‘$1’');

    // 3. Restore protected tokens (reverse order of extraction)
    urls.forEach((url, i) => {
        content = content.replace(`__URL_${i}__`, url);
    });
    frontmatter.forEach((fm, i) => {
        content = content.replace(`__FRONTMATTER_${i}__`, fm);
    });
    headings.forEach((h, i) => {
        content = content.replace(`__HEADING_${i}__`, h);
    });
    mdLinks.forEach((link, i) => {
        content = content.replace(`__MD_LINK_${i}__`, link);
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
