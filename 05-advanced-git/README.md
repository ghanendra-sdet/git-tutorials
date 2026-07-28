<div align="center" markdown="1">

# 🚀 Module 05 — Advanced Git

![Level](https://img.shields.io/badge/level-advanced-red.svg)
![Time](https://img.shields.io/badge/time-3--4%20hours-blue.svg)

**The stuff that shows up in senior job descriptions and nowhere in a beginner tutorial. This is where "I know Git" becomes "I actually know Git."**

</div>

---

## 📑 In This Module

- [.gitignore](#-gitignore)
- [.gitattributes](#-gitattributes)
- [Git LFS — Large File Storage](#-git-lfs--large-file-storage)
- [Signing Commits & Tags](#-signing-commits--tags)
- [Cherry-pick & Patch](#-cherry-pick--patch)
- [Merge Conflicts, Properly](#-merge-conflicts-properly)
- [Git in CI/CD](#-git-in-cicd)
- [Git Hooks](#-git-hooks)
- [Submodules](#-submodules)
- [Remote — Advanced](#-remote--advanced)
- [Glossary (Module 05 Terms)](#-glossary-module-05-terms)

---

## 🚫 .gitignore

Tells Git "never track these files, don't even ask."

```bash
# .gitignore
node_modules/
.env
*.log
dist/
.DS_Store
```

### 🎭 The real-life example

You wouldn't mail your neighbor a photocopy of your trash can along with your important
documents. `.gitignore` is drawing a line around the stuff that's either regenerable
(`node_modules/`, `dist/`), machine-specific junk (`.DS_Store`), or genuinely dangerous to share
(`.env` with real API keys) — and telling Git to never even consider it.

```bash
# Already accidentally tracked a file BEFORE adding it to .gitignore?
# Adding it to .gitignore alone won't untrack it — you have to explicitly remove it:
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "chore: stop tracking .env, add to gitignore"
```

> [!WARNING]
> `.gitignore` only prevents **future** tracking. If a secret was ever committed, it's sitting in
> your Git history forever — `git rm --cached` removes it going forward, but doesn't erase the old
> commits that still contain it. If a real secret leaks, the fix is **rotating the credential**,
> not just removing the file. [gitignore.io](https://www.toptal.com/developers/gitignore) generates
> solid starter files for any language/framework combination.

---

## 🏷️ .gitattributes

Tells Git how to **handle** specific files, not just whether to track them.

```
# .gitattributes
* text=auto              # normalize line endings automatically
*.jpg binary              # never try to diff/merge these as text
*.png binary
*.pdf binary
docs/CHANGELOG.md merge=union   # union merge: combine both sides instead of conflicting
```

### 🎭 The real-life example

Windows and Mac/Linux disagree on how to end a line of text (`\r\n` vs `\n`) — invisible in your
editor, but it makes Git think **every single line** of a file changed when only line-endings
differ, drowning real diffs in noise. `.gitattributes`'s `text=auto` line settles that argument
once, for the whole repo, so nobody has to think about it again.

---

## 📦 Git LFS — Large File Storage

Git is fundamentally bad at large binary files (videos, design files, datasets) — every version
of every binary gets stored in full, forever, bloating the repo. **Git LFS** replaces those large
files with small text pointers in the actual Git history, storing the real content separately.

```bash
git lfs install
git lfs track "*.psd"
git lfs track "*.mp4"
git add .gitattributes    # LFS tracking rules live here
git add design-mockup.psd
git commit -m "feat: add homepage design mockup"
git push
```

### 🎭 The real-life example

Instead of mailing a 2GB video file inside every single letter in your correspondence forever,
you mail a note that says "the video is at this specific address" — the actual video lives
elsewhere, fetched only when someone actually needs it. Your letters (the Git history) stay small
and fast, no matter how many video versions accumulate over time.

---

## ✍️ Signing Commits & Tags

Cryptographically proves a commit or tag actually came from you, not someone impersonating your
name/email (which, unsigned, is trivially easy to fake).

```bash
# One-time setup: generate a GPG key, add it to GitHub (Settings → SSH and GPG keys)
git config --global user.signingkey <your-key-id>
git config --global commit.gpgsign true    # sign EVERY commit automatically from now on

git commit -S -m "fix: critical security patch"   # sign just this one, manually
git tag -s v1.0.0 -m "Signed release"              # signed tag
```

Signed commits show a verified **"Verified"** badge on GitHub — a real trust signal, especially
significant for security-sensitive open-source projects where "did this commit actually come from
a trusted maintainer" genuinely matters.

---

## 🍒 Cherry-pick & Patch

**Cherry-pick** — apply one specific commit from anywhere onto your current branch:

```bash
git log other-branch --oneline    # find the commit hash you want
git cherry-pick a3f291c           # apply JUST that one commit here
```

### 🎭 The real-life example

Someone else's notebook has one page you desperately need — not their whole notebook, just that
one page. Cherry-pick copies exactly one commit's changes onto your branch, without merging
everything else that branch has.

**Common real scenario:** a critical bug fix landed on `main`, and you need it on an older
`release/v1.2` branch too, without merging all of `main`'s other unrelated changes into that
release branch.

```bash
git checkout release/v1.2
git cherry-pick <hash-of-the-fix-commit-on-main>
```

**Patch** — export changes as a portable file, apply them elsewhere (useful when you can't push
directly, e.g. emailing a fix to an offline system):

```bash
git format-patch -1 HEAD              # exports the last commit as a .patch file
git apply 0001-fix-critical-bug.patch # someone else applies it on their machine
```

---

## ⚔️ Merge Conflicts, Properly

The moment two people (or two branches) changed the **exact same lines** differently, and Git
genuinely cannot guess which version you want.

```bash
git merge feature/pricing-update
# Auto-merging pricing.js
# CONFLICT (content): Merge conflict in pricing.js
# Automatic merge failed; fix conflicts and then commit the result.
```

```javascript
// pricing.js now looks like this:
<<<<<<< HEAD
const discountRate = 0.10;
=======
const discountRate = 0.15;
>>>>>>> feature/pricing-update
```

### Step by step

1. Open the file — `<<<<<<< HEAD` through `=======` is **your** current branch's version;
   `=======` through `>>>>>>> branch-name` is the **incoming** branch's version
2. Manually edit the file to what it *should* actually be — delete the `<<<<<<<`, `=======`, and
   `>>>>>>>` marker lines entirely
3. `git add pricing.js` — mark it as resolved
4. `git commit` — completes the merge with a merge commit

```bash
git status                  # shows exactly which files still have unresolved conflicts
git merge --abort            # changed your mind entirely? bail out, back to pre-merge state
```

### 🎭 The real-life example

Two editors changed the exact same sentence in a shared document, differently, while both
offline. Word can't guess which version is "correct" — a human has to look at both versions and
decide (or write a third, better version combining both intents). That's precisely what
resolving a merge conflict is: reading both sides, understanding what each was actually trying to
do, and writing the version that's genuinely correct.

> [!TIP]
> **Reduce conflicts before they happen:** pull/rebase from `main` frequently instead of letting
> your branch drift for weeks. The longer two branches diverge, the more surface area for
> conflicting changes. A branch merged after 2 days has far fewer conflicts than the same branch
> merged after 3 weeks.

---

## ⚙️ Git in CI/CD

Git isn't just for humans typing commands — CI/CD pipelines (GitHub Actions, Jenkins) are built
entirely around Git events.

```yaml
# .github/workflows/test.yml — a real, minimal example
name: Run Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4    # this step IS a git clone, done for you
      - run: npm install
      - run: npm test
```

### 🎭 The real-life example

CI/CD is an automatic inspector standing at the shared filing cabinet, who reads every new page
the moment it's filed (`git push`) and immediately checks it for problems — without waiting for a
human to ask. `on: push` / `on: pull_request` are literally Git events triggering that inspection.

---

## 🪝 Git Hooks

Scripts that run automatically at specific points in Git's workflow — entirely local, entirely
yours to customize.

```bash
# .git/hooks/pre-commit  (make it executable: chmod +x .git/hooks/pre-commit)
#!/bin/sh
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Lint failed. Commit aborted."
  exit 1
fi
```

### 🎭 The real-life example

A hook is a bouncer standing at the door of `git commit`, checking IDs before letting anything in.
A `pre-commit` hook that runs your linter means broken, unlinted code physically cannot get
committed in the first place — the check happens *before* the door opens, not after.

**Common hooks:** `pre-commit` (lint/format before allowing a commit), `commit-msg` (enforce a
message format, e.g. requiring `feat:`/`fix:` prefixes), `pre-push` (run the full test suite
before allowing a push).

> [!NOTE]
> Raw hooks in `.git/hooks/` aren't committed to the repo (that folder is Git-internal, not
> tracked) — everyone on a team has to set them up individually. Tools like
> [Husky](https://typicode.github.io/husky/) solve this by making hooks a normal, committed,
> shareable part of the project instead.

---

## 🧩 Submodules

A way to include **one Git repository inside another**, as a linked reference rather than a copy.

```bash
git submodule add https://github.com/someorg/shared-ui-library.git libs/shared-ui
git commit -m "chore: add shared-ui-library as a submodule"

# Someone ELSE cloning your repo needs an extra step to get the submodule's content too:
git clone --recurse-submodules <your-repo-url>
# or, if already cloned without it:
git submodule update --init --recursive
```

### 🎭 The real-life example

Instead of photocopying an entire reference book into your own notebook (and now owning a stale
copy that never updates), a submodule is a sticky note saying "see this exact edition of that
book, over there" — your repo tracks *which specific commit* of the other repo it depends on,
without duplicating its content or history.

> [!WARNING]
> Submodules have a well-earned reputation for being finicky — forgetting `--recurse-submodules`
> on clone, or forgetting to commit an updated submodule reference after the submodule itself
> changed, are the two most common real-world headaches. Many teams now prefer package managers
> (npm, a monorepo tool) for code-sharing and reserve submodules for genuinely separate,
> independently-versioned repos.

---

## 🔗 Remote — Advanced

```bash
git remote add upstream <url>       # multiple remotes on one repo (Module 03's fork workflow)
git remote rename origin old-origin # rename a remote
git remote show origin              # detailed info: tracked branches, push/pull URLs
git remote prune origin             # clean up local references to branches deleted on the remote
git ls-remote origin                # list every branch/tag on the remote WITHOUT cloning anything
```

`git remote prune origin` is the fix for that annoying situation where `git branch -a` keeps
showing branches that were already deleted on GitHub weeks ago — your local repo just hasn't been
told yet.

---

## 📖 Glossary (Module 05 Terms)

| Term | Meaning |
|---|---|
| **`.gitignore`** | Tells Git which files/patterns to never track |
| **`.gitattributes`** | Tells Git how to handle specific file types (line endings, diff/merge behavior) |
| **Git LFS** | Stores large binary files as pointers, keeping the actual repo small and fast |
| **Signed commit** | A commit cryptographically verified to actually be from you |
| **Cherry-pick** | Apply one specific commit from any branch onto your current one |
| **Merge conflict** | When Git can't automatically reconcile two changes to the same lines — needs human resolution |
| **Git hook** | A script that runs automatically at a specific point in Git's workflow (e.g. before a commit) |
| **Submodule** | A Git repository nested inside another, tracked as a reference to a specific commit |

---

## ✅ Quick Check-In

1. Why doesn't adding a file to `.gitignore` remove it from history if it was already committed?
2. When would you reach for `cherry-pick` instead of a full `merge`?
3. What's the actual difference between what a `pre-commit` hook checks vs. what CI checks — and
   why do teams often use both, not just one?

(#3: a `pre-commit` hook is fast, local, and optional (someone COULD skip it with `--no-verify`)
— CI is slower, remote, and mandatory. Teams use both: hooks for a fast local safety net, CI as
the actual, unskippable gate.)

---

<div align="center" markdown="1">

**[⬆ Back to Top](#-module-05--advanced-git)** | **[🏠 Main README](../README.md)** | **[← Previous: Undo & Recovery](../04-undo-and-recovery/)** | **[Next: Certification Prep →](../06-certification-prep/)**

</div>
