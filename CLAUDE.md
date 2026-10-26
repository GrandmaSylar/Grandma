# Git & Version Control Rules

These rules govern how you (the coding agent) interact with git in this repository. Follow them on every task. If a rule conflicts with an explicit instruction from the user in the current session, follow the user and mention the conflict.

---

## 1. Hard rules (never break these)

- **Never push directly to `main`** (or `master`). All changes go through a feature branch.
- **Never force-push with `--force`.** If a force-push is genuinely required on your own feature branch, use `--force-with-lease`, and only after telling the user.
- **Never rewrite shared history.** Do not rebase, amend, or reset commits that already exist on `main` or on any branch someone else may have pulled.
- **Never commit secrets.** No API keys, passwords, tokens, connection strings, private keys, or `.env` files. Use environment variables and keep `.env.example` updated with placeholder values instead.
- **Never skip hooks.** Do not use `--no-verify`. If a hook fails, fix the cause.
- **Never run destructive commands without asking first:** `git reset --hard`, `git clean -fd`, `git checkout -- .`, `git branch -D`, `git push --delete`, `git filter-repo`, history rewrites, or anything that discards uncommitted work.
- **Never modify global or system git config** (`git config --global ...`). Repo-local config changes require the user's approval.
- **Never commit large binaries or generated artifacts** (build output, `node_modules`, database dumps, generated PDFs, logs). Check `.gitignore` before staging.

---

## 2. Before starting work

1. Run `git status` to confirm the working tree is clean. If there are uncommitted changes you didn't make, stop and ask the user before touching them.
2. Sync with the remote: `git fetch` then make sure you branch from the latest `main`.
3. Create a short-lived branch for the task (see naming below). One branch per task.

---

## 3. Branch naming

Format: `<type>/<issue-id>-<short-description>` (issue ID optional if none exists)

- Lowercase, words separated by hyphens, no spaces or underscores.
- Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `ci`, `hotfix`

Examples:
```
feat/123-bulk-invoice-endpoint
fix/null-member-balance
chore/upgrade-dependencies
```

Branches should be short-lived (hours to a few days). Prefer feature flags over long-running branches for unfinished features.

---

## 4. Commits

### Format: Conventional Commits

```
<type>(<optional scope>): <subject>

<optional body: explain WHY, not what>

<optional footer: Closes #123 / BREAKING CHANGE: ...>
```

- **Types:** `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `chore`, `ci`, `build`, `revert`
- **Subject:** imperative mood ("add", not "added"/"adds"), lowercase start, no trailing period, max 72 characters.
- **Breaking changes:** add `!` after the type/scope (`refactor(api)!: rename AccountService`) and a `BREAKING CHANGE:` footer.
- **Body:** wrap at 72 characters. Explain the reasoning and any trade-offs; the diff already shows what changed.

Examples:
```
feat(billing): add bulk receipt generation
fix(db): handle null member_id during migration
refactor(auth)!: replace session tokens with JWT

BREAKING CHANGE: clients must send Authorization: Bearer <token>
```

### Commit discipline

- **Atomic commits:** one logical change per commit. Keep refactors, formatting changes, and behavior changes in separate commits.
- **Every commit must build and pass tests.** Do not commit known-broken code.
- **Stage deliberately.** Review `git diff --staged` before committing. Do not use `git add .` blindly; confirm nothing unintended (secrets, debug code, unrelated files) is staged.
- **No noise commits** like "wip", "fix", "updates", "asdf". Before the branch is shared, squash these using `git commit --fixup <sha>` and `git rebase -i --autosquash`.
- **Remove debug artifacts** (console logs, commented-out code, temporary files) before committing.

---

## 5. Keeping the branch up to date

- Update your branch by **rebasing onto `main`**, not merging `main` into it:
  ```
  git fetch origin
  git rebase origin/main
  ```
- Rebasing is only allowed on your own unshared branch. If the branch has been pushed and others may be using it, ask the user first.
- Resolve conflicts carefully. If a conflict involves logic you don't fully understand, stop and ask rather than guessing.

---

## 6. Pull requests

- Keep PRs small and focused: ideally under ~400 changed lines. Split larger work into stacked PRs.
- PR title follows Conventional Commit format.
- PR description must include: what changed, why, how it was tested, and any migration/deployment notes. Link the issue (`Closes #123`).
- All CI checks must pass before merge.
- Delete the branch after merge.

---

## 7. Security

- Before every commit, check staged files for secrets (keys, tokens, passwords, connection strings, private certificates).
- If a secret is ever committed, **stop immediately and tell the user.** The secret must be rotated first; cleaning history afterwards does not make it safe.
- Commit lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `pubspec.lock`, `poetry.lock`, etc.). Do not delete or regenerate them unless the task requires it.
- Treat database migrations and infrastructure config as code: version them, never edit an already-applied migration, and add a new one instead.

---

## 8. Releases & tags

- Use semantic versioning: `vMAJOR.MINOR.PATCH`.
- Use annotated tags: `git tag -a v1.4.2 -m "Release v1.4.2"`.
- Do not create or push tags unless the user asks.
- Deploy from `main` or tags, never from an unmerged branch.

---

## 9. Repo hygiene

- Keep `.gitignore` accurate when adding new tools, build outputs, or environment files.
- Keep `README.md` setup instructions correct when you change how the project runs, builds, or is configured.
- Keep `.env.example` in sync with any new environment variables.
- Large binary assets go in Git LFS or external storage, not regular git.

---

## 10. Reporting

When you finish a task that involved git, tell the user:
- the branch name,
- the commits you made (one line each),
- whether anything was pushed,
- anything you skipped or that needs their decision.
