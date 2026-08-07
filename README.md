# Algorithms Learning Portal

A **frontend-only** algorithms & data structures course: read Markdown lessons,
take quizzes, and track your progress — all in the browser, no backend required.
The course takes you from Big-O analysis and the core data structures to sorting,
graph algorithms, dynamic programming, and string matching.

The portal shell is built with React 19, Vite, TypeScript, React Router,
Tailwind CSS v4, marked, and PrismJS. The **content** it renders is a complete
24-lesson curriculum with all implementations in **Python 3**. Every complexity
claim, correctness argument, and code example is verified against authoritative
sources (see [Accuracy](#accuracy)).

## Features

- **Roadmap** of lessons grouped by level (beginner / intermediate / advanced).
- **Lesson reader** with Markdown rendering, Prism syntax highlighting, a table of
  contents, previous/next navigation, mark-complete, and bookmarking.
- **Quizzes** supporting five question types: single-choice, multiple-choice,
  fill-blank, ordering, and match-pair — with grading, review mode, and explanations.
- **Dashboard** with completion stats, per-level progress, and quiz history.
- **Search** and **bookmarks** pages.
- **Dark mode** with persistence, and a responsive layout.
- All progress persists to `localStorage` (under course-unique keys).

## Run it

```bash
npm install
npm run dev        # dev server (Vite) at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Project structure

```text
src/
├── core/
│   ├── models/        # Lesson, Quiz, Progress types + constants
│   ├── services/      # lesson/quiz loading, search, grading, asset URLs
│   ├── context/       # Course, Progress, Theme providers (React state)
│   └── hooks/         # useDocumentTitle, prism setup
├── shared/components/ # Navbar, Sidebar, Footer, LessonCard, TableOfContents,
│                      # LessonNavigation, LessonContent, QuizQuestion,
│                      # QuizProgress, QuizResult, AlgorithmsLogo, ScrollManager
├── features/          # home, roadmap, lesson, quiz, dashboard, search, bookmarks
├── App.tsx            # layout + lazy-loaded routes
└── main.tsx           # providers + bootstrap

public/
├── content/           # lesson Markdown + course-manifest.json
└── quizzes/           # one <lessonId>.json per quiz
```

## Curriculum

**Beginner — foundations & core structures:** algorithmic thinking & correctness ·
Big-O & complexity analysis · arrays & dynamic arrays · linked lists · stacks &
queues · hash tables · recursion & the call stack · elementary sorting.

**Intermediate — core algorithms & trees:** linear & binary search · divide &
conquer + merge sort · quicksort · heaps & heapsort · binary search trees ·
balanced trees (AVL / red-black) · graph representations & traversal (BFS/DFS) ·
non-comparison sorting.

**Advanced — design paradigms & graph algorithms:** dynamic programming (I & II) ·
greedy algorithms · shortest paths (Dijkstra / Bellman-Ford) · minimum spanning
trees (Kruskal / Prim) · union-find · backtracking · string matching (KMP).

## Adding content — no code changes required

### Add a lesson

1. Create a Markdown file under `public/content/<level>/`, e.g.
   `public/content/beginner/big-o-and-complexity-analysis.md`. Start it with YAML
   front-matter:

   ```md
   ---
   id: lesson-02
   slug: big-o-and-complexity-analysis
   title: "Big-O and Complexity Analysis"
   level: beginner
   order: 2
   duration: 26
   tags: [complexity, big-o, asymptotic-analysis, time, space]
   ---

   # Learning Objectives
   ...
   ```

2. Add a matching entry to `public/content/course-manifest.json`:

   ```json
   {
     "id": "lesson-02",
     "slug": "big-o-and-complexity-analysis",
     "title": "Big-O and Complexity Analysis",
     "level": "beginner",
     "order": 2,
     "duration": 26,
     "file": "beginner/big-o-and-complexity-analysis.md",
     "summary": "Asymptotic notation (O, Ω, Θ), best/worst/average case, and how to reason about time and space as input size grows.",
     "tags": ["complexity", "big-o", "asymptotic-analysis", "time", "space"]
   }
   ```

The lesson now appears in the roadmap, sidebar, search, and home — automatically.

> **Flash cards:** a heading titled `Flash Cards` followed by `Q: … / A: …` line
> pairs is auto-transformed into interactive flip cards.

> **Code fences** must declare one of the highlighted languages: `python`, `bash`,
> `json`, or `text` (use `text` for pseudocode and diagrams).

### Add a quiz

Create `public/quizzes/<lessonId>.json` (e.g. `public/quizzes/lesson-02.json`):

```json
{
  "id": "quiz-lesson-02",
  "lessonId": "lesson-02",
  "title": "Big-O and Complexity Analysis",
  "passingScore": 60,
  "questions": [
    { "id": "q1", "type": "single-choice", "prompt": "…",
      "options": [{ "id": "a", "text": "…" }], "answer": "a",
      "explanation": "…" }
  ]
}
```

Supported question `type` values: `single-choice`, `multiple-choice`,
`fill-blank`, `ordering`, `match-pair`.

## Accuracy

The course is written to a **no-hallucination** standard: every asymptotic bound,
stability/in-place claim, precondition, and code example is checked against
authoritative references before it ships. Primary sources:

- **CLRS** — Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed.
- **Sedgewick & Wayne**, *Algorithms*, 4th ed. (and algs4.cs.princeton.edu).
- **Skiena**, *The Algorithm Design Manual*, 3rd ed.
- **Official Python documentation** (docs.python.org) for language-specific behaviour
  (`list`, `dict`/`set`, `heapq`, `bisect`, `collections.deque`, recursion limits).

The per-lesson authoring contract lives in [`prompts/`](prompts/).

## Tech stack

React 19 · Vite · TypeScript · React Router · Tailwind CSS v4 · marked · PrismJS ·
localStorage. All lesson code is **Python 3**.

## Deploying to GitHub Pages

This repo ships a GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
that builds the site and publishes it to GitHub Pages on every push to `main`.

One-time setup:

1. In the repo on GitHub, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
2. Push to `main` (or run the workflow manually from the **Actions** tab).

The site is then served at `https://<user>.github.io/<repo>/`. How it works:

- The workflow builds with `BASE_PATH=/<repo>/`, which sets Vite's `base` so all
  assets and content resolve under the sub-path. `<BrowserRouter basename>` is
  aligned to the same value, so client-side routes work too.
- A `postbuild` step copies `dist/index.html` to `dist/404.html`, giving the SPA a
  fallback so deep links and refreshes (e.g. `/<repo>/lesson/…`) load correctly.

> If you deploy to a **user/organization site** (`<user>.github.io`) instead of a
> project site, the base path is `/` — set `BASE_PATH: /` in the workflow.

For other static hosts (Netlify, Vercel), the `dist/` output works as-is; just
configure an SPA fallback to `index.html`.
