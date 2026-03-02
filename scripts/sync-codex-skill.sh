#!/usr/bin/env bash
# sync-codex-skill.sh — Sync CC's SKILL.md → Codex-compatible SKILL.md
# Keeps Codex frontmatter (name+description only), replaces body from CC source.
#
# Usage: ./sync-codex-skill.sh [--check]
#   --check : only compare, exit 1 if out of sync (for CI/hooks)
#   (no arg): overwrite Codex SKILL.md with latest content

set -euo pipefail

CC_SKILL="$HOME/.claude/skills/content-alchemy/SKILL.md"
CODEX_SKILL="$HOME/.codex/skills/content-alchemy/SKILL.md"

# ── Codex-compatible frontmatter (static, rarely changes) ──
CODEX_FRONTMATTER='---
name: content-alchemy
description: |
  Transform raw ideas into professional WeChat articles through a 5-stage semi-automated pipeline.
  Stages: Topic Mining -> Source Extraction -> Deep Analysis -> Cross-Reference -> Refining -> Humanized Article.
  Use this skill when the user wants to:
  - Write a WeChat article (写文章, 写公众号)
  - Run the Content Alchemy pipeline (内容炼金, alchemy)
  - Research a topic and produce a publishable article (research, 分析)
  - Generate content for the public account "我的AI小木屋" (author: 小试AI)
  - Auto-generate an article from a topic or material pack (自动生成文章)
  Trigger phrases: "写文章", "写公众号", "内容炼金", "alchemy", "话题写", "自动生成文章", "research", "分析"
---'

# ── Extract body (everything after the closing ---) from CC source ──
extract_body() {
  awk 'BEGIN{n=0} /^---$/{n++; if(n==2){found=1; next}} found{print}' "$CC_SKILL"
}

# ── Build the full Codex SKILL.md ──
build_codex() {
  printf '%s\n' "$CODEX_FRONTMATTER"
  extract_body
}

if [[ "${1:-}" == "--check" ]]; then
  # Compare mode
  EXPECTED=$(build_codex)
  if [[ -f "$CODEX_SKILL" ]]; then
    CURRENT=$(cat "$CODEX_SKILL")
  else
    CURRENT=""
  fi
  if [[ "$EXPECTED" == "$CURRENT" ]]; then
    echo "✅ Codex SKILL.md is in sync with CC source."
    exit 0
  else
    echo "⚠️  Codex SKILL.md is OUT OF SYNC."
    echo "   Run: $0  (without --check) to fix."
    exit 1
  fi
else
  # Sync mode — atomic write + post-sync validation
  mkdir -p "$(dirname "$CODEX_SKILL")"
  TMPFILE="${CODEX_SKILL}.tmp.$$"
  build_codex > "$TMPFILE"

  # ── Sanity check before committing ──
  FAIL=0
  for key in "name:" "description:" "Stage 1" "Stage 5" "Reference Files"; do
    if ! grep -q "$key" "$TMPFILE"; then
      echo "❌ Validation failed: missing '$key' in generated file"
      FAIL=1
    fi
  done
  if [[ $FAIL -ne 0 ]]; then
    rm -f "$TMPFILE"
    exit 1
  fi

  # Atomic swap
  mv -f "$TMPFILE" "$CODEX_SKILL"
  echo "✅ Synced: $CC_SKILL → $CODEX_SKILL"
fi
