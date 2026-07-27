<div align="center">

# 🎓 Module 06 — Certification Prep

![Level](https://img.shields.io/badge/level-all%20levels-blueviolet.svg)
![Time](https://img.shields.io/badge/time-2--3%20hours-blue.svg)

**You don't need a certificate to be good at Git. But if a resume line or a certification exam wants proof, here's the fast, structured review pass.**

</div>

---

## 📑 In This Module

- [Do You Actually Need a Certification?](#-do-you-actually-need-a-certification)
- [Where to Get One](#-where-to-get-one)
- [The Full Review Checklist](#-the-full-review-checklist)
- [Rapid-Fire Concept Check](#-rapid-fire-concept-check)
- [Common Exam-Style Questions](#-common-exam-style-questions)
- [The "Explain It Out Loud" Test](#-the-explain-it-out-loud-test)

---

## 🤔 Do You Actually Need a Certification?

Honestly? For most jobs, no — a real GitHub profile with real commit history and a couple of
projects with clean, well-organized Git usage proves more than a certificate ever will. An
interviewer is far more likely to ask you to explain a merge conflict live than to ask if you're
certified.

**Where a certification genuinely helps:**
- Some corporate/government hiring pipelines have literal checkbox requirements
- It's a structured forcing function to make sure you didn't skip anything
- LinkedIn profile credibility signal, for what that's worth

**Where it doesn't help much:** convincing a technical interviewer, who will always weight "can
you actually do this" over "did you pass a multiple-choice test about it."

> [!TIP]
> If your actual goal is "prove I know Git" for a job search, a clean, well-documented GitHub
> profile with real projects (see [Module 07](../07-exercises-and-study-plan/)) is a stronger
> signal than a certificate, and it's free. Do both if you have time — do the real projects first
> if you only have time for one.

---

## 📜 Where to Get One

| Certification | Provider | Notes |
|---|---|---|
| **GitHub Foundations** | GitHub (official) | Covers Git basics + GitHub-specific workflows |
| **GitHub Actions** | GitHub (official) | If your role leans CI/CD-heavy |
| **LinkedIn Learning — Git Essential Training** | LinkedIn Learning | Course + completion certificate, not a formal exam |
| **freeCodeCamp — Git & GitHub** | freeCodeCamp | Free, hands-on, no cost barrier |
| **Atlassian Git certification paths** | Atlassian | If your target company uses Bitbucket specifically |

None of these require anything beyond what's already covered in Modules 00–05 of this course —
this module is purely the **review pass**, not new material.

---

## ✅ The Full Review Checklist

Go through this list. For anything you can't confidently explain out loud, jump back to that
module before moving on — don't just re-read, actually re-explain it to yourself or someone else.

**Foundations ([Module 00](../00-introduction/))**
- [ ] Difference between Git and GitHub
- [ ] Centralized vs. distributed version control, and why it matters
- [ ] Global vs. local config, and when each applies

**Fundamentals ([Module 01](../01-git-fundamentals/))**
- [ ] Why the staging area exists (not just "what it does")
- [ ] What makes a good commit message, and why
- [ ] Fast-forward vs. three-way merge
- [ ] When to reach for `git stash`

**Git + GitHub ([Module 02](../02-git-and-github/))**
- [ ] SSH keys — what they replace, and why they're safer
- [ ] `git fetch` vs. `git pull`, precisely
- [ ] What GitHub Flow actually is, step by step

**Contributing ([Module 03](../03-contributing-to-open-source/))**
- [ ] Fork vs. clone — what each actually creates
- [ ] `origin` vs. `upstream` in a fork workflow
- [ ] What makes a pull request likely to get merged quickly

**Undo & Recovery ([Module 04](../04-undo-and-recovery/))**
- [ ] `revert` vs. `reset`, and which is safe on shared history
- [ ] `--soft` vs. `--mixed` vs. `--hard`
- [ ] What `reflog` can and cannot recover

**Advanced ([Module 05](../05-advanced-git/))**
- [ ] `.gitignore` vs. `.gitattributes` — different jobs entirely
- [ ] What a merge conflict actually is, and how to resolve one calmly
- [ ] The difference between a local hook and a CI check

---

## ⚡ Rapid-Fire Concept Check

Answer each in one sentence, out loud, without looking anything up:

1. What's the staging area for?
2. What does `git status` tell you that you'll check constantly?
3. What's the difference between a branch and a tag?
4. Fast-forward merge vs. three-way merge — what determines which one happens?
5. What does `git stash` solve that committing doesn't?
6. `git fetch` vs `git pull` — what's the actual difference?
7. Why is `git push --force-with-lease` safer than `--force`?
8. `origin` vs `upstream` — in what context does this distinction exist?
9. `revert` vs `reset` — which one is safe on a branch others have already pulled?
10. What can `git reflog` recover, and what's the one thing it *can't*?
11. Why shouldn't you rebase a branch other people are actively working on?
12. What's the actual job of a `.gitignore` file vs a `.gitattributes` file?
13. What are the three sections of a merge conflict marker (`<<<<<<<`, `=======`, `>>>>>>>`)?
14. What's the difference between a `pre-commit` hook and a CI check?
15. What does a submodule actually track — a copy of code, or something else?

If you can answer all 15 without hesitation, you're genuinely ready for any Git-related interview
question or certification exam. If a few felt shaky, that's exactly what this checklist is for —
go fix those specific gaps, not everything.

---

## 📝 Common Exam-Style Questions

**Q: You need to undo a commit that's already been pushed and pulled by three teammates. What do
you use, and why?**
> `git revert` — it creates a new commit undoing the change instead of rewriting history, so your
> teammates' local copies don't conflict with the rewritten history a `reset` would cause.

**Q: What's the difference between `git merge` and `git rebase`?**
> Merge combines two branches' histories with a merge commit, preserving exact chronological
> reality. Rebase replays one branch's commits on top of another, producing clean linear history
> — but rewrites commit hashes, so it's only safe on branches nobody else has pulled.

**Q: A colleague says "I ran `git reset --hard` and lost my work, is it gone forever?"**
> Depends. If the work was **committed**, `git reflog` can almost certainly recover it. If it was
> **uncommitted** changes, it's genuinely gone — reflog only tracks commits, not working-directory
> state. This is the core argument for committing early and often.

**Q: What's a fast-forward merge, and why doesn't it create a merge commit?**
> It happens when the target branch (e.g. `main`) hasn't moved since the feature branch was
> created — Git just moves `main`'s pointer forward to match, since there's no divergent history
> to actually combine.

---

## 🗣️ The "Explain It Out Loud" Test

The single best certification prep, genuinely: explain **staging area**, **branching**, and
**merge conflicts** out loud to someone who's never used Git — a friend, a rubber duck, your
reflection in the mirror, doesn't matter. If you can make those three concepts click for someone
with zero context, using the real-life analogies from Modules 01 and 05 (the box you're packing,
parallel timelines, two editors changing the same sentence), you understand Git at a genuinely
solid level — deeper than most multiple-choice exams actually test for.

---

<div align="center">

**[⬆ Back to Top](#-module-06--certification-prep)** | **[🏠 Main README](../README.md)** | **[← Previous: Advanced Git](../05-advanced-git/)** | **[Next: Exercises & Study Plan →](../07-exercises-and-study-plan/)**

</div>
