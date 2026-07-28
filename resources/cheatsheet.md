<div align="center" markdown="1">

# 📖 Git Cheatsheet — One-Page Reference

### Not for learning. For the moment you already know the command but blanked on the flag.

</div>

---

> [!TIP]
> Trying to actually **memorize** these instead of just looking them up? Use the
> [Command Recall Drill](./command-recall-drill.md) instead — this page is deliberately just a
> flat reference, no quizzing.

## Setup

```bash
git init                                   # start tracking a folder
git config --global user.name "Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git clone <url>                            # copy a remote repo locally
```

## Daily Loop

```bash
git status                                 # what's going on right now
git add <file>                             # stage a specific file
git add .                                  # stage everything (check status first!)
git add -p                                 # stage interactively, chunk by chunk
git commit -m "message"                    # save a snapshot
git commit --amend --no-edit               # add a forgotten file to the last commit
git log --oneline                          # condensed history
git log --graph --oneline --all            # visual branch history
```

## Branching & Merging

```bash
git branch                                 # list branches
git checkout -b feature/name               # create + switch, one command
git switch feature/name                    # switch (modern alternative to checkout)
git merge feature/name                     # merge into current branch
git branch -d feature/name                 # delete (safe, refuses if unmerged)
git branch -D feature/name                 # force delete
```

## Remote / GitHub

```bash
git remote add origin <url>
git remote -v                              # list remotes
git push -u origin main                    # first push, sets upstream
git push                                   # every push after that
git fetch origin                           # check for updates, don't merge
git pull origin main                       # fetch + merge in one step
git push --force-with-lease                # safer forced push
```

## Stash

```bash
git stash                                  # shelve current changes
git stash pop                              # bring back + remove from stash
git stash list                             # see what's shelved
git stash push -m "note"                   # stash with a label
```

## Undo & Recovery

```bash
git revert <hash>                          # undo via a new commit — safe on shared branches
git reset --soft HEAD~1                    # undo commit, keep staged
git reset --mixed HEAD~1                   # undo commit, keep unstaged
git reset --hard HEAD~1                    # undo commit, discard changes (dangerous)
git reflog                                 # find "lost" commits — the real safety net
git branch recovery HEAD@{1}               # recover a lost commit safely
git cherry-pick <hash>                     # apply one specific commit here
```

## Tags

```bash
git tag -a v1.0.0 -m "message"             # annotated tag (use this one)
git push origin v1.0.0                     # tags don't push automatically
git push origin --tags                     # push all tags
```

## Fork Workflow

```bash
git remote add upstream <original-repo-url>
git fetch upstream
git merge upstream/main                    # sync your fork with the original
```

## Advanced

```bash
git rm --cached <file>                     # stop tracking, keep the file locally
git rebase main                            # replay commits on a new base — own branch only
git merge --abort                          # bail out of a conflicted merge
git remote prune origin                    # clean up stale remote-tracking branches
git format-patch -1 HEAD                   # export last commit as a patch file
git commit -S -m "message"                 # signed commit
```

---

<div align="center" markdown="1">

**[🏠 Main README](../README.md)** | **[🧠 Command Recall Drill (memorize these) →](./command-recall-drill.md)**

</div>
