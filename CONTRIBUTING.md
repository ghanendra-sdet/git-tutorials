---
title: "Contributing"
description: "How to contribute to GIT Tutorials — the exact fork/clone/branch/PR flow this course itself teaches in Module 03."
---

# Contributing to GIT Tutorials

This course explicitly invites you to practice [Module 03](./03-contributing-to-open-source/)
on this very repo — a typo fix, a broken link, an outdated command, or a clearer explanation are
all genuinely welcome. This file is the specific version of the generic flow that module teaches.

## The flow

1. **Fork** this repo (top right on GitHub)
2. **Clone your fork**, then add this repo as `upstream`:
   ```bash
   git clone git@github.com:yourusername/git-tutorials.git
   cd git-tutorials
   git remote add upstream git@github.com:ghanendra-sdet/git-tutorials.git
   ```
3. **Branch** for your specific change — never commit directly to `main`:
   ```bash
   git switch -c fix/broken-link-in-module-04
   ```
4. **Make the change.** Keep it small and focused — one fix per PR, per
   [Module 03](./03-contributing-to-open-source/#-send-a-pull-request)'s own advice.
5. **Check it** before pushing — see Content Checks below.
6. **Push to your fork, open a PR** against `ghanendra-sdet/git-tutorials` `main`.

## Content checks before opening a PR

This repo validates two things automatically in CI on every PR (see
[`.github/workflows/validate-docs.yml`](./.github/workflows/validate-docs.yml)):

- Every fenced code block (` ``` `) has a matching close
- Every relative Markdown link resolves to a real file

You can run the same check locally before pushing:

```bash
python3 .github/scripts/check_docs.py
```

## What makes a good contribution here specifically

- **Preserve the teaching philosophy.** Every section pairs a real-life analogy with a runnable
  command — if you're adding a new concept, keep that pairing, not just the command.
- **Hands-on over read-only.** If you're adding a new command or concept, a `callout-tryit` block
  the reader can actually run beats another paragraph of explanation.
- **Dummy data only.** Every example uses placeholder names/emails/URLs — never anything that
  looks like a real credential or real personal data.
- **Don't remove existing examples, analogies, or labs** to make room for new ones unless they're
  factually wrong — this course's own ground rule for itself.

## Reporting an issue instead of fixing it yourself

That's genuinely fine too — open an issue using the templates under **New Issue**. A clearly
described problem is still a real contribution.
