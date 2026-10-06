#!/usr/bin/env python3
"""Validate this repo's own Markdown: balanced code fences, resolvable
relative links, and balanced custom HTML components (<div>/<details>).
Used locally and by .github/workflows/validate-docs.yml in CI.
"""
import os
import re
import sys
import glob

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def check_file(path):
    problems = []
    with open(path, encoding="utf-8") as fh:
        content = fh.read()

    fence_count = len(re.findall(r"^```", content, re.MULTILINE))
    if fence_count % 2 != 0:
        problems.append(f"Unbalanced code fences ({fence_count} found)")

    div_open = len(re.findall(r"<div\b", content))
    div_close = content.count("</div>")
    if div_open != div_close:
        problems.append(f"Unbalanced <div> tags ({div_open} open, {div_close} close)")

    details_open = content.count("<details>")
    details_close = content.count("</details>")
    if details_open != details_close:
        problems.append(f"Unbalanced <details> tags ({details_open} open, {details_close} close)")

    for match in re.finditer(r"\]\(([^)]+)\)", content):
        link = match.group(1)
        if link.startswith(("http://", "https://", "mailto:", "#")):
            continue
        path_part = link.split("#")[0]
        if not path_part:
            continue
        resolved = os.path.normpath(os.path.join(os.path.dirname(path), path_part))
        if not os.path.exists(resolved):
            problems.append(f"Broken relative link: {link}")

    return problems


def main():
    md_files = glob.glob(os.path.join(REPO_ROOT, "**", "*.md"), recursive=True)
    all_problems = {}
    for f in md_files:
        problems = check_file(f)
        if problems:
            all_problems[os.path.relpath(f, REPO_ROOT)] = problems

    if not all_problems:
        print(f"OK — {len(md_files)} Markdown files checked, no issues found.")
        return 0

    for f, problems in sorted(all_problems.items()):
        for p in problems:
            print(f"{f}: {p}")
    print(f"\n{sum(len(p) for p in all_problems.values())} issue(s) in {len(all_problems)} file(s).")
    return 1


if __name__ == "__main__":
    sys.exit(main())
