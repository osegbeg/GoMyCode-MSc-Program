# Version Control, Continuous Integration (CI) & Quality Assurance (QA)

## Part 1: Version Control Workflow (Git & GitHub)
* **Repository & Branching:** Changes are developed on isolated feature branches (e.g., `feature/task-manager-qa`) branched from `main`, committed in small logical increments, and merged back into `main` via Pull Requests (PRs).
* **Collaboration & Conflict Resolution:** When syncing updates from `main` into a feature branch (`git fetch origin` / `git merge origin/main` or `git rebase origin/main`), any conflicting lines in shared files are resolved locally, verified with tests/linting, and committed before merging.

## Part 2: Continuous Integration Pipeline
Configured in `.github/workflows/ci.yml` using **GitHub Actions** to trigger on pushes to `main` and `feature/**` branches as well as pull requests targeting `main`:
1. Checks out code and sets up Node.js 20.
2. Installs dependencies cleanly (`npm ci`).
3. Runs style/error checks (`npm run lint`), unit tests (`npm test`), and build verification (`npm run build`).
4. Reports pass/fail status directly on commits and pull requests via GitHub Actions status checks/notifications.

## Part 3: Quality Assurance (QA) Report

### Unit Tests Written (`test/taskManager.test.js`)
* **Task creation & validation:** Verifies whitespace trimming, default/valid priority assignment (`Low`, `Medium`, `High`), fallback to `Medium` for invalid priority strings, and error handling when a title is blank.
* **Completion toggling:** Verifies immutable state flipping (`completed: false -> true`) without mutating the original task object.
* **Priority filtering:** Verifies accurate filtering of task arrays by priority level.

### Linter Checks & Style Issues Addressed
* Configured **ESLint** (`eslint.config.js`) enforcing strict equality (`===`), `prefer-const`, and unused-variable checks (`no-unused-vars`).
* Addressed loose equality comparisons, mutable variable declarations where values were never reassigned, and consistent formatting prior to merging.

### Code Review Summary
* Reviewed PR changes for clear function boundaries, input validation, edge-case test coverage, and readable commit messages before approving merges into `main`.

---

## Reflection Report

Practicing version control, continuous integration, and quality assurance together made it clear how small engineering habits prevent late-stage integration headaches. Early on, navigating Git branch merges, resolving conflicting edits, wiring up GitHub Actions paths, and tuning linter rules required careful attention to detail, especially when aligning local scripts with automated CI runs.

Setting up a CI pipeline streamlined development by giving fast, consistent feedback on every push and pull request. Instead of relying on manual checks or hoping changes do not break existing logic, automated linting, unit tests, and build verification catch syntax errors, regressions, and style mismatches right away. That immediate feedback loop keeps the main branch healthier and reduces time spent hunting down avoidable bugs later.

Combining Git branching with QA practices noticeably improved both code quality and collaboration. Working on isolated branches kept experimental changes separate until ready, while pull requests and peer reviews encouraged clearer logic, stronger input validation, and better test coverage. Together, version control, CI, and QA turn individual code edits into a more reliable, maintainable shared codebase.
