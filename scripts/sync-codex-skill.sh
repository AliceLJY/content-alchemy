#!/usr/bin/env bash
# sync-codex-skill.sh — Sync CC's SKILL.md → Codex-compatible SKILL.md
# Keeps Codex frontmatter (name+description only), replaces body from CC source.
#
# Usage: ./sync-codex-skill.sh [--check]
#   --check : only compare, exit 1 if out of sync (for CI/hooks)
#   (no arg): overwrite Codex SKILL.md with latest content

set -euo pipefail

CC_SKILL="${CC_SKILL_PATH:-$HOME/.claude/skills/content-alchemy/SKILL.md}"
CODEX_SKILL="${CODEX_SKILL_PATH:-$HOME/.codex/skills/content-alchemy/SKILL.md}"
TMPFILE=""
MODE="sync"

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

validate_source_skill() {
  local fence_count
  fence_count="$(grep -c '^---$' "$CC_SKILL" || true)"
  if [[ "$fence_count" -lt 2 ]]; then
    echo "❌ Source SKILL.md must contain complete frontmatter fences: $CC_SKILL"
    exit 1
  fi

  if [[ -z "$(extract_body)" ]]; then
    echo "❌ Source SKILL.md body is empty after frontmatter: $CC_SKILL"
    exit 1
  fi
}

# ── Build the full Codex SKILL.md ──
build_codex() {
  printf '%s\n' "$CODEX_FRONTMATTER"
  extract_body
}

cleanup() {
  if [[ -n "$TMPFILE" && -f "$TMPFILE" ]]; then
    rm -f "$TMPFILE"
  fi
}

trap cleanup EXIT

print_help() {
  cat <<EOF
sync-codex-skill.sh — Sync CC's SKILL.md to the Codex-compatible target

Usage:
  ./sync-codex-skill.sh
  ./sync-codex-skill.sh --check

Options:
  --check   Compare only; exit 1 when out of sync
  -h, --help  Show this help

Overrides:
  CC_SKILL_PATH     Source skill path
  CODEX_SKILL_PATH  Target skill path
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --check)
      MODE="check"
      shift
      ;;
    --help|-h)
      print_help
      exit 0
      ;;
    *)
      echo "❌ Unknown argument: $1"
      print_help >&2
      exit 1
      ;;
  esac
done

if [[ ! -f "$CC_SKILL" ]]; then
  echo "❌ Source skill not found: $CC_SKILL"
  exit 1
fi

validate_source_skill

if [[ "$MODE" == "check" ]]; then
  if [[ -f "$CODEX_SKILL" ]]; then
    if diff -u <(build_codex) "$CODEX_SKILL" >/dev/null; then
      echo "✅ Codex SKILL.md is in sync with CC source."
      exit 0
    fi
  else
    echo "⚠️  Codex SKILL.md is missing."
    echo "   Run: $0  (without --check) to create it."
    exit 1
  fi
  echo "⚠️  Codex SKILL.md is OUT OF SYNC."
  echo "   Run: $0  (without --check) to fix."
  exit 1
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
    exit 1
  fi

  # Atomic swap
  mv -f "$TMPFILE" "$CODEX_SKILL"
  TMPFILE=""
  echo "✅ Synced: $CC_SKILL → $CODEX_SKILL"
fi
