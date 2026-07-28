<div align="center" markdown="1">

# 🧠 Command Recall Drill

### Reading a command once doesn't make it stick. Getting quizzed on it does.

</div>

---

## How to Actually Use This Page

This isn't a cheat sheet to skim — it's a **drill**. For each scenario below:

1. **Read the scenario only.** Don't look at the answer yet.
2. **Say the command out loud** (or type it into a real terminal, in a real throwaway repo —
   see [Setting Up a Practice Repo](#-setting-up-a-practice-repo-do-this-once) below).
3. **Then** click to reveal the answer and check yourself.
4. Got it wrong or hesitated? Put a mark next to it. Come back to *only the marked ones*
   tomorrow. That's spaced repetition — it's the actual reason this page exists instead of just
   pointing you back at the modules.

> [!TIP]
> Do 10-15 of these a day, not all 60 in one sitting. Cramming produces recognition ("oh yeah, I
> read that"). Spaced, active recall produces the real thing — being able to type the command
> without thinking, mid-incident, six months from now.

---

## 🏗️ Setting Up a Practice Repo (Do This Once)

Every drill below assumes you have a real, disposable folder to actually type these commands
into — not just read them.

```bash
mkdir ~/git-drill && cd ~/git-drill
git init
echo "# Git Drill" > README.md
git add README.md
git commit -m "initial commit"
```

Keep this folder around for the whole course. Break it, fix it, delete branches, force-push into
the void — it's disposable, that's the point.

---

## Module 00-01 — Foundations & Fundamentals

<details>
<summary><strong>You just started a new project folder. Turn it into a Git repo.</strong></summary>

```bash
git init
```
</details>

<details>
<summary><strong>Set your name and email globally, once, for every repo on this machine.</strong></summary>

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```
</details>

<details>
<summary><strong>You edited 3 files but only want to commit 1 of them.</strong></summary>

```bash
git add path/to/the-one-file.js
git commit -m "message describing just that change"
```
</details>

<details>
<summary><strong>You want to see exactly what's changed before you stage anything.</strong></summary>

```bash
git status
git diff
```
</details>

<details>
<summary><strong>Stage a file interactively, chunk by chunk (not the whole file at once).</strong></summary>

```bash
git add -p
```
</details>

<details>
<summary><strong>You need to switch branches urgently but have uncommitted work you're not ready to commit.</strong></summary>

```bash
git stash
```
</details>

<details>
<summary><strong>Bring back the most recent stash and remove it from the stash list.</strong></summary>

```bash
git stash pop
```
</details>

<details>
<summary><strong>Create a new branch AND switch to it, in one command.</strong></summary>

```bash
git checkout -b feature/my-branch
```
</details>

<details>
<summary><strong>See the last 5 commits, one line each.</strong></summary>

```bash
git log --oneline -5
```
</details>

<details>
<summary><strong>See history as a visual branch graph.</strong></summary>

```bash
git log --graph --oneline --all
```
</details>

<details>
<summary><strong>Mark the current commit as a release, with its own message.</strong></summary>

```bash
git tag -a v1.0.0 -m "First stable release"
```
</details>

---

## Module 02 — Git + GitHub

<details>
<summary><strong>Generate a new SSH key for GitHub authentication.</strong></summary>

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
</details>

<details>
<summary><strong>Verify your SSH connection to GitHub actually works.</strong></summary>

```bash
ssh -T git@github.com
```
</details>

<details>
<summary><strong>Connect a local repo to a GitHub repo for the first time.</strong></summary>

```bash
git remote add origin git@github.com:username/repo.git
```
</details>

<details>
<summary><strong>Push a branch to GitHub for the first time (and set up tracking).</strong></summary>

```bash
git push -u origin branch-name
```
</details>

<details>
<summary><strong>Check what's new on the remote WITHOUT touching your local files.</strong></summary>

```bash
git fetch origin
```
</details>

<details>
<summary><strong>Download AND merge new remote commits into your current branch, in one step.</strong></summary>

```bash
git pull origin main
```
</details>

<details>
<summary><strong>Push, but safely refuse if the remote has changes you haven't seen (safer than --force).</strong></summary>

```bash
git push --force-with-lease
```
</details>

---

## Module 03 — Contributing to Open Source

<details>
<summary><strong>You forked a repo on GitHub. Bring YOUR fork down to your machine.</strong></summary>

```bash
git clone git@github.com:yourusername/their-repo.git
```
</details>

<details>
<summary><strong>Add the ORIGINAL repo as a second remote so you can stay in sync with it.</strong></summary>

```bash
git remote add upstream git@github.com:original-owner/their-repo.git
```
</details>

<details>
<summary><strong>Sync your fork's main branch with the real project's latest changes.</strong></summary>

```bash
git fetch upstream
git checkout main
git merge upstream/main
```
</details>

---

## Module 04 — Undo & Recovery (the one to actually memorize cold)

<details>
<summary><strong>You need to undo a commit that's ALREADY been pushed and pulled by teammates.</strong></summary>

```bash
git revert <commit-hash>
```
</details>

<details>
<summary><strong>Undo your last commit, keep the changes staged, ready to re-commit.</strong></summary>

```bash
git reset --soft HEAD~1
```
</details>

<details>
<summary><strong>Undo your last commit, keep the changes but unstage them.</strong></summary>

```bash
git reset --mixed HEAD~1
```
</details>

<details>
<summary><strong>Undo your last commit and discard the changes completely (dangerous — know this one cold).</strong></summary>

```bash
git reset --hard HEAD~1
```
</details>

<details>
<summary><strong>You just committed but the message has a typo. Not pushed yet.</strong></summary>

```bash
git commit --amend -m "corrected message"
```
</details>

<details>
<summary><strong>You forgot to add a file to your last commit. Not pushed yet.</strong></summary>

```bash
git add forgotten-file.js
git commit --amend --no-edit
```
</details>

<details>
<summary><strong>Replay your branch's commits on top of the latest main, for clean linear history.</strong></summary>

```bash
git rebase main
```
</details>

<details>
<summary><strong>You ran <code>reset --hard</code> and think you lost work. First command, always.</strong></summary>

```bash
git reflog
```
</details>

<details>
<summary><strong>Found the lost commit in reflog. Bring it back safely without touching your current branch.</strong></summary>

```bash
git branch recovery-branch HEAD@{1}
```
</details>

<details>
<summary><strong>Apply one specific commit from another branch onto your current branch.</strong></summary>

```bash
git cherry-pick <commit-hash>
```
</details>

---

## Module 05 — Advanced Git

<details>
<summary><strong>You accidentally committed a file before adding it to .gitignore. Stop tracking it going forward.</strong></summary>

```bash
git rm --cached .env
```
</details>

<details>
<summary><strong>Set up Git LFS to track a large binary file type.</strong></summary>

```bash
git lfs install
git lfs track "*.psd"
```
</details>

<details>
<summary><strong>Sign a single commit manually.</strong></summary>

```bash
git commit -S -m "message"
```
</details>

<details>
<summary><strong>Export your last commit as a portable patch file.</strong></summary>

```bash
git format-patch -1 HEAD
```
</details>

<details>
<summary><strong>Bail out of a merge entirely, back to the pre-merge state.</strong></summary>

```bash
git merge --abort
```
</details>

<details>
<summary><strong>Clean up local references to branches that were already deleted on the remote.</strong></summary>

```bash
git remote prune origin
```
</details>

<details>
<summary><strong>See every branch/tag on a remote WITHOUT cloning the whole repo.</strong></summary>

```bash
git ls-remote origin
```
</details>

---

## 🎯 Full-Speed Round (No Hints)

Once every section above feels easy, try this round cold — just the scenario, nothing else:

1. Undo a commit that three teammates have already pulled.
2. You're mid-feature, urgent bug fix needed on a different branch, work isn't commit-ready.
3. You just realized `reset --hard` was a mistake, thirty seconds ago.
4. Clean, linear history for your own not-yet-pushed branch before opening a PR.
5. Stage only part of a file's changes, not the whole file.
6. Check the remote for new commits without touching your working directory.
7. A teammate's branch was deleted on GitHub but still shows up locally.
8. You need one specific commit from `main` applied to an old release branch.

<details>
<summary>Answers</summary>

1. `git revert <hash>`
2. `git stash`
3. `git reflog`, then `git branch recovery-branch HEAD@{1}` (or `reset --hard` to that hash)
4. `git rebase main`
5. `git add -p`
6. `git fetch origin`
7. `git remote prune origin`
8. `git cherry-pick <hash>`

</details>

---

<div align="center" markdown="1">

**[🏠 Main README](../README.md)** | **[📖 Cheatsheet (fast lookup, no drilling) →](./cheatsheet.md)**

</div>
