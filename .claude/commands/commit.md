---
description: Draft a commit message based on staged changes and commit history style
---

Based on the style of my regular commit messages, draft a commit message for my currently staged changes.

Instructions:
1. Run `git status` to see what's currently staged
2. Run `git log --oneline -10` to analyze my commit message style
3. Run `git diff --staged --stat` to see a summary of changes
4. Review key changed files with `git diff --staged` (focus on the most important ones)
5. Draft a commit message that:
   - Follows my established commit message conventions (type prefix, format, level of detail)
   - Accurately describes what changed and why
   - Uses appropriate commit type (feat, fix, refactor, test, doc, style, chore, etc.)
   - Includes a concise first line and detailed body if there are multiple changes

IMPORTANT:
- Do NOT commit the changes - only draft the message for me to review
- Present the message in a code block so I can easily copy it
- Explain any notable patterns you noticed in my commit style
- Ensure it can be pasted on the command line with no special characters or double quotes
