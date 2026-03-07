import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const PLACEHOLDER_PREFIX = '__CONTENT_ALCHEMY_FMT__';
const HELP_TEXT = `Content Alchemy text formatter

Usage:
  bun format-text.ts <markdown-file>
  bun format-text.ts <markdown-file> --check

Options:
  --check     Check whether the file would change, but do not write it
  -h, --help  Show this help
`;

type ReplacementStore = {
    token: string;
    values: string[];
};

function createStore(label: string): ReplacementStore {
    return {
        token: `${PLACEHOLDER_PREFIX}${label}__`,
        values: [],
    };
}

function protect(content: string, pattern: RegExp, store: ReplacementStore): string {
    return content.replace(pattern, (match: string) => {
        const index = store.values.push(match) - 1;
        return `${store.token}${index}__`;
    });
}

function restore(content: string, store: ReplacementStore): string {
    return store.values.reduce((acc, value, index) => {
        return acc.replace(`${store.token}${index}__`, value);
    }, content);
}

type CliArgs = {
    filePath?: string;
    check: boolean;
    help: boolean;
};

function parseArgs(argv: string[]): CliArgs {
    const args: CliArgs = { check: false, help: false };

    for (const arg of argv) {
        if (arg === '--check') {
            args.check = true;
        } else if (arg === '--help' || arg === '-h') {
            args.help = true;
        } else if (!arg.startsWith('-') && !args.filePath) {
            args.filePath = arg;
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    return args;
}

/**
 * Formats a markdown file for WeChat publication.
 * Fixes punctuation, spacing, and handles code blocks to avoid corruption.
 */
function formatContent(input: string): string {
    let content = input;

    // 1. Temporarily extract code blocks, inline code, and URLs
    const codeBlocks = createStore('CODE_BLOCK_');
    content = protect(content, /```[\s\S]*?```/g, codeBlocks);

    const inlineCodes = createStore('INLINE_CODE_');
    content = protect(content, /`[^`]+`/g, inlineCodes);

    // Protect Markdown links [text](url) and images ![alt](url)
    const mdLinks = createStore('MD_LINK_');
    content = protect(content, /!?\[[^\]]*\]\([^)]*\)/g, mdLinks);

    // Protect content-alchemy image placeholders
    const imagePlaceholders = createStore('IMAGE_PLACEHOLDER_');
    content = protect(content, /\[\[IMAGE:[^\]]+\]\]/g, imagePlaceholders);

    // Protect Markdown headings (# ## ### etc.)
    const headings = createStore('HEADING_');
    content = protect(content, /^(#{1,6}\s.*)$/gm, headings);

    // Protect YAML frontmatter
    const frontmatter = createStore('FRONTMATTER_');
    content = protect(content, /^---\n[\s\S]*?\n---/m, frontmatter);

    const urls = createStore('URL_');
    content = protect(content, /https?:\/\/[^\s)]+/g, urls);

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
    content = restore(content, urls);
    content = restore(content, frontmatter);
    content = restore(content, headings);
    content = restore(content, mdLinks);
    content = restore(content, imagePlaceholders);
    content = restore(content, inlineCodes);
    content = restore(content, codeBlocks);

    // 4. Fix spaces between Chinese and English/Numbers
    content = content.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2');
    content = content.replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2');

    return content;
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        console.log(HELP_TEXT);
        return;
    }

    if (!args.filePath) {
        throw new Error('Please provide a file path');
    }

    const resolvedPath = resolve(args.filePath);
    if (!existsSync(resolvedPath)) {
        throw new Error(`File not found: ${resolvedPath}`);
    }
    if (!statSync(resolvedPath).isFile()) {
        throw new Error(`Not a file: ${resolvedPath}`);
    }

    const original = readFileSync(resolvedPath, 'utf-8');
    const formatted = formatContent(original);

    if (args.check) {
        if (formatted === original) {
            console.log(`✅ Already formatted: ${resolvedPath}`);
            return;
        }
        console.error(`⚠️ Formatting needed: ${resolvedPath}`);
        process.exit(1);
    }

    if (formatted === original) {
        console.log(`✅ No changes needed: ${resolvedPath}`);
        return;
    }

    writeFileSync(resolvedPath, formatted, 'utf-8');
    console.log(`✅ Formatted: ${resolvedPath}`);
}

try {
    main();
} catch (error) {
    console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
}
